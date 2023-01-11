import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseRepository } from '@modules/course/infrastructure/database/course.repository';

@Injectable()
export class DeleteCourseService {
  constructor(
    @InjectRepository(CourseRepository)
    private courseRepository: CourseRepository,
  ) {}

  async delete(id: string) {
    const courseForDelete = await this.courseRepository.findById(id);
    return await this.courseRepository.remove(courseForDelete);
  }
}
