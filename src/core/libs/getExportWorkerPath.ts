import { join } from 'path';

export const getExportWorkerPath = (workerName: string) => {
  return join(process.cwd(), 'dist', 'export-workers', `${workerName}.worker.js`)
}