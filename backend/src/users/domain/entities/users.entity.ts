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
  firstAddress: string;
  secondAddress: string;
  state: string;
  city: string;
  pincode: string;
  phoneCode: string;
  phoneNumber: string;
  updatedAt: Date;
  createdAt: Date;
}

export type ICreateUser = Pick<IUsersEntity, 'email' | 'username' | 'password' | 'role'>;

export type TGetInfoUser = Pick<IUsersEntity, 'email'>;

export type IGetInfoByUsername = Pick<
  IUsersEntity,
  | 'id'
  | 'email'
  | 'username'
  | 'password'
  | 'role'
  | 'firstAddress'
  | 'secondAddress'
  | 'state'
  | 'city'
  | 'pincode'
  | 'phoneCode'
  | 'phoneNumber'
>;

export type ICreateUserResponse = Pick<IUsersEntity, 'id' | 'username'>;

export type ICreateUserDTO = Pick<ICreateUser, 'email' | 'username' | 'password'>;
