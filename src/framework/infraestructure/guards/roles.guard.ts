import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ERoles } from 'src/users/domain/entities/users.entity';
import { UsersService } from 'src/users/infraestructure/services/users.service';
import { config } from 'src/framework/infraestructure/core/config';
import { IUserTokenData } from 'src/framework/domain/entities/framework.entity';
import { CommonUseCase } from 'src/common/application/common.usecase';

@Injectable()
export class RoleSuperGuard implements CanActivate {
  private readonly commonUseCase: CommonUseCase;

  constructor(private readonly jwtService: JwtService, private readonly usersService: UsersService) {
    this.commonUseCase = new CommonUseCase();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    req.haveUsers = true;

    try {
      const countUsers = await this.usersService.countUsers();

      if (countUsers === 0) {
        req.haveUsers = false;
        return true;
      }

      const token = this.commonUseCase.extractJWTToken(req);

      if (!token) {
        throw new UnauthorizedException("Token was't provided!");
      }

      const payload = await this.jwtService.verifyAsync<IUserTokenData>(token, {
        secret: config.secret_key,
      });

      req.user = payload;
      return payload && payload.role === ERoles.SUPER;
    } catch (error) {
      console.log(error.message);
      throw new UnauthorizedException('No valid token!');
    }
  }
}
