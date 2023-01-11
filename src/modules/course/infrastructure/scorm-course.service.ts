import { Injectable } from '@nestjs/common';
import { ZipService } from '@modules/file/infrastructure/zip.service';
import { FileSystemService } from 'src/modules/file/infrastructure/file-system.service';
import { join } from 'path';
import { existsSync, readFileSync, rmSync } from 'fs';
import { CourseException } from '@modules/course/infrastructure/exceptions/course.exception';
import { parseStringPromise } from 'xml2js';

type AssumedManifest = {
  manifest?: {
    metadata?: [
      {
        schemaversion?: [string];
      },
    ];
  };
};

@Injectable()
export class ScormCourseService {
  private courseScormDirectory: string = process.env.STATIC_PATH
    ? join(process.env.STATIC_PATH, 'courses')
    : '/opt/static_path/courses';
  private manifestName = 'imsmanifest.xml';
  private availableSchemaVersion = ['2004 1st Edition', '2004 2nd Edition', '2004 3rd Edition'];

  constructor(private zipService: ZipService, private fileSystemService: FileSystemService) {}

  public async getScormPathById(id: string): Promise<string | undefined> {
    const exists = await this.isScormExists(id);
    return exists ? join(this.courseScormDirectory, id) : undefined;
  }

  /**
   * Создаёт СКОРМ-пакет на локальном диске.
   * @param id id - Курса
   * @param file ZIP архив в виде буффера
   * @returns Путь до распакованного скорм пакета
   */
  public async createScorm(id: string, file: Buffer): Promise<string> {
    const scormDirectory = join(this.courseScormDirectory, id);
    await this.zipService.extract(file, scormDirectory);
    await this.validateManifest(id);
    return scormDirectory;
  }

  public async isScormExists(id: string): Promise<boolean> {
    return await this.fileSystemService.exists(join(this.courseScormDirectory, id));
  }

  private async removeScorm(id: string) {
    const path = await this.getScormPathById(id);
    if (path) {
      rmSync(path, { recursive: true, force: true });
    }
  }

  private async validateManifest(id: string) {
    let manifestPath = join(await this.getScormPathById(id), this.manifestName);
    if (!existsSync(manifestPath)) {
      await this.removeScorm(id);
      CourseException.WrongContent('Попытка загрузки курса неверной структуры');
    }
    const manifest = readFileSync(manifestPath);
    const result: AssumedManifest = await parseStringPromise(manifest, {
      async: true,
    });
    const schemaVersion = result?.manifest?.metadata?.[0]?.schemaversion?.[0];
    if (!this.availableSchemaVersion.includes(schemaVersion)) {
      CourseException.WrongVersion('Попытка загрузки курса неверной версии SCORM');
      await this.removeScorm(id);
    }
  }
}
