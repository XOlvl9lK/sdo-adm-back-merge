import { createWriteStream } from 'fs';
import { join } from 'path';
import { COMPRESSION_LEVEL, zip } from 'zip-a-folder';

const staticPath = process.env.STATIC_PATH || '/opt/static_path'

export const zipFolderToStaticFiles = async (folderPath: string, fileName: string, format?: string) => {
  const writeStream = createWriteStream(join(staticPath, `${fileName}${format ? `.${format}` : ''}`))
  await zip(folderPath, undefined, { customWriteStream: writeStream, compression: COMPRESSION_LEVEL.uncompressed })
}