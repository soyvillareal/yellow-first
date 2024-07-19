import { sign } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

import { IGetInfoByUsername } from 'src/users/domain/entities/users.entity';

import { sessionRepository } from '../domain/repository/session.repository';
import { ESessionType, IAnonymousSessionPayload, TAuthSessionResponse, TSession } from '../domain/entities/session.entity';
import { usersRepository } from 'src/users/domain/repository/users.repository';
export class SessionUseCase {
  private readonly hoursOffset = 1000 * 60 * 60;
  private readonly sessionDurationInHoursAnonumous = 720; // 30 days
  private readonly sessionDurationInHoursAuth = 24; // 1 day

  constructor(
    private readonly sessionRepository: sessionRepository,
    private readonly userRepository: usersRepository,
    private readonly configService: ConfigService,
  ) {}

  async createAuthSession({ id, email, username, role }: IGetInfoByUsername): Promise<TAuthSessionResponse> {
    const sessionId = uuidv4();

    const expiredAt = new Date(new Date().getTime() + this.hoursOffset * this.sessionDurationInHoursAuth);

    const user = await this.userRepository.getInfoByUsername(username);

    const signSession: TSession = {
      id: sessionId,
      type: ESessionType.AUTH,
      data: {
        id,
        username,
        email,
        role,
      },
      expiredAt,
    };

    const jwt = sign(
      signSession,
      this.configService.get<string>('config.secret_key', {
        infer: true,
      }),
      { algorithm: 'HS256' },
    );

    const createdLead = await this.sessionRepository.createSession({
      userId: user.id,
      jwt,
      type: ESessionType.AUTH,
      expiredAt,
    });

    if (createdLead === null) {
      throw new Error('Failed to create session!');
    }

    return {
      ...signSession,
      jwt,
    };
  }

  async createAnonymousSession({ seed }: IAnonymousSessionPayload): Promise<TAuthSessionResponse> {
    const sessionId = uuidv4();

    const expiredAt = new Date(new Date().getTime() + this.hoursOffset * this.sessionDurationInHoursAnonumous);

    const signSession: TSession = {
      id: sessionId,
      type: ESessionType.ANONYMOUS,
      seed,
      expiredAt,
    };

    const jwt = sign(
      signSession,
      this.configService.get<string>('config.secret_key', {
        infer: true,
      }),
      { algorithm: 'HS256' },
    );

    const createdLead = await this.sessionRepository.createSession({
      userId: null,
      jwt,
      type: ESessionType.ANONYMOUS,
      expiredAt,
    });

    if (createdLead === null) {
      throw new Error('Failed to create session!');
    }

    return {
      ...signSession,
      jwt,
    };
  }
}
