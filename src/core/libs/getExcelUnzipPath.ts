import { join } from 'path';

export const getExcelUnzipPath = (exportTaskId: string) => {
  return join(process.cwd(), 'excel-unzip', exportTaskId)
}