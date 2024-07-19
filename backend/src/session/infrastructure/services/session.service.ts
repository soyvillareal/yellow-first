import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ISessionEntity, TCreateSession } from 'src/session/domain/entities/session.entity';
import { sessionRepository } from 'src/session/domain/repository/session.repository';

import { SessionModel } from '../models/session.model';

@Injectable()
export class SessionService implements sessionRepository {
  constructor(@InjectRepository(SessionModel) private readonly sessionModel: Repository<SessionModel>) {}

  async createSession({ id, userId, jwt, type, expiredAt }: TCreateSession): Promise<ISessionEntity | null> {
    try {
      const createdToken = this.sessionModel.create({
        id,
        userId,
        jwt,
        type,
        expiredAt,
      });

      const savedToken = await this.sessionModel.save(createdToken);

      return savedToken;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
