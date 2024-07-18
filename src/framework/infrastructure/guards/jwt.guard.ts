import { CanActivate, type ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

import { CommonUseCase } from 'src/common/application/common.usecase';
import { IUserTokenData } from 'src/framework/domain/entities/framework.entity';
import { UsersService } from 'src/users/infrastructure/services/users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  private readonly commonUseCase: CommonUseCase;
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    super();
    this.commonUseCase = new CommonUseCase(this.configService);
  }

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    const token = this.commonUseCase.extractJWTToken(req);

    if (!token) {
      throw new UnauthorizedException("Token was't provided!");
    }

    try {
      const payload = await this.jwtService.verifyAsync<IUserTokenData>(token, {
        secret: this.configService.get<string>('config.secret_key', {
          infer: true,
        }),
      });

      if (payload.hasOwnProperty('userId') === false) {
        throw new UnauthorizedException('Invalid token');
      }

      const foundUser = await this.usersService.userExistsById(payload.userId);

      if (foundUser === null) {
        throw new UnauthorizedException('Ups! Something went wrong, please try again');
      }

      if (foundUser === false) {
        throw new UnauthorizedException('Invalid token');
      }

      req.user = payload;
      return true;
    } catch (error) {
      console.log(error.message);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
