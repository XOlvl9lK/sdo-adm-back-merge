import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EducationRequestRepository } from '@modules/education-request/infrastructure/database/education-request.repository';

@Injectable()
export class DeleteEducationRequestService {
  constructor(
    @InjectRepository(EducationRequestRepository)
    private educationRequestRepository: EducationRequestRepository,
  ) {}

  async delete(id: string) {
    const educationRequest = await this.educationRequestRepository.findById(id);
    return await this.educationRequestRepository.remove(educationRequest);
  }
}
