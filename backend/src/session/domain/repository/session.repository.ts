import { IGetInfoByUsername, ISessionEntity, TCreateSession, TGetInfoUser } from '../entities/session.entity';

export interface sessionRepository {
  createSession: (token: TCreateSession) => Promise<ISessionEntity | null>;
  getInfoById: (id: string) => Promise<TGetInfoUser | undefined | null>;
  getInfoByUsername: (username: string) => Promise<IGetInfoByUsername | null>;
  userExistsByUsername: (username: string) => Promise<boolean | null>;
  userExistsById: (id: string) => Promise<boolean | null>;
}
