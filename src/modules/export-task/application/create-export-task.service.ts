import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExportTaskRepository } from '@modules/export-task/infrastructure/export-task.repository';
import { CreateExportTaskDto } from '@modules/export-task/controllers/dto/create-export-task.dto';
import { UserRepository } from '@modules/user/infrastructure/database/user.repository';
import { ExportTaskEntity } from '@modules/export-task/domain/export-task.entity';

@Injectable()
export class CreateExportTaskService {
  constructor(
    @InjectRepository(ExportTaskRepository)
    private exportTaskRepository: ExportTaskRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ) {}

  async create({ userId, page }: CreateExportTaskDto) {
    const user = await this.userRepository.findById(userId)
    const exportTask = new ExportTaskEntity(user, page)
    return await this.exportTaskRepository.save(exportTask)
  }
}