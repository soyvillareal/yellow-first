import { sign } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment-timezone';

import { IGetInfoByUsername } from 'src/session/domain/entities/session.entity';

import { sessionRepository } from '../domain/repository/session.repository';
import { ESessionType, IAnonymousSessionPayload, TAuthSessionResponse, TSession } from '../domain/entities/session.entity';
import { configRepository } from 'src/common/domain/repository/common.repository';

export class SessionUseCase {
  private readonly sessionDurationInHoursAnonumous = 720; // 30 days
  private readonly sessionDurationInHoursAuth = 24; // 1 day

  constructor(
    private readonly sessionRepository: sessionRepository,
    private readonly configRepository: configRepository,
  ) {}

  async createAuthSession({
    id,
    email,
    username,
    role,
    firstAddress,
    secondAddress,
    state,
    city,
    pincode,
    phoneCode,
    phoneNumber,
  }: IGetInfoByUsername): Promise<TAuthSessionResponse> {
    const sessionId = uuidv4();

    const expiredAt = moment().add(this.sessionDurationInHoursAuth, 'hours').toDate();

    const user = await this.sessionRepository.getInfoByUsername(username);

    if (user === null) {
      throw new Error('Failed to create session!');
    }

    const signSession: TSession = {
      id: sessionId,
      type: ESessionType.AUTH,
      data: {
        id,
        username,
        email,
        role,
        firstAddress,
        secondAddress,
        state,
        city,
        pincode,
        phoneCode,
        phoneNumber,
      },
      expiredAt,
    };

    const jwt = sign(
      signSession,
      this.configRepository.get<string>('config.secret_key', {
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

    const expiredAt = moment().add(this.sessionDurationInHoursAnonumous, 'hours').toDate();

    const signSession: TSession = {
      id: sessionId,
      type: ESessionType.ANONYMOUS,
      seed,
      expiredAt,
    };

    const jwt = sign(
      signSession,
      this.configRepository.get<string>('config.secret_key', {
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
