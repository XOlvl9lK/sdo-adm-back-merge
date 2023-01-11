import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '@modules/user/infrastructure/database/user.repository';
import { UserException } from '@modules/user/infrastructure/exceptions/user.exception';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '@modules/user/controllers/dtos/login.dto';
import { SessionEntity } from '@modules/user/domain/session.entity';
import { SessionRepository } from '@modules/user/infrastructure/database/session.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventActionEnum } from '@modules/event/application/create-event.service';
import { AuthActionEnum, AuthEvent } from '@modules/event/infrastructure/events/auth.event';
import { Response } from 'express';

export type TJwtPayload = {
  sub: string;
  login: string;
  sessionId: string;
};

const jwtExp = '20m';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(SessionRepository)
    private sessionRepository: SessionRepository,
    private jwtService: JwtService,
    private eventEmitter: EventEmitter2,
  ) {}

  async login({ login, password }: LoginDto, force?: boolean) {
    const user = await this.validateUser(login, password, force);
    this.eventEmitter.emit(
      EventActionEnum.AUTH,
      new AuthEvent(user.login, AuthActionEnum.LOGIN, user.role.permissions),
    );
    const session = new SessionEntity(user);
    const access_token = this.jwtService.sign(
      { login: user.login, sub: user.id, sessionId: session.id },
      { secret: process.env.SECRET || 'secret', expiresIn: jwtExp },
    );
    await this.sessionRepository.save(session);
    return {
      access_token,
      session,
    };
  }

  async logout(userId: string) {
    const session = await this.sessionRepository.findByUserId(userId);
    if (session) {
      this.eventEmitter.emit(EventActionEnum.AUTH, new AuthEvent(session.user.login, AuthActionEnum.LOGOUT));
      return await this.sessionRepository.remove(session);
    }
    return { success: true };
  }

  async refresh(token: string) {
    const session = await this.sessionRepository.findByToken(token);
    if (!session?.isValid()) {
      session.disconnect();
      await this.sessionRepository.save(session);
      UserException.Unauthorized('Система авторизации', `Пользователь '${session.user.login}' не авторизован`);
    }
    session.prolong();
    await this.sessionRepository.save(session);
    const access_token = this.jwtService.sign(
      {
        login: session.user.login,
        sub: session.user.id,
        sessionId: session.id,
      },
      { secret: process.env.SECRET || 'secret', expiresIn: jwtExp },
    );
    return {
      access_token,
      session,
    };
  }

  async validateUser(login: string, password: string, force?: boolean) {
    const user = await this.userRepository.findByLogin(login);
    if (!user || user.isArchived || !user.isValidityCorrect()) UserException.NotFound('Система авторизации');
    if (!user.isPasswordValid(password))
      UserException.InvalidPassword('Система авторизации', `Пользователь '${user.login}' не авторизован`);
    const session = await this.sessionRepository.findByUserId(user.id);
    if (session && session.isValid() && !force) {
      UserException.AlreadyLogon(
        'Система авторизации',
        `Пользователь '${user.login}' Попытка авторизации под уже авторизованным пользователем`,
      );
    } else if (session) {
      await this.sessionRepository.remove(session);
    }
    return user;
  }

  setCookie(res: Response, session: SessionEntity) {
    res.cookie('refresh_token', session.refresh_token, {
      httpOnly: true,
      sameSite: 'strict',
      expires: session.expirationDate,
    });
  }
}
