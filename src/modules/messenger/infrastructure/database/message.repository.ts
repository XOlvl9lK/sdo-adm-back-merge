import { EntityRepository } from 'typeorm';
import { MessageEntity, MessageStatusEnum, MessageTypeEnum } from '@modules/messenger/domain/message.entity';
import { BaseRepository } from '@core/database/base.repository';
import { RequestQuery } from '@core/libs/types';

@EntityRepository(MessageEntity)
export class MessageRepository extends BaseRepository<MessageEntity> {

  findById(id: string) {
    return this.findOne({ relations: ['sender', 'receiver'], where: { id } });
  }

  findOneDraftById(id: string) {
    return this.findOne({
      relations: ['receiver'],
      where: {
        id,
        type: MessageTypeEnum.DRAFT,
      },
    });
  }

  countMessagesByUser(userId: string) {
    const user = {
      id: userId,
    };
    return [
      this.count({
        relations: ['receiver'],
        where: {
          receiver: user,
          type: MessageTypeEnum.INCOMING,
        },
      }),
      this.count({
        relations: ['receiver'],
        where: {
          receiver: user,
          type: MessageTypeEnum.INCOMING,
          status: MessageStatusEnum.UNREAD,
        },
      }),
      this.count({
        relations: ['sender'],
        where: {
          sender: user,
          type: MessageTypeEnum.OUTGOING,
        },
      }),
      this.count({
        relations: ['sender'],
        where: {
          sender: user,
          type: MessageTypeEnum.DRAFT,
        },
      }),
      this.count({
        relations: ['sender'],
        where: {
          basketOwner: user,
          type: MessageTypeEnum.BASKET,
        },
      }),
    ];
  }

  findIncomingByUser({ page, pageSize, search, sort }: RequestQuery, userId: string) {
    const { sortKey, sortValue } = this.processSortQueryRaw(sort)
    return this.createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('message.receiver', 'receiver')
      .where('receiver.id = :userId', { userId })
      .andWhere('message.type = :messageType', { messageType: MessageTypeEnum.INCOMING })
      .andWhere(`(
        sender.login ILIKE '%${search || ''}%'
        OR sender.fullName ILIKE '%${search || ''}%'
        OR message.theme ILIKE '%${search || ''}%'
      )`)
      .take(pageSize && page ? Number(pageSize) : undefined)
      .skip(pageSize && page ? (Number(page) - 1) * Number(pageSize) : undefined)
      .orderBy(sortKey, sortValue)
      .getManyAndCount()
  }

  findOutgoingByUser({ page, pageSize, search, sort }: RequestQuery, userId: string) {
    const { sortKey, sortValue } = this.processSortQueryRaw(sort)
    return this.createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('message.receiver', 'receiver')
      .where('sender.id = :userId', { userId })
      .andWhere('message.type = :messageType', { messageType: MessageTypeEnum.OUTGOING })
      .andWhere(`(
        receiver.login ILIKE '%${search || ''}%'
        OR receiver.fullName ILIKE '%${search || ''}%'
        OR message.theme ILIKE '%${search || ''}%'
      )`)
      .take(pageSize && page ? Number(pageSize) : undefined)
      .skip(pageSize && page ? (Number(page) - 1) * Number(pageSize) : undefined)
      .orderBy(sortKey, sortValue)
      .getManyAndCount()
  }

  findDraftByUser({ page, pageSize, search, sort }: RequestQuery, userId: string) {
    const { sortKey, sortValue } = this.processSortQueryRaw(sort)
    return this.createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('message.receiver', 'receiver')
      .where('sender.id = :userId', { userId })
      .andWhere('message.type = :messageType', { messageType: MessageTypeEnum.DRAFT })
      .andWhere(`(
        receiver.login ILIKE '%${search || ''}%'
        OR receiver.fullName ILIKE '%${search || ''}%'
        OR message.theme ILIKE '%${search || ''}%'
      )`)
      .take(pageSize && page ? Number(pageSize) : undefined)
      .skip(pageSize && page ? (Number(page) - 1) * Number(pageSize) : undefined)
      .orderBy(sortKey, sortValue)
      .getManyAndCount()
  }

  findBasketByUser({ page, pageSize, search, sort }: RequestQuery, userId: string) {
    const { sortKey, sortValue } = this.processSortQueryRaw(sort)
    return this.createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('message.receiver', 'receiver')
      .leftJoinAndSelect('message.basketOwner', 'basketOwner')
      .where('basketOwner.id = :userId', { userId })
      .andWhere('message.type = :messageType', { messageType: MessageTypeEnum.BASKET })
      .andWhere(`(
        sender.login ILIKE '%${search || ''}%'
        OR sender.fullName ILIKE '%${search || ''}%'
        OR message.theme ILIKE '%${search || ''}%'
        OR receiver.login ILIKE '%${search || ''}%'
        OR receiver.fullName ILIKE '%${search || ''}%'
      )`)
      .take(pageSize && page ? Number(pageSize) : undefined)
      .skip(pageSize && page ? (Number(page) - 1) * Number(pageSize) : undefined)
      .orderBy(sortKey, sortValue)
      .getManyAndCount()
  }

  findNewIncoming(userId: string) {
    return this.findOne({
      relations: ['receiver', 'sender'],
      where: {
        receiver: { id: userId },
        type: MessageTypeEnum.INCOMING,
        status: MessageStatusEnum.UNREAD,
      },
      order: { createdAt: 'DESC' },
    });
  }

  findNewIncomingMany(userId: string) {
    return this.find({
      relations: ['receiver', 'sender'],
      where: {
        receiver: { id: userId },
        type: MessageTypeEnum.INCOMING,
        status: MessageStatusEnum.UNREAD,
      },
      order: { createdAt: 'DESC' },
    });
  }
}
