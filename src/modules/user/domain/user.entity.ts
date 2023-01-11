import { BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '@core/domain/base.entity';
import { compareSync, hashSync } from 'bcrypt';
import { RoleEntity } from '@modules/user/domain/role.entity';
import { DepartmentEntity } from '@modules/authority/domain/department.entity';
import { RegionEntity } from '@modules/authority/domain/region.entity';
import { SubdivisionEntity } from '@modules/authority/domain/subdivision.entity';
import { RoleDibEntity } from '@modules/authority/domain/role-dib.entity';
import { UserInGroupEntity } from '@modules/group/domain/group.entity';

export enum GenderEnum {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

@Entity('user')
export class UserEntity extends BaseEntity {
  @Column({ type: 'text', nullable: false, unique: true, comment: 'Логин' })
  login: string;

  @Column({ type: 'text', nullable: false, comment: 'Пароль' })
  password: string;

  @ManyToOne(() => RoleEntity, {
    cascade: true,
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  role: RoleEntity;

  @Column({ nullable: true, comment: 'ID роли' })
  roleId: string;

  @Column({ type: 'text', nullable: true, comment: 'Почта' })
  email?: string;

  @Column({ type: 'text', default: '', comment: 'Имя' })
  firstName: string;

  @Column({ type: 'text', default: '', comment: 'Отчество' })
  middleName?: string;

  @Column({ type: 'text', default: '', comment: 'Фамилия' })
  lastName: string;

  @Column({ type: 'text', nullable: true, comment: 'ФИО' })
  fullName?: string;

  @Column({ type: 'text', nullable: true, comment: 'Организация' })
  organization?: string;

  @Column({ type: 'text', nullable: true, comment: 'Институт' })
  institution?: string;

  @Column({ type: 'text', nullable: true, comment: 'Пол' })
  gender?: GenderEnum | string;

  @Column({ type: 'timestamp', nullable: true, comment: 'Действителен с' })
  validityFrom?: Date;

  @Column({ type: 'timestamp', nullable: true, comment: 'Действителен по' })
  validityTo?: Date;

  @Column({
    type: 'boolean',
    nullable: true,
    comment: 'Требуется ли заполнение персональных данных',
  })
  isPersonalDataRequired?: boolean;

  @ManyToOne(() => DepartmentEntity)
  @JoinColumn({ name: 'departmentId' })
  department?: DepartmentEntity;

  @Column({ nullable: true, comment: 'ID ведомства' })
  departmentId?: string;

  @ManyToOne(() => RegionEntity)
  @JoinColumn({ name: 'regionId' })
  region?: RegionEntity;

  @Column({ nullable: true, comment: 'ID региона' })
  regionId?: string;

  @ManyToOne(() => SubdivisionEntity)
  @JoinColumn({ name: 'subdivisionId' })
  subdivision?: SubdivisionEntity;

  @Column({ nullable: true, comment: 'ID подразделения' })
  subdivisionId?: string;

  @ManyToOne(() => RoleDibEntity)
  @JoinColumn({ name: 'roleDibId' })
  roleDib?: RoleDibEntity;

  @Column({ nullable: true, comment: 'ID ДИБ роли' })
  roleDibId: string;

  @OneToMany(() => UserInGroupEntity, userInGroup => userInGroup.user, {
    onDelete: 'SET NULL'
  })
  groups: UserInGroupEntity[];

  constructor(
    login: string,
    password: string,
    role?: RoleEntity,
    firstName?: string,
    lastName?: string,
    email?: string,
    middleName?: string,
    organization?: string,
    institution?: string,
    validityFrom?: Date,
    validityTo?: Date,
    gender?: GenderEnum,
    isPersonalDataRequired?: boolean,
    department?: DepartmentEntity,
    region?: RegionEntity,
    subdivision?: SubdivisionEntity,
    roleDib?: RoleDibEntity,
  ) {
    super();
    this.login = login?.trim();
    this.password = this.hashPassword(password || '');
    this.role = role;
    this.email = email ? email.trim() : null;
    this.firstName = firstName ? firstName.trim() : '';
    this.middleName = middleName ? middleName.trim() : '';
    this.lastName = lastName ? lastName.trim() : '';
    this.fullName = this.getFullName(lastName, firstName, middleName);
    this.organization = organization ? organization.trim() : null;
    this.institution = institution ? institution.trim() : null;
    this.gender = gender || '';
    this.department = department;
    this.region = region;
    this.isPersonalDataRequired = isPersonalDataRequired;
    this.subdivision = subdivision;
    this.roleDib = roleDib;
    this.validityFrom = validityFrom;
    this.validityTo = validityTo;
  }

  private hashPassword(password: string) {
    return hashSync(password, 5);
  }

  private getFullName(lastName?: string, firstName?: string, middleName?: string) {
    if (lastName && firstName)
      return lastName.trim() + ' ' + firstName.trim() + (middleName ? ' ' + middleName.trim() : '');
    return '';
  }

  isPasswordValid(passwordToCompare: string) {
    return compareSync(passwordToCompare, this.password);
  }

  update(
    password: string,
    role: RoleEntity,
    firstName?: string,
    lastName?: string,
    email?: string,
    middleName?: string,
    organization?: string,
    institution?: string,
    validityFrom?: Date,
    validityTo?: Date,
    isPersonalDataRequired?: boolean,
    gender?: GenderEnum,
    department?: DepartmentEntity,
    region?: RegionEntity,
    subdivision?: SubdivisionEntity,
    roleDib?: RoleDibEntity,
  ) {
    password && (this.password = this.hashPassword(password));
    this.role = role;
    this.email = email ? email.trim() : null;
    this.firstName = firstName ? firstName.trim() : '';
    this.middleName = middleName ? middleName.trim() : '';
    this.lastName = lastName ? lastName.trim() : '';
    this.fullName = this.getFullName(lastName, firstName, middleName);
    this.organization = organization ? organization.trim() : null;
    this.institution = institution ? institution.trim() : null;
    this.gender = gender;
    this.department = department;
    this.region = region;
    this.isPersonalDataRequired = isPersonalDataRequired;
    this.subdivision = subdivision;
    this.roleDib = roleDib;
    this.validityFrom = validityFrom;
    this.validityTo = validityTo;
  }

  updateProfile(
    firstName: string,
    lastName: string,
    middleName?: string,
    email?: string,
    organization?: string,
    institution?: string,
    gender?: GenderEnum,
    password?: string,
  ) {
    if (password) {
      this.password = this.hashPassword(password);
      this.isPersonalDataRequired = false;
    }
    this.firstName = firstName ? firstName.trim() : '';
    this.lastName = lastName ? lastName.trim() : '';
    this.middleName = middleName ? middleName.trim() : '';
    this.fullName = this.getFullName(lastName, firstName, middleName);
    this.organization = organization ? organization.trim() : null;
    this.institution = institution ? institution.trim() : null;
    this.email = email ? email.trim() : null;
    this.gender = gender;
  }

  isValidityCorrect() {
    if (!this.validityFrom && !this.validityTo) return true;
    if (this.validityFrom && !this.validityTo) return this.validityFrom < new Date();
    if (!this.validityFrom && this.validityTo) return this.validityTo > new Date();
    return this.validityFrom < new Date() && this.validityTo > new Date();
  }

  toJSON() {
    const { password, ...rest } = this;
    return rest;
  }
}
