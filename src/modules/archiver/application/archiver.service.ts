import { Injectable } from '@nestjs/common';
import stream from 'stream';
import { Archiver } from 'archiver';
import * as extract from 'extract-zip';
import { createWriteStream } from 'fs';
import { join } from 'path';
const archiver = require('archiver');

export interface ArchiveData {
  source: stream.Readable | Buffer | string;
  fileName: string;
}

@Injectable()
export class ArchiverService {
  private readonly format = 'zip';

  async zip(...data: ArchiveData[]): Promise<Archiver> {
    const archive = archiver(this.format, { zlib: { level: 5 } });
    data.forEach(({ source, fileName }) => {
      archive.append(source, { name: fileName });
    });
    await archive.finalize();
    return archive;
  }

  async xlsx(folderPath: string, fileName: string) {
    const writeStream = createWriteStream(join(process.cwd(), '..', `${fileName}.xlsx`))
    const archive = archiver(this.format, { zlib: { level: 0 } });
    archive.directory(folderPath, false)
    await archive.finalize();
    archive.pipe(writeStream)
  }

  async unzip(inputPath: string, outputPath: string): Promise<void> {
    return await extract(inputPath, { dir: outputPath })
  }
}
