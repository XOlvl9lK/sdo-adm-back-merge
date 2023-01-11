import { Random } from '@core/test/random';
import { plainToInstance } from 'class-transformer';
import { GenderEnum, UserEntity } from '@modules/user/domain/user.entity';
import { compareSync, hashSync } from 'bcrypt';
import { mockBaseEntity } from '@core/domain/base.entity.mock';
import { DepartmentEntity } from '@modules/authority/domain/department.entity';
import { RegionEntity } from '@modules/authority/domain/region.entity';
import { RoleDibEntity } from '@modules/authority/domain/role-dib.entity';
import { SubdivisionEntity } from '@modules/authority/domain/subdivision.entity';
import { mockRoleInstance } from '@modules/user/domain/role.entity.spec';
import { RoleEntity } from '@modules/user/domain/role.entity';

const hashPassword = hashSync('password', 5);

export const mockDepartmentInstance: DepartmentEntity = {
  id: Random.id,
  title: Random.lorem,
};

export const mockRegionInstance: RegionEntity = {
  id: Random.id,
  title: Random.lorem,
};

export const mockRoleDibInstance: RoleDibEntity = {
  id: Random.id,
  title: Random.lorem,
};

export const mockSubdivisionInstance: SubdivisionEntity = {
  id: Random.id,
  title: Random.lorem,
};

export const mockUser = {
  ...mockBaseEntity,
  login: Random.firstName,
  password: Random.password,
  email: Random.email,
  firstName: Random.firstName,
  lastName: Random.lastName,
  middleName: Random.middleName,
  validityFrom: Random.datePast,
  validityTo: Random.dateFuture,
  role: mockRoleInstance,
  organization: Random.lorem,
  institution: Random.lorem,
  gender: GenderEnum.MALE,
  department: mockDepartmentInstance,
  region: mockRegionInstance,
  isPersonalDataRequired: false,
  subdivision: mockSubdivisionInstance,
  roleDib: mockRoleDibInstance,
  fullName: Random.firstName,
};

export const mockUserInstance = {
  ...mockUser,
  hashPassword(password: string) {
    return hashSync(password, 5);
  },
  getFullName(lastName: string, firstName: string, middleName?: string) {
    return lastName + ' ' + firstName + (middleName ? ' ' + middleName : '');
  },
  isPasswordValid(passwordToCompare: string) {
    return compareSync(passwordToCompare, this.password);
  },
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
    this.email = email;
    firstName && (this.firstName = firstName);
    middleName && (this.middleName = middleName);
    lastName && (this.lastName = lastName);
    this.organization = organization;
    this.institution = institution;
    gender && (this.gender = gender);
    this.department = department;
    this.region = region;
    this.isPersonalDataRequired = isPersonalDataRequired;
    this.subdivision = subdivision;
    this.roleDib = roleDib;
    this.validityFrom = validityFrom;
    this.validityTo = validityTo;
    if (lastName && firstName) this.fullName = this.getFullName(lastName, firstName, middleName);
  },
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
    this.firstName = firstName;
    this.lastName = lastName;
    this.middleName = middleName;
    this.fullName = this.getFullName(lastName, firstName, middleName);
    this.organization = organization;
    this.institution = institution;
    this.email = email;
    gender && (this.gender = gender);
  },
  isValidityCorrect() {
    if (!this.validityFrom && !this.validityTo) return true;
    if (this.validityFrom && !this.validityTo) return this.validityFrom < new Date();
    if (!this.validityFrom && this.validityTo) return this.validityTo > new Date();
    return this.validityFrom < new Date() && this.validityTo > new Date();
  },
  groups: [],
  archive() {
    this.isArchived = true;
  },
  unzip() {
    this.isArchived = false;
  },
} as any as UserEntity;

describe('UserEntity', () => {
  test('Should return full name', () => {
    const result = mockUserInstance['getFullName'](mockUser.lastName, mockUser.firstName, mockUser.middleName);

    expect(result).toBe(Random.lastName + ' ' + Random.firstName + ' ' + Random.middleName);
  });

  // test('Should return true on valid password', () => {
  //   const result = mockUserInstance.isPasswordValid('password')
  //
  //   expect(result).toBe(true)
  // })

  test('Should return false on invalid password', () => {
    const result = mockUserInstance.isPasswordValid('sadfzxcvqwer');

    expect(result).toBe(false);
  });

  test('Should return true on correct validity', () => {
    const result = mockUserInstance.isValidityCorrect();

    expect(result).toBe(true);
  });
});
