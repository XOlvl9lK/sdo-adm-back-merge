import { Module } from '@nestjs/common';
import { ForumController } from 'src/modules/forum/controllers/forum.controller';
import { ForumMessageController } from '@modules/forum/controllers/forum-message.controller';
import { ThemeController } from '@modules/forum/controllers/theme.controller';
import { CreateForumService } from '@modules/forum/application/create-forum.service';
import { CreateForumMessageService } from '@modules/forum/application/create-forum-message.service';
import { CreateThemeService } from '@modules/forum/application/create-theme.service';
import { FindForumService } from '@modules/forum/application/find-forum.service';
import { FindThemeService } from '@modules/forum/application/find-theme.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '@modules/user/infrastructure/database/user.repository';
import {
  ForumMessageRepository,
  ForumRepository,
  ThemeRepository,
} from '@modules/forum/infrastructure/database/forum.repository';
import { ThemeCreatedEventHandler } from '@modules/forum/application/theme-created.event-handler';
import { DeleteForumMessageService } from '@modules/forum/application/delete-forum-message.service';
import { DeleteThemeService } from '@modules/forum/application/delete-theme.service';
import { FindForumMessageService } from '@modules/forum/application/find-forum-message.service';
import { DeleteForumService } from '@modules/forum/application/delete-forum.service';
import { UpdateThemeService } from '@modules/forum/application/update-theme.service';
import { UpdateForumService } from '@modules/forum/application/update-forum.service';
import { UpdateForumMessageService } from '@modules/forum/application/update-forum-message.service';
import { MessageCreatedEventHandler } from '@modules/forum/application/message-created.event-handler';

@Module({
  controllers: [ForumController, ForumMessageController, ThemeController],
  providers: [
    CreateForumService,
    CreateForumMessageService,
    CreateThemeService,
    FindForumService,
    FindThemeService,
    FindForumMessageService,
    DeleteForumMessageService,
    DeleteThemeService,
    DeleteForumService,
    ThemeCreatedEventHandler,
    MessageCreatedEventHandler,
    UpdateThemeService,
    UpdateForumService,
    UpdateForumMessageService,
  ],
  imports: [TypeOrmModule.forFeature([UserRepository, ForumRepository, ThemeRepository, ForumMessageRepository])],
})
export class ForumModule {}
