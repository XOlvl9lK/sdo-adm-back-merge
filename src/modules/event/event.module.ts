import { Module } from '@nestjs/common';
import { EventController } from '@modules/event/controllers/event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventRepository } from '@modules/event/infrastructure/database/event.repository';
import { FindEventService } from '@modules/event/application/find-event.service';
import { CreateEventService } from '@modules/event/application/create-event.service';
import { DeleteEventService } from '@modules/event/application/delete-event.service';
import { MessageReadEventHandler } from '@modules/messenger/application/message-read.event-handler';
import { MessageRepository } from '@modules/messenger/infrastructure/database/message.repository';
import { ExportEventService } from '@modules/event/application/export-event.service';
import { FileModule } from '@modules/file/file.module';
import { ExportTaskModule } from '@modules/export-task/export-task.module';
import { ExportTaskRepository } from '@modules/export-task/infrastructure/export-task.repository';

@Module({
  controllers: [EventController],
  providers: [FindEventService, CreateEventService, DeleteEventService, MessageReadEventHandler, ExportEventService],
  imports: [
    TypeOrmModule.forFeature([EventRepository, MessageRepository, ExportTaskRepository]),
    FileModule,
    ExportTaskModule
  ],
})
export class EventModule {}
