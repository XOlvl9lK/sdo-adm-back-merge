import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageRepository } from '@modules/messenger/infrastructure/database/message.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { TryCatch } from '@core/libs/try-catch.decorator';
import { ExportTaskProgressEvent } from '@modules/event/infrastructure/events/export-task-progress.event';

@WebSocketGateway(3002, {
  cors: {
    origin: true,
  },
})
export class SubscribeMessageGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectRepository(MessageRepository)
    private messageRepository: MessageRepository,
    private jwtService: JwtService,
    private eventEmitter: EventEmitter2,
  ) {}

  @TryCatch({ async: true, context: 'WEBSOCKET' })
  async handleConnection(client: Socket) {
    const userId = client.handshake.auth.userId;
    const newMessages = await this.messageRepository.findNewIncomingMany(userId);
    if (newMessages.length) {
      this.server.to(client.id).emit('new-messages', { newMessages });
    }
    this.eventEmitter.on(EventActionEnum.SEND_MESSAGE + '_' + userId, async () => {
      const newMessages = await this.messageRepository.findNewIncomingMany(userId);
      this.server.to(client.id).emit('new-messages', { newMessages });
    });
  }

  @SubscribeMessage('enter-export-task-room')
  async handleEnterExportTaskRoomEvent(client: Socket, data: { userId: string }) {
    this.eventEmitter.on(EventActionEnum.EXPORT_TASK_PROGRESS + '_' + data.userId, async (payload: ExportTaskProgressEvent) => {
      this.server.to(client.id).emit('export-task-progress', payload)
    })
  }
}
