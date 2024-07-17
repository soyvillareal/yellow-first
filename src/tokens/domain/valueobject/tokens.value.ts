import { ITokensEntity } from '../entities/tokens.entity';

export class TokenValue implements ITokensEntity {
  id: number;
  userId: string;
  token: string;
  updatedAt: Date;
  createdAt: Date;

  constructor({ id, token, userId, updatedAt, createdAt }: ITokensEntity) {
    this.id = id;
    this.userId = userId;
    this.token = token;
    this.updatedAt = updatedAt;
    this.createdAt = createdAt;
  }
}
