import { mockBaseEntity } from '@core/domain/base.entity.mock';
import { Random } from '@core/test/random';
import { plainToInstance } from 'class-transformer';
import { FileEntity } from '@modules/file/domain/file.entity';

const mockFile = {
  ...mockBaseEntity,
  fileName: Random.fileName,
  extension: Random.extension,
  mimetype: Random.mimetype,
  size: Random.number,
  hash: Random.hash,
  downloads: Random.number,
};

export const mockFileInstance = plainToInstance(FileEntity, mockFile);
