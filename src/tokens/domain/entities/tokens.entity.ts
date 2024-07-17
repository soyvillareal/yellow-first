export interface ICredentialsToken {
  username: string;
  password: string;
}

export interface ICreateToken {
  userId: string;
  token: string;
}

export interface ITokensEntity {
  id: number;
  userId: string;
  token: string;
  updatedAt: Date;
  createdAt: Date;
}

export interface IGenerateTokenResponse {
  token: string;
}
