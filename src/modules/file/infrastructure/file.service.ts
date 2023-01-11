import { join } from 'path';
import internal from 'stream';
import { Injectable } from '@nestjs/common';
import { FileSystemService } from 'src/modules/file/infrastructure/file-system.service';
import { staticPath } from '@src/main';

@Injectable()
export class FileService {
  private directory: string = process.env.STATIC_PATH
    ? join(process.env.STATIC_PATH, 'files')
    : '/opt/static_path/files';

  constructor(private fileSystemService: FileSystemService) {}

  public async save(id: string, file: Buffer): Promise<void> {
    return await this.fileSystemService.create(join(staticPath, id), file);
  }

  public async get(id: string): Promise<internal.Readable> {
    return await this.fileSystemService.readAsStream(join(staticPath || this.directory, id));
  }

  public async delete(id: string): Promise<boolean> {
    return await this.fileSystemService.delete(join(staticPath || this.directory, id));
  }
}
