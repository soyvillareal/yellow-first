import { Controller, Get, HttpException, HttpStatus, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { RequestWithUser } from 'passport-saml/lib/passport-saml/types';

import { ApiResponseCase } from 'src/framework/domain/entities/framework.entity';
import { FrameworkService } from 'src/framework/infraestructure/services/framework.service';
import { AuthUseCase } from 'src/auth/domain/application/auth.usecase';

import { SamlAuthGuard } from '../guards/auth.guard';
import { AuthService } from '../services/auth.service';

@Controller('auth')
@UseGuards(SamlAuthGuard)
@UseInterceptors(FrameworkService)
export class AuthController {
  private readonly authUseCase: AuthUseCase;
  constructor(private readonly authService: AuthService) {
    this.authUseCase = new AuthUseCase(this.authService);
  }

  @Get('protected')
  getProtectedResource(): ApiResponseCase {
    return {
      message: 'Este es un recurso protegido',
      data: null,
    };
  }

  @Get('logout')
  async logout(@Req() req: RequestWithUser): Promise<ApiResponseCase<string>> {
    try {
      return {
        data: await this.authUseCase.logout(req),
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
