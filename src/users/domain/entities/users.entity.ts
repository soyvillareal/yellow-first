export enum ERoles {
  ADMIN = 'admin',
  CLIENT = 'client',
}

export interface IUsersEntity {
  id: string;
  email: string;
  username: string;
  password: string;
  role: ERoles;
  paymentSourceHolder: number;
  updatedAt: Date;
  createdAt: Date;
}

export type ICreateUser = Omit<IUsersEntity, 'id' | 'paymentSourceHolder' | 'updatedAt' | 'createdAt'>;

export type IGetInfoUser = Omit<IUsersEntity, 'password'>;

export type IGetInfoByUsername = Pick<IUsersEntity, 'id' | 'username' | 'password' | 'role'>;

export type ICreateUserResponse = Pick<IUsersEntity, 'id' | 'username'>;

export type ICreateUserDTO = Omit<ICreateUser, 'role' | 'paymentSourceHolder'>;
