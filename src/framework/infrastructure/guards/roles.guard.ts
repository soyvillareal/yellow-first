import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ERoles } from 'src/users/domain/entities/users.entity';
import { IUserTokenData } from 'src/framework/domain/entities/framework.entity';
import { CommonUseCase } from 'src/common/application/common.usecase';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RoleAdminGuard implements CanActivate {
  private readonly commonUseCase: CommonUseCase;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.commonUseCase = new CommonUseCase(this.configService);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    try {
      const token = this.commonUseCase.extractJWTToken(req);

      if (!token) {
        throw new UnauthorizedException("Token was't provided!");
      }

      const payload = await this.jwtService.verifyAsync<IUserTokenData>(token, {
        secret: this.configService.get<string>('config.secret_key', {
          infer: true,
        }),
      });

      req.user = payload;
      return payload && payload.role === ERoles.ADMIN;
    } catch (error) {
      console.log(error.message);
      throw new UnauthorizedException('No valid token!');
    }
  }
}
