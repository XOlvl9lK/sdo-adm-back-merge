import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/modules/user/infrastructure/database/user.repository';
import { CreateUserService } from 'src/modules/user/application/create-user.service';
import { UserException } from 'src/modules/user/infrastructure/exceptions/user.exception';
import { In } from 'typeorm';
import { DepartmentRepository } from '@modules/authority/infrastructure/database/authority.repository';
import { isDate } from 'class-validator';
import { GenderEnum } from 'src/modules/user/domain/user.entity';
import { ImportUserDto } from 'src/modules/user/controllers/dtos/import-user.dto';
import { CreateGroupService } from '@modules/group/application/create-group.service';
import { UpdateGroupService } from '@modules/group/application/update-group.service';
import * as XlsxReader from 'xlsx';

interface ParsedUser {
  index: number;
  login: string;
  password: string;
  lastName: string;
  firstName: string;
  middleName: string;
  gender?: GenderEnum;
  email: string;
  organization: string;
  institution: string;
  validityFrom?: Date;
  validityTo?: Date;
}

export interface ValidateObject {
  index: number;
  messages: string[];
}

export class ImportUserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(DepartmentRepository)
    private departmentRepository: DepartmentRepository,
    private createGroupService: CreateGroupService,
    private createUserService: CreateUserService,
    private updateGroupService: UpdateGroupService,
  ) {}

  private headerRows = [
    '№',
    'Логин',
    'Пароль',
    'Фамилия',
    'Имя',
    'Отчество',
    'Пол (М/Ж)',
    'E-mail',
    'Организация',
    'Департамент',
    'Период действия c (ДД.ММ.ГГГГ)',
    'Период действия по (ДД.ММ.ГГГГ)',
  ];

  async validateUsers(file: Buffer, userId: string) {
    const users = await this.getUsers(file, userId);
    return await this.validateUserFields(users);
  }

  async importUsers(file: Buffer, { roleId, groupType, isPersonalDataRequired, groupTitle, groupId }: ImportUserDto, userId: string) {
    const users = await this.getUsers(file, userId);
    const isUsersValid = (await this.validateUserFields(users)).length < 1;
    if (!isUsersValid) return { success: false };
    const entities = await Promise.all(
      users.map(user =>
        this.createUserService.create(
          {
            email: user.email,
            login: user.login,
            password: user.password,
            firstName: user.firstName,
            middleName: user.middleName,
            lastName: user.lastName,
            gender: user.gender,
            organization: user.organization,
            institution: user.institution,
            validityFrom: user.validityFrom ? user.validityFrom.toString() : undefined,
            validityTo: user.validityTo ? user.validityTo.toString() : null,
            roleId,
            isPersonalDataRequired,
          },
          userId,
          false,
        ),
      ),
    );
    switch (groupType) {
      case 'EXIST':
        await this.updateGroupService.addUsers({
          groupId,
          userIds: entities.map(({ id }) => id),
        });
        break;
      case 'CREATE':
        const entity = await this.createGroupService.create({ title: groupTitle, description: '' }, userId);
        await this.updateGroupService.addUsers({
          groupId: entity.id,
          userIds: entities.map(({ id }) => id),
        });
        break;
    }
    return { success: true };
  }

  private async getUsers(file: Buffer, userId: string): Promise<ParsedUser[]> {
    const data = await this.parseFile(file, userId);
    return this.mapDataToUsers(data);
  }

  private async parseFile(file: Buffer, userId: string): Promise<string[][]> {
    const { headerRows } = this;
    const workbook = XlsxReader.read(file, {
      cellDates: true,
    });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    for (const [index, headerValue] of headerRows.entries()) {
      const cellIndex = `${String.fromCharCode('A'.charCodeAt(0) + index)}1`;
      const headerCell = worksheet[cellIndex];
      if (!headerCell)
        UserException.ColumnLengthMismatch(
          'Пользователи',
          `Пользователь id=${userId}. Попытка импорта пользователей из файла с некорректным числом столбцов`,
        );
      if (headerCell.v !== headerValue)
        UserException.ColumnNameMismatch(
          'Пользователи',
          `Пользователь id=${userId}. Попытка импорта пользователей из файла с некорректным названием столбцов`,
        );
    }
    const data = XlsxReader.utils.sheet_to_json(worksheet);
    return data.map(row => headerRows.map(headerName => row[headerName]?.toString() || undefined));
  }

  private mapDataToUsers(data: string[][]): ParsedUser[] {
    return data.map(row => {
      return ({
        index: Number.parseInt(row[0]),
        login: row[1],
        password: row[2],
        lastName: row[3] || '',
        firstName: row[4] || '',
        middleName: row[5] || '',
        gender: (row[6] || '') ? (row[6] || '').toLocaleLowerCase().includes('м') ? GenderEnum.MALE : GenderEnum.FEMALE : '' as any,
        email: row[7],
        organization: row[8] || '',
        institution: row[9] || '',
        validityFrom: row[10] ? new Date(row[10]) : null,
        validityTo: row[11] ? new Date(row[11]) : null,
      })
    });
  }

  private async validateUserFields(users: ParsedUser[]): Promise<ValidateObject[]> {
    const parsedLogins = users.map((user) => user.login).filter((login) => Boolean(login));
    const existingLogins = (await this.userRepository.find({ select: ['login'], where: { login: In(parsedLogins) } })).map((user) => user.login);
    const loginSet = new Set<string>();
    existingLogins.forEach((login) => loginSet.add(login));
    const fileLoginDuplicates = this.getDuplicateLogins(users.map(({ login }) => login));
    return users.flatMap((user) => {
      const validateObject = { index: user.index, messages: [] };
      const messages = validateObject.messages;
      if (!user.login) messages.push('Не указан логин');
      else {
        if (loginSet.has(user.login)) 
          messages.push('Данный логин уже используется');
        if (fileLoginDuplicates.has(user.login)) {
          const indexes = fileLoginDuplicates.get(user.login);
          messages.push(`Данный логин дублируется в строках: ${indexes.join(',')}`);
        }
      }
      if (!user.password) messages.push('Не указан пароль');
      if (user.validityFrom && !isDate(user.validityFrom)) messages.push('Некорректный период действия с');
      if (user.validityTo && !isDate(user.validityTo)) messages.push('Некорректный период действия по');
      return validateObject.messages.length ? [validateObject] : [];
    });
  }

  getDuplicateLogins(logins: string[]): Map<string, number[]> {
    const map = new Map<string, number[]>();
    logins.forEach((login, i) => {
      const array = map.get(login) || [];
      array.push(i);
      map.set(login, array);
    });
    const filtered = new Map<string, number[]>();
    for (const [login, indexes] of map.entries()) if (indexes.length > 1) filtered.set(login, indexes);
    return filtered;
  }
}
