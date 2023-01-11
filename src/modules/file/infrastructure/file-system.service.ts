import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import internal from 'stream';

@Injectable()
export class FileSystemService {
  public async create(path: string, file: Buffer): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.writeFile(path, file, err => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  public async readAsStream(path: string): Promise<internal.Readable> {
    return new Promise<internal.Readable>((resolve, reject) => {
      const readStream = fs.createReadStream(path);
      readStream.on('error', err => reject(err));
      readStream.on('open', () => resolve(readStream));
    });
  }

  public async readAsBuffer(path: string): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      fs.readFile(path, (err, buffer: Buffer) => {
        if (err) reject(err);
        resolve(buffer);
      });
    });
  }

  public async delete(path: string): Promise<boolean> {
    const exists = await this.exists(path);
    return new Promise<boolean>((resolve, reject) => {
      exists
        ? fs.rm(path, { recursive: true, force: true }, err => {
            if (err) reject(err);
            resolve(true);
          })
        : resolve(false);
    });
  }

  public async exists(path: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      fs.stat(path, (err, stats) => {
        if (err?.code === 'ENOENT' || !stats) resolve(false);
        resolve(true);
      });
    });
  }
}
