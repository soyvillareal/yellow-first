import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ICreateToken } from 'src/tokens/domain/entities/tokens.entity';
import { tokensRepository } from 'src/tokens/domain/repository/tokens.repository';

import { TokensModel } from '../models/tokens.model';

@Injectable()
export class TokensService implements tokensRepository {
  constructor(@InjectRepository(TokensModel) private readonly tokensModel: Repository<TokensModel>) {}

  async createToken(token: ICreateToken): Promise<ICreateToken | null> {
    try {
      const createdToken = this.tokensModel.create({
        token: token.token,
        userId: token.userId,
      });

      const savedToken = await this.tokensModel.save(createdToken);

      return savedToken;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
