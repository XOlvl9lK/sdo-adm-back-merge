import { Module } from '@nestjs/common';
import { MessengerController } from 'src/modules/messenger/controllers/messenger.controller';
import { CreateMessageService } from '@modules/messenger/application/create-message.service';
import { DeleteMessageService } from '@modules/messenger/application/delete-message.service';
import { FindMessageService } from '@modules/messenger/application/find-message.service';
import { UpdateMessageService } from '@modules/messenger/application/update-message.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '@modules/user/infrastructure/database/user.repository';
import { MessageRepository } from '@modules/messenger/infrastructure/database/message.repository';
import { EducationElementRepository } from '@modules/education-program/infrastructure/database/education-program.repository';
import { MailDeliveryEventHandler } from '@modules/messenger/application/mail-delivery.event-handler';
import { GroupRepository } from '@modules/group/infrastructure/database/group.repository';
import { SessionRepository } from '@modules/user/infrastructure/database/session.repository';
import { JwtModule } from '@nestjs/jwt';
import { SubscribeMessageGateway } from '@modules/messenger/controllers/subscribe-message.gateway';

@Module({
  controllers: [MessengerController],
  providers: [
    CreateMessageService,
    DeleteMessageService,
    FindMessageService,
    UpdateMessageService,
    MailDeliveryEventHandler,
  ],
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      MessageRepository,
      EducationElementRepository,
      GroupRepository,
      SessionRepository,
    ]),
    JwtModule.register({}),
  ],
  exports: [MailDeliveryEventHandler],
})
export class MessengerModule {}
