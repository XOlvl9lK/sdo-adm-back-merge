import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TestRepository } from '@modules/test/infrastructure/database/test.repository';

@Injectable()
export class DeleteTestService {
  constructor(
    @InjectRepository(TestRepository)
    private testRepository: TestRepository,
  ) {}

  async delete(id: string) {
    const testFotDelete = await this.testRepository.findById(id);
    return await this.testRepository.remove(testFotDelete);
  }
}
