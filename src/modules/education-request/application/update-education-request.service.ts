import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEducationRequestRepository } from '@modules/education-request/infrastructure/database/education-request.repository';
import {
  UpdateEducationRequestByIdsDto,
  UpdateEducationRequestDto,
} from '@modules/education-request/controllers/dtos/update-education-request.dto';
import { EducationRequestException } from '@modules/education-request/infrastructure/exceptions/education-request.exception';
import {
  EducationRequestOwnerTypeEnum,
  EducationRequestStatusEnum,
  UserEducationRequestEntity,
} from '@modules/education-request/domain/education-request.entity';
import { CreateAssignmentService } from '@modules/education-request/application/create-assignment.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { EducationRequestAcceptEvent } from '@modules/event/infrastructure/events/education-request-accept.event';
import { EducationRequestRejectEvent } from '@modules/event/infrastructure/events/education-request-reject.event';
import { flatten } from 'lodash';
import { AssignmentEntity } from '@modules/education-request/domain/assignment.entity';
import { ExecuteAssignmentsMessagesDeliveryService } from '@modules/education-request/application/execute-assignments-messages-delivery.service';

@Injectable()
export class UpdateEducationRequestService {
  constructor(
    @InjectRepository(UserEducationRequestRepository)
    private userEducationRequestRepository: UserEducationRequestRepository,
    private createAssignmentService: CreateAssignmentService,
    private eventEmitter: EventEmitter2,
    private executeAssignmentsMessagesDeliveryService: ExecuteAssignmentsMessagesDeliveryService,
  ) {}

  async accept({ userIds }: UpdateEducationRequestDto, userId: string) {
    const educationRequests: UserEducationRequestEntity[][] = await Promise.all(
      userIds.map(id =>
        this.userEducationRequestRepository.findByUserIdAndStatusWithoutCount(
          id,
          EducationRequestStatusEnum.NOT_PROCESSED,
          {},
        ),
      ),
    );
    if (!educationRequests.length) EducationRequestException.NotFound();
    const flattenedEducationRequests = flatten(educationRequests);
    const assignments: AssignmentEntity[] = [];
    for (let i = 0; i < flattenedEducationRequests.length; i++) {
      const request = flattenedEducationRequests[i];
      request.accept();
      const assignment = await this.createAssignmentService.create({
        ownerType: EducationRequestOwnerTypeEnum.USER,
        userId: request.user.id,
        educationElementId: request.educationElement.id,
      });
      request.assignment = assignment;
      assignments.push(assignment);
      this.eventEmitter.emit(
        EventActionEnum.EDUCATION_REQUEST_ACCEPT,
        new EducationRequestAcceptEvent(
          assignment.userId,
          request.id,
          request.educationElement.elementType,
          request.educationElement.id,
          assignment.id,
          userId
        ),
      );
    }
    this.executeAssignmentsMessagesDeliveryService.execute(assignments);
    return await this.userEducationRequestRepository.save(flattenedEducationRequests);
  }

  async reject({ userIds }: UpdateEducationRequestDto, userId: string) {
    const educationRequests = await Promise.all(
      userIds.map(id =>
        this.userEducationRequestRepository.findByUserIdAndStatusWithoutCount(
          id,
          EducationRequestStatusEnum.NOT_PROCESSED,
          {},
        ),
      ),
    );
    if (!educationRequests.length) EducationRequestException.NotFound();
    educationRequests.forEach(requests => {
      requests.forEach(request => {
        if (request.status === EducationRequestStatusEnum.NOT_PROCESSED) {
          request.reject();
          this.eventEmitter.emit(
            EventActionEnum.EDUCATION_REQUEST_REJECT,
            new EducationRequestRejectEvent(userId, request.id),
          );
        }
      });
    });
    return await Promise.all(educationRequests.map(request => this.userEducationRequestRepository.save(request)));
  }

  async acceptByIds({ educationRequestIds }: UpdateEducationRequestByIdsDto, userId: string) {
    const educationRequests = await Promise.all(
      educationRequestIds.map(requestId => this.userEducationRequestRepository.findById(requestId)),
    );
    if (!educationRequests.length) EducationRequestException.NotFound();
    const assignments: AssignmentEntity[] = [];
    for (let i = 0; i < educationRequests.length; i++) {
      const request = educationRequests[i];
      request.accept();
      const assignment = await this.createAssignmentService.create({
        ownerType: EducationRequestOwnerTypeEnum.USER,
        userId: request.user.id,
        educationElementId: request.educationElement.id,
      });
      request.assignment = assignment;
      assignments.push(assignment);
      this.eventEmitter.emit(
        EventActionEnum.EDUCATION_REQUEST_ACCEPT,
        new EducationRequestAcceptEvent(
          assignment.userId,
          request.id,
          request.educationElement.elementType,
          request.educationElement.id,
          assignment.id,
          userId
        ),
      );
    }
    this.executeAssignmentsMessagesDeliveryService.execute(assignments);
    return await this.userEducationRequestRepository.save(educationRequests);
  }

  async rejectByIds({ educationRequestIds }: UpdateEducationRequestByIdsDto, userId: string) {
    const educationRequests = await Promise.all(
      educationRequestIds.map(requestId => this.userEducationRequestRepository.findById(requestId)),
    );
    if (!educationRequests.length) EducationRequestException.NotFound();
    educationRequests.forEach(request => {
      if (request.status === EducationRequestStatusEnum.NOT_PROCESSED) {
        request.reject();
        this.eventEmitter.emit(
          EventActionEnum.EDUCATION_REQUEST_REJECT,
          new EducationRequestRejectEvent(userId, request.id),
        );
      }
    });
    return await this.userEducationRequestRepository.save(educationRequests);
  }
}
