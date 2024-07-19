import { ConfigService } from '@nestjs/config';

import { CanActivate, type ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

import { CommonUseCase } from 'src/common/application/common.usecase';
import { UsersService } from 'src/users/infrastructure/services/users.service';
import { TSession } from 'src/session/domain/entities/session.entity';

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
      const payload = await this.jwtService.verifyAsync<TSession>(token, {
        secret: this.configService.get<string>('config.secret_key', {
          infer: true,
        }),
      });

      if (payload?.data !== undefined) {
        if (payload?.data?.id === undefined) {
          throw new UnauthorizedException('Invalid token');
        }

        const foundUser = await this.usersService.userExistsById(payload.data.id);

        if (foundUser === null) {
          throw new UnauthorizedException('Ups! Something went wrong, please try again');
        }

        if (foundUser === false) {
          throw new UnauthorizedException('Invalid token');
        }
      }

      req.user = payload;
      return true;
    } catch (error) {
      console.log(error.message);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
