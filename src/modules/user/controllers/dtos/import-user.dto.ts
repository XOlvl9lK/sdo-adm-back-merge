export class ImportUserDto {
  roleId: string;
  groupType: 'EXIST' | 'CREATE' | 'NONE';
  groupTitle?: string;
  groupId?: string
  isPersonalDataRequired: boolean;
}
