import { ISessionEntity, TCreateSession } from '../entities/session.entity';

export interface sessionRepository {
  createSession: (token: TCreateSession) => Promise<ISessionEntity | null>;
}
