export class ImportDibUserDto {
  missingData: {
    type: 'region' | 'department' | 'subdivision' | 'roleDib';
    foreignId: string;
    title: string;
  }[];
  addInGroup: boolean;
  roleId: string;
}
