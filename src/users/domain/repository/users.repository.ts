import { ICreateUser, IGetInfoByUsername, IGetInfoUser, IUsersEntity } from '../entities/users.entity';

export interface usersRepository {
  createUser: (user: ICreateUser) => Promise<IUsersEntity | null>;
  updatePaymentSourceHolder: (userId: string, paymentSourceId: number) => Promise<boolean | null>;
  getInfoById: (id: string) => Promise<IGetInfoUser | undefined | null>;
  getInfoByUsername: (username: string) => Promise<IGetInfoByUsername | null>;
  userExistsByUsername: (username: string) => Promise<boolean | null>;
  userExistsById: (id: string) => Promise<boolean | null>;
}
