import { sign } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

import { IGetInfoByUsername } from 'src/users/domain/entities/users.entity';
import { IUserTokenData } from 'src/framework/domain/entities/framework.entity';

import { tokensRepository } from '../domain/repository/tokens.repository';
export class TokensUseCase {
  constructor(private readonly tokensRepository: tokensRepository, private readonly configService: ConfigService) {}

  async generateToken(user: IGetInfoByUsername): Promise<string> {
    const signToken: IUserTokenData = {
      userId: user.id,
      username: user.username,
      role: user.role,
    };

    const token = sign(signToken, this.configService.get<string>('config.secret_key'), { algorithm: 'HS256' });

    const createdLead = await this.tokensRepository.createToken({
      token: token,
      userId: user.id,
    });

    if (createdLead === null) {
      throw new Error('Error creating token');
    }

    return token;
  }
}
