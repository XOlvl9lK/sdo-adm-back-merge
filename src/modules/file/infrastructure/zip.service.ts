import { Injectable } from '@nestjs/common';
import * as AdmZip from 'adm-zip';
import { LoggerService } from '@core/logger/logger.service';

@Injectable()
export class ZipService {
  public async extract(zipBuffer: Buffer, path: string): Promise<void> {
    const zip = new AdmZip(zipBuffer);
    await zip.extractAllTo(path, false);
  }

  public async compress(files: { entryName: string; buffer: Buffer }[]): Promise<Buffer> {
    const zip = new AdmZip();
    files.forEach(file => zip.addFile(file.entryName, file.buffer));
    return zip.toBuffer();
  }
}
