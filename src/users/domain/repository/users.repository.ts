import { ICreateUser, IGetInfoByUsername, IGetInfoUser, IUsersEntity } from '../entities/users.entity';

export interface usersRepository {
  createUser: (user: ICreateUser) => Promise<IUsersEntity | null>;
  getInfoById: (id: string) => Promise<IGetInfoUser | null>;
  getInfoByUsername: (username: string) => Promise<IGetInfoByUsername | null>;
  userExistsByUsername: (username: string) => Promise<boolean | null>;
  userExistsById: (id: string) => Promise<boolean | null>;
}
