import { Injectable } from '@nestjs/common';
import { Express } from 'express';
import * as ExcelJs from 'exceljs';
import { Readable } from 'stream';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '@modules/user/infrastructure/database/user.repository';
import { RoleRepository } from '@modules/user/infrastructure/database/role.repository';
import {
  DepartmentRepository,
  RegionRepository,
  RoleDibRepository,
  SubdivisionRepository,
} from '@modules/authority/infrastructure/database/authority.repository';
import { isDate, isEqual, uniq, uniqBy } from 'lodash';
import { SubdivisionEntity } from '@modules/authority/domain/subdivision.entity';
import { RoleDibEntity } from '@modules/authority/domain/role-dib.entity';
import { UserException } from '@modules/user/infrastructure/exceptions/user.exception';
import { ImportDibUserDto } from '@src/modules/user/controllers/dtos/import-dib-user.dto';
import { RegionEntity } from '@modules/authority/domain/region.entity';
import { DepartmentEntity } from '@modules/authority/domain/department.entity';
import { CreateUserService } from '@modules/user/application/create-user.service';
import { UserEntity } from '@modules/user/domain/user.entity';
import { GroupRepository } from '@modules/group/infrastructure/database/group.repository';
import { GroupEntity, UserInGroupEntity } from '@modules/group/domain/group.entity';
import { parse } from 'date-fns';
import { isValidDate } from '@core/libs/is-valid-date';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { DibUsersImportEvent } from '@modules/event/infrastructure/events/dib-users-import.event';
const iconv = require('iconv-lite')

interface ParsedUser {
  login: string;
  departmentId: string;
  regionId: string;
  subdivisionId: string;
  subdivisionTitle: string;
  roleDibId: string;
  roleDibTitle: string;
  validityFrom: string;
  validityTo: string;
}

export interface ValidationError {
  type: 'region' | 'department' | 'subdivision' | 'roleDib';
  foreignId: string;
}

export interface IGroupedUsersByGroupTitle {
  groupTitle: string;
  users: UserEntity[];
}

export const headerRowArray = [
  '№ ПП',
  'Логин ДО и ТП',
  'Ведомство_ID',
  'Регион_ID',
  'Подразделение_ID',
  'Подразделение',
  'Роль_ID',
  'Роль',
  'Дата действия с',
  'Дата действия по',
];

@Injectable()
export class ImportDibUserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(RoleRepository)
    private roleRepository: RoleRepository,
    @InjectRepository(DepartmentRepository)
    private departmentRepository: DepartmentRepository,
    @InjectRepository(RegionRepository)
    private regionRepository: RegionRepository,
    @InjectRepository(SubdivisionRepository)
    private subdivisionRepository: SubdivisionRepository,
    @InjectRepository(RoleDibRepository)
    private roleDibRepository: RoleDibRepository,
    @InjectRepository(GroupRepository)
    private groupRepository: GroupRepository,
    private createUserService: CreateUserService,
    private eventEmitter: EventEmitter2,
  ) {}

  async validateUsersForImport(file: Express.Multer.File, userId: string) {
    const parsedUsers = await this.parseExcel(file, userId);
    const departmentIds = uniq(parsedUsers.map(u => u.departmentId));
    const regionIds = uniq(parsedUsers.map(u => u.regionId));
    const subdivisions = uniqBy(
      parsedUsers.map(u => ({
        subdivisionId: u.subdivisionId,
        subdivisionTitle: u.subdivisionTitle,
      })),
      obj => obj.subdivisionId,
    );
    const rolesDib = uniqBy(
      parsedUsers.map(u => ({
        roleDibId: u.roleDibId,
        roleDibTitle: u.roleDibTitle,
      })),
      obj => obj.roleDibId,
    );
    const [regionErrors, departmentErrors, subdivisionErrors, roleDibErrors] = await Promise.all([
      this.validateRegions(regionIds),
      this.validateDepartments(departmentIds),
      this.validateSubdivisions(subdivisions),
      this.validateRolesDib(rolesDib),
    ]);
    return { regionErrors, departmentErrors, subdivisionErrors, roleDibErrors };
  }

  async importUsers(file: Express.Multer.File, { missingData, roleId, addInGroup }: ImportDibUserDto, userId: string) {
    await Promise.all(
      missingData.map(d => {
        switch (d.type) {
          case 'region':
            const region = new RegionEntity(d.title, d.foreignId);
            return this.regionRepository.save(region);
          case 'department':
            const department = new DepartmentEntity(d.title, d.foreignId);
            return this.departmentRepository.save(department);
          case 'roleDib':
            const roleDib = new RoleDibEntity(d.title, d.foreignId);
            return this.roleDibRepository.save(roleDib);
          case 'subdivision':
            const subdivision = new SubdivisionEntity(d.title, d.foreignId);
            return this.subdivisionRepository.save(subdivision);
        }
      }),
    );
    const parsedUsers = await this.parseExcel(file, userId);
    if (!parsedUsers.length)
      UserException.DataRowMissing(
        'Пользователи',
        `Пользователь id=${userId}. Попытка импорта пользователей из файла с отсутствием строки с данными`,
      );
    if (parsedUsers.find(u => !u.login))
      UserException.LoginMissing(
        'Пользователи',
        `Пользователь id=${userId}. Попытка импорта пользователей из файла с отсутствием логина`,
      );
    const users = await Promise.all(
      parsedUsers.map(u =>
        this.createUserService.create(
          {
            login: u.login,
            password: u.login,
            departmentId: u.departmentId,
            regionId: u.regionId,
            subdivisionId: u.subdivisionId,
            roleDibId: u.roleDibId,
            roleId: roleId,
            isPersonalDataRequired: true,
            validityFrom: u.validityFrom,
            validityTo: u.validityTo,
          },
          userId,
          true,
        ),
      ),
    );
    if (addInGroup) {
      await this.addInGroup(users);
    }
    this.eventEmitter.emit(EventActionEnum.DIB_USERS_IMPORT, new DibUsersImportEvent(users));
    return { success: true };
  }

  private async addInGroup(users: UserEntity[]) {
    const groupedUsers = users.reduce<IGroupedUsersByGroupTitle[]>((result, user) => {
      const groupTitle = user.region.title + ' ' + user.department.title + ' ' + user.roleDib.title;
      const inResult = result.find(r => r.groupTitle === groupTitle);
      if (inResult) {
        inResult.users.push(user);
      } else {
        result.push({
          users: [user],
          groupTitle,
        });
      }
      return result;
    }, []);
    await Promise.all(
      groupedUsers.map(grouped => {
        return this.groupRepository.findByTitle(grouped.groupTitle).then(group => {
          if (group) {
            const usersInGroups = grouped.users
              .filter(u => !group.alreadyInGroup(u.id))
              .map(u => new UserInGroupEntity(group, u));
            group.addUsers(usersInGroups);
            return this.groupRepository.save(group);
          } else {
            const usersInGroups = grouped.users.map(u => new UserInGroupEntity(group, u));
            const newGroup = new GroupEntity(grouped.groupTitle, '');
            newGroup.addUsers(usersInGroups);
            return this.groupRepository.save(newGroup);
          }
        });
      }),
    );
  }

  private async parseExcel(file: Express.Multer.File, userId: string) {
    const tempString = iconv.decode(file.buffer, 'win1251')
    const tempBuffer = iconv.encode(tempString, 'utf8')
    const workbook = new ExcelJs.Workbook();
    const worksheet = await workbook.csv.read(Readable.from(tempBuffer));
    const parsedUsers: ParsedUser[] = [];
    const headerRow = worksheet.getRow(1).values[1].split(';');
    if (headerRow.length !== 10)
      UserException.ColumnLengthMismatch(
        'Пользователи',
        `Пользователь id=${userId}. Попытка импорта пользователей из файла с некорректным числом столбцов`,
      );
    if (!isEqual(headerRow, headerRowArray))
      UserException.ColumnNameMismatch(
        'Пользователи',
        `Пользователь id=${userId}. Попытка импорта пользователей из файла с некорректным названием столбцов`,
      );
    let i = 2;
    while (worksheet.getRow(i).values[1]) {
      const split = worksheet.getRow(i).values[1].split(';');
      const dateFrom = parse(split[8], 'dd.MM.yy', new Date());
      const dateTo = parse(split[9], 'dd.MM.yy', new Date());
      parsedUsers.push({
        login: split[1],
        departmentId: split[2],
        regionId: split[3],
        subdivisionId: split[4],
        subdivisionTitle: split[5],
        roleDibId: split[6],
        roleDibTitle: split[7],
        validityFrom: isValidDate(dateFrom) ? dateFrom.toISOString() : undefined,
        validityTo: isValidDate(dateTo) ? dateTo.toISOString() : undefined,
      });
      i++;
    }
    return parsedUsers;
  }

  private async validateRegions(regionIds: string[]) {
    const errors: ValidationError[] = [];
    await Promise.all(
      regionIds.map(id =>
        this.regionRepository.findById(id).then(region => {
          if (!region && id) errors.push({ type: 'region', foreignId: id });
        }),
      ),
    );
    return errors;
  }

  private async validateDepartments(departmentIds: string[]) {
    const errors: ValidationError[] = [];
    await Promise.all(
      departmentIds.map(id =>
        this.departmentRepository.findById(id).then(region => {
          if (!region && id) errors.push({ type: 'department', foreignId: id });
        }),
      ),
    );
    return errors;
  }

  private async validateSubdivisions(subdivisions: { subdivisionId: string; subdivisionTitle: string }[]) {
    const errors: ValidationError[] = [];
    await Promise.all(
      subdivisions.map(subdivision =>
        this.subdivisionRepository.findById(subdivision.subdivisionId).then(sub => {
          if (!sub && subdivision.subdivisionTitle && subdivision.subdivisionId) {
            const newSubdivision = new SubdivisionEntity(subdivision.subdivisionTitle, subdivision.subdivisionId);
            return this.subdivisionRepository.save(newSubdivision);
          } else if (!sub && subdivision.subdivisionId) {
            errors.push({
              type: 'subdivision',
              foreignId: subdivision.subdivisionId,
            });
          }
        }),
      ),
    );
    return errors;
  }

  private async validateRolesDib(rolesDib: { roleDibId: string; roleDibTitle: string }[]) {
    const errors: ValidationError[] = [];
    await Promise.all(
      rolesDib.map(roleDib =>
        this.roleDibRepository.findById(roleDib.roleDibId).then(role => {
          if (!role && roleDib.roleDibTitle && roleDib.roleDibId) {
            const newRoleDib = new RoleDibEntity(roleDib.roleDibTitle, roleDib.roleDibId);
            return this.roleDibRepository.save(newRoleDib);
          } else if (!role && roleDib.roleDibId) {
            errors.push({ type: 'roleDib', foreignId: roleDib.roleDibId });
          }
        }),
      ),
    );
    return errors;
  }
}
