import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionRepository } from '@modules/user/infrastructure/database/session.repository';
import { OnEvent } from '@nestjs/event-emitter';
import { SessionEvent } from '@modules/user/infrastructure/session.event';

@Injectable()
export class SessionEventHandler {
  constructor(
    @InjectRepository(SessionRepository)
    private sessionRepository: SessionRepository,
  ) {}

  @OnEvent('session', { async: true })
  async handleSessionEvent({ ip, page, userId }: SessionEvent) {
    const session = await this.sessionRepository.findByUserId(userId);
    if (session) {
      session.update(ip, page);
      await this.sessionRepository.save(session);
    }
  }
}
