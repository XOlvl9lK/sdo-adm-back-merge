import { Module } from '@nestjs/common';
import { GroupController } from '@modules/group/controllers/group.controller';
import { CreateGroupService } from '@modules/group/application/create-group.service';
import { FindGroupService } from '@modules/group/application/find-group.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupRepository, UserInGroupRepository } from '@modules/group/infrastructure/database/group.repository';
import { UserRepository } from '@modules/user/infrastructure/database/user.repository';
import { UpdateGroupService } from '@modules/group/application/update-group.service';

@Module({
  imports: [TypeOrmModule.forFeature([GroupRepository, UserRepository, UserInGroupRepository])],
  controllers: [GroupController],
  providers: [CreateGroupService, FindGroupService, UpdateGroupService],
  exports: [CreateGroupService, FindGroupService, UpdateGroupService],
})
export class GroupModule {}
