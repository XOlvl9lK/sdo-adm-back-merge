import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEducationRequestRepository } from '@modules/education-request/infrastructure/database/education-request.repository';
import { CreateUserEducationRequestRequestDto } from '@modules/education-request/controllers/dtos/create-education-request.dto';
import { EducationElementRepository } from '@modules/education-program/infrastructure/database/education-program.repository';
import { UserRepository } from '@modules/user/infrastructure/database/user.repository';
import { EducationElementException } from '@modules/education-program/infrastructure/exceptions/education-element.exception';
import { UserException } from '@modules/user/infrastructure/exceptions/user.exception';
import {
  EducationRequestOwnerTypeEnum,
  EducationRequestStatusEnum,
  UserEducationRequestEntity,
} from '@modules/education-request/domain/education-request.entity';
import { EducationElementTypeEnum } from '@modules/education-program/domain/education-element.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { EducationRequestEvent } from '@modules/event/infrastructure/events/education-request.event';
import { CreateAssignmentService } from '@modules/education-request/application/create-assignment.service';
import { EducationRequestAcceptEvent } from '@modules/event/infrastructure/events/education-request-accept.event';
import { UserEnrolledEvent } from '@modules/event/infrastructure/events/user-enrolled.event';
import { getElementTypeName } from '@core/libs/getElementTypeName';

@Injectable()
export class CreateEducationRequestService {
  constructor(
    @InjectRepository(UserEducationRequestRepository)
    private userEducationRequestRepository: UserEducationRequestRepository,
    @InjectRepository(EducationElementRepository)
    private educationElementRepository: EducationElementRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private eventEmitter: EventEmitter2,
    private createAssignmentService: CreateAssignmentService,
  ) {}

  async createForUser(
    { educationElementId, userId }: CreateUserEducationRequestRequestDto,
    userIdAuth: string,
  ) {
    const [educationElement, user] = await Promise.all([
      this.educationElementRepository.findById(educationElementId),
      this.userRepository.findById(userId),
    ]);
    if (!educationElement) EducationElementException.NotFound();
    if (educationElement.isArchived) {
      EducationElementException.NotAvailableForAssignment(
        'Каталог элементов обучения',
        `Пользователь id=${userIdAuth}. Попытка зачисления на недоступный элемент обучения id=${educationElementId}`,
      );
    }
    if (!user) UserException.NotFound('Зачисления');
    if (educationElement.isSelfAssignmentAvailable) {
      const assignment = await this.createAssignmentService.create({
        ownerType: EducationRequestOwnerTypeEnum.USER,
        userId: user.id,
        educationElementId: educationElement.id,
      });
      this.eventEmitter.emit(
        EventActionEnum.SELF_ENROLLED,
        new UserEnrolledEvent(educationElement.id, user.id, educationElement.elementType, assignment.id),
      );
    } else {
      const educationRequest = new UserEducationRequestEntity(
        educationElement,
        user,
        EducationRequestStatusEnum.NOT_PROCESSED,
      );
      const page = getElementTypeName(educationElement.elementType, true);
      this.eventEmitter.emit(
        EventActionEnum.EDUCATION_REQUEST,
        new EducationRequestEvent(userIdAuth, educationRequest.id, page),
      );
      await this.userEducationRequestRepository.save(educationRequest);
    }
  }
}
