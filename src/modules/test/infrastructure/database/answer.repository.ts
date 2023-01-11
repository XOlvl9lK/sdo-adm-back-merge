import { BaseRepository } from '@core/database/base.repository';
import {
  AnswerEntity,
  AssociativeAnswerEntity,
  SingleAnswerEntity,
  OrderedAnswerEntity,
  MultipleAnswerEntity,
  OpenAnswerEntity,
} from '@modules/test/domain/answer.entity';
import { EntityRepository } from 'typeorm';

@EntityRepository(AnswerEntity)
export class AnswerRepository<Answer extends AnswerEntity> extends BaseRepository<Answer> {}

@EntityRepository(SingleAnswerEntity)
export class SingleAnswerRepository extends AnswerRepository<SingleAnswerEntity> {}

@EntityRepository(MultipleAnswerEntity)
export class MultipleAnswerRepository extends AnswerRepository<MultipleAnswerEntity> {}

@EntityRepository(OpenAnswerEntity)
export class OpenAnswerRepository extends AnswerRepository<OpenAnswerEntity> {}

@EntityRepository(AssociativeAnswerEntity)
export class AssociativeAnswerRepository extends AnswerRepository<AssociativeAnswerEntity> {}

@EntityRepository(OrderedAnswerEntity)
export class OrderedAnswerRepository extends AnswerRepository<OrderedAnswerEntity> {}
