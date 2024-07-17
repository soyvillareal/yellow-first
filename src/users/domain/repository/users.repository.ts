import {
  ICreateUser,
  IFindUserById,
  IGetInfoByUsername,
  IGetInfoUser,
  IUpdateUser,
  IUsersEntity,
} from '../entities/users.entity';

export interface usersRepository {
  createUser: (user: ICreateUser) => Promise<IUsersEntity | null>;
  updateUser: (id: string, user: IUpdateUser) => Promise<IUsersEntity | null>;
  findUserById: (userId: string) => Promise<IFindUserById | null>;
  getInfoById: (id: string) => Promise<IGetInfoUser | null>;
  getInfoByUsername: (username: string) => Promise<IGetInfoByUsername | null>;
  countUsers: () => Promise<number>;
  userExistsByUsername: (username: string) => Promise<boolean | null>;
  userExistsById: (id: string) => Promise<boolean | null>;
}
