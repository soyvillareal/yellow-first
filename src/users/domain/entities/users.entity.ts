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
  updatedAt: Date;
  createdAt: Date;
}

export type ICreateUser = Omit<IUsersEntity, 'id' | 'updatedAt' | 'createdAt'>;

export type TGetInfoUser = Pick<IUsersEntity, 'email'>;

export type IGetInfoByUsername = Pick<IUsersEntity, 'id' | 'email' | 'username' | 'password' | 'role'>;

export type ICreateUserResponse = Pick<IUsersEntity, 'id' | 'username'>;

export type ICreateUserDTO = Omit<ICreateUser, 'role'>;
