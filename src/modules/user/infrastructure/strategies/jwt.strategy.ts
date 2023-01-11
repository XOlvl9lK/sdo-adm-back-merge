import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TJwtPayload } from '@modules/user/application/auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '@modules/user/infrastructure/database/user.repository';
import { SessionRepository } from '@modules/user/infrastructure/database/session.repository';
import { UserException } from '@modules/user/infrastructure/exceptions/user.exception';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(SessionRepository)
    private sessionRepository: SessionRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET || 'secret',
    });
  }

  async validate(payload: TJwtPayload) {
    const user = await this.userRepository.findById(payload.sub);
    const session = await this.sessionRepository.findById(payload.sessionId);
    if (!session) UserException.Unauthorized('Система авторизации', `Пользователь ${user?.login || ''} не авторизован`);
    return {
      userId: payload.sub,
      login: payload.login,
      permissions: user?.role?.permissions.map(p => p.code),
    };
  }
}
