import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import moment from 'moment-timezone';

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

  async countTokens(userId: string): Promise<number> {
    try {
      const date = moment().subtract(1, 'days').toDate(); // Subtract 24 hours from the current date

      const count = await this.tokensModel.count({
        where: {
          userId: userId,
          createdAt: MoreThan(date),
        },
      });

      return count;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
