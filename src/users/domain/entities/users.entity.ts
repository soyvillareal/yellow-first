export enum ERoles {
  ADMIN = 'admin',
  CLIENT = 'client',
}

export interface IUsersEntity {
  id: string;
  username: string;
  password: string;
  role: ERoles;
  updatedAt: Date;
  createdAt: Date;
}

export type ICreateUser = Omit<IUsersEntity, 'id' | 'updatedAt' | 'createdAt'>;

export type IUpdateUser = Omit<IUsersEntity, 'id' | 'role' | 'updatedAt' | 'createdAt'>;

export type IGetInfoUser = Omit<IUsersEntity, 'password'>;

export type IGetInfoByUsername = Pick<IUsersEntity, 'id' | 'username' | 'password' | 'role'>;

export type IFindUserById = Pick<IUsersEntity, 'username'>;

export type ICreateUserResponse = Pick<IUsersEntity, 'id' | 'username'>;

export type ICreateUserDTO = Omit<ICreateUser, 'role'>;

export type IUpdateUserDTO = Partial<Pick<IUpdateUser, 'username' | 'password'>>;
