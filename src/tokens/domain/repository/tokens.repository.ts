import { ICreateToken } from '../entities/tokens.entity';

export interface tokensRepository {
  createToken: (token: ICreateToken) => Promise<ICreateToken | null>;
}
