import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupRepository, UserInGroupRepository } from '@modules/group/infrastructure/database/group.repository';
import { UserRepository } from '@modules/user/infrastructure/database/user.repository';
import { AddUsersRequestDto } from '@modules/group/controllers/dtos/add-user.request-dto';
import { UserException } from '@modules/user/infrastructure/exceptions/user.exception';
import { GroupException } from '@modules/group/infrastructure/exceptions/group.exception';
import { MoveUsersRequestDto } from '@modules/group/controllers/dtos/move-users.request-dto';
import { UpdateGroupDtoRequest } from '@modules/group/controllers/dtos/update-group.dto-request';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { UpdateEntityEvent } from '@modules/event/infrastructure/events/update-entity.event';
import { UserInGroupEntity } from '@modules/group/domain/group.entity';
import { GroupChangesEvent, GroupChangesTypeEnum } from '@modules/event/infrastructure/events/group-changes.event';

@Injectable()
export class UpdateGroupService {
  constructor(
    @InjectRepository(GroupRepository)
    private groupRepository: GroupRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(UserInGroupRepository)
    private userInGroupRepository: UserInGroupRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async addUsers({ groupId, userIds }: AddUsersRequestDto) {
    const [group, users] = await Promise.all([
      this.groupRepository.findById(groupId),
      this.userRepository.findByIds(userIds),
    ]);
    if (!group) GroupException.NotFound();
    if (!users.length) UserException.NotFound('Группы');
    const usersInGroups = users.filter(u => !group.alreadyInGroup(u.id)).map(u => new UserInGroupEntity(group, u));
    group.addUsers(usersInGroups);
    await this.groupRepository.save(group);
    this.eventEmitter.emit(EventActionEnum.GROUP_CHANGES, new GroupChangesEvent(GroupChangesTypeEnum.ADD, groupId, usersInGroups.map(u => u.user.id)))
    return { success: true };
  }

  async removeUsers({ groupId, userIds }: AddUsersRequestDto) {
    const group = await this.groupRepository.findById(groupId);
    group.removeUsers(userIds);
    await this.groupRepository.save(group);
    const usersWithoutGroup = await this.userInGroupRepository.findWithoutGroup();
    await this.userInGroupRepository.remove(usersWithoutGroup);
    this.eventEmitter.emit(EventActionEnum.GROUP_CHANGES, new GroupChangesEvent(GroupChangesTypeEnum.REMOVE, groupId, usersWithoutGroup.map(u => u.user.id)))
    return group;
  }

  async moveUsers({ groupIdTo, groupIdFrom, userIds }: MoveUsersRequestDto) {
    const [groupFrom, groupTo, usersInGroup] = await Promise.all([
      this.groupRepository.findById(groupIdFrom),
      this.groupRepository.findById(groupIdTo),
      this.userInGroupRepository.findByIds(userIds),
    ]);
    if (!groupFrom || !groupTo) GroupException.NotFound();
    await this.addUsers({
      groupId: groupTo.id,
      userIds: usersInGroup.length ? usersInGroup.map(u => u.user.id) : userIds,
    });
    return await this.removeUsers({ groupId: groupFrom.id, userIds });
  }

  async update({ groupId, title, description }: UpdateGroupDtoRequest, userId: string) {
    const group = await this.groupRepository.findById(groupId);
    if (!group) GroupException.NotFound();
    group.update(title, description);
    this.eventEmitter.emit(EventActionEnum.UPDATE_ENTITY, new UpdateEntityEvent('группу', userId, 'Группы', group));
    return await this.groupRepository.save(group);
  }
}
