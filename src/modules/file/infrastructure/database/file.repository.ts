import { EntityRepository } from 'typeorm';
import { FileEntity } from '@src/modules/file/domain/file.entity';
import { BaseRepository } from '@core/database/base.repository';

@EntityRepository(FileEntity)
export class FileRepository extends BaseRepository<FileEntity> {}
