export interface ICreateUserResponse {
  id: string;
  username: string;
}

export interface ICreateUserRequest {
  username: string;
  password: string;
  email: string;
}
