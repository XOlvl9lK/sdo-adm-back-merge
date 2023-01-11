import { ArchiveData } from '@modules/archiver/application/archiver.service';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { ZipFile } from 'yazl';
import stream from 'stream';

const staticPath = process.env.STATIC_PATH || '/opt/static_path'

export const zipToStaticFiles = async (fileName: string, ...data: ArchiveData[]) => {
  const writeStream = createWriteStream(join(staticPath, `${fileName}.zip`))
  const zipFile = new ZipFile()
  data.forEach(({ fileName, source }) => {
    zipFile.addReadStream(source as stream.Readable, fileName)
  })
  zipFile.end()
  zipFile.outputStream.pipe(writeStream)
}