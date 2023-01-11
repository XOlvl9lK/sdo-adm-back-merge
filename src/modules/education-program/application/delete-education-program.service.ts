import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EducationProgramRepository } from '@modules/education-program/infrastructure/database/education-program.repository';

@Injectable()
export class DeleteEducationProgramService {
  constructor(
    @InjectRepository(EducationProgramRepository)
    private educationProgramRepository: EducationProgramRepository,
  ) {}

  async delete(id: string) {
    const educationProgramForDelete = await this.educationProgramRepository.findById(id);
    return await this.educationProgramRepository.remove(educationProgramForDelete);
  }
}
