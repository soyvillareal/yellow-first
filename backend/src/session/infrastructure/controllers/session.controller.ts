import { Body, Controller, HttpCode, HttpException, HttpStatus, Post, Req, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { RequestWithUser } from 'passport-saml/lib/passport-saml/types';

import { ApiResponseCase } from 'src/framework/domain/entities/framework.entity';
import { TAuthSessionResponse } from 'src/session/domain/entities/session.entity';
import { IGetInfoByUsername } from 'src/users/domain/entities/users.entity';
import { DApiResponseCase } from 'src/common/infrastructure/decorators/common.decorator';
import { FrameworkService } from 'src/framework/infrastructure/services/framework.service';

import { SessionService } from '../services/session.service';
import { SessionUseCase } from '../../application/session.usecase';
import { AnonymousSessionDto, authSessionDto, authSessionResponseDto } from '../dtos/session.dto';
import { TokenValidationPipe } from '../core/session.pipe';
import { UsersService } from 'src/users/infrastructure/services/users.service';

@ApiTags('Sessions')
@Controller('session')
@UseInterceptors(FrameworkService)
export class SessionController {
  private readonly sessionUseCase: SessionUseCase;

  constructor(
    private readonly sessionService: SessionService,
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {
    this.sessionUseCase = new SessionUseCase(this.sessionService, this.userService, this.configService);
  }

  @Post('auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Genenerar un token',
    description:
      'Este servicio generará un token, el token generado será necesario para realizar cualquier petición a la API. <br /> <br /> <strong>Tener en cuenta:</strong> <br /><br /><b>1.</b> El token generado tendrá una duración de 6 horas.<br /><br /> <b>2.</b> Si se le ha indicado que usted tiene un límite de tokens a generar por día, no podrá generar más tokens hasta el siguiente día.',
    tags: ['Tokens'],
  })
  @ApiBody({ type: authSessionDto })
  @DApiResponseCase({
    statusCode: HttpStatus.OK,
    description: 'Token generado correctamente!',
    dataDto: authSessionResponseDto,
  })
  @DApiResponseCase({
    statusCode: HttpStatus.UNAUTHORIZED,
    description: 'El usuario o la contraseña son incorrectos',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', enum: [HttpStatus.UNAUTHORIZED] },
        message: {
          type: 'string',
          enum: ['Invalid username or password!'],
        },
      },
    },
  })
  @DApiResponseCase({
    statusCode: HttpStatus.TOO_MANY_REQUESTS,
    description: 'Has excedido el limite de tokens generados',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', enum: [HttpStatus.TOO_MANY_REQUESTS] },
        message: {
          type: 'string',
          enum: ['You have exceeded the limit of tokens'],
        },
      },
    },
  })
  async createAuthSession(
    @Body(TokenValidationPipe) body: IGetInfoByUsername,
    @Req() request: RequestWithUser,
  ): Promise<ApiResponseCase<TAuthSessionResponse>> {
    request.user = {
      userId: body.id,
      role: body.role,
      username: body.username,
    };

    try {
      const sessionData = await this.sessionUseCase.createAuthSession(body);

      return {
        message: 'Auth session created successfully!',
        data: sessionData,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('anonymous')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Genenerar un token',
    description:
      'Este servicio generará un token, el token generado será necesario para realizar cualquier petición a la API. <br /> <br /> <strong>Tener en cuenta:</strong> <br /><br /><b>1.</b> El token generado tendrá una duración de 6 horas.<br /><br /> <b>2.</b> Si se le ha indicado que usted tiene un límite de tokens a generar por día, no podrá generar más tokens hasta el siguiente día.',
    tags: ['Tokens'],
  })
  @ApiBody({ type: authSessionDto })
  @DApiResponseCase({
    statusCode: HttpStatus.OK,
    description: 'Token generado correctamente!',
    dataDto: authSessionResponseDto,
  })
  @DApiResponseCase({
    statusCode: HttpStatus.UNAUTHORIZED,
    description: 'El usuario o la contraseña son incorrectos',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', enum: [HttpStatus.UNAUTHORIZED] },
        message: {
          type: 'string',
          enum: ['Invalid username or password!'],
        },
      },
    },
  })
  @DApiResponseCase({
    statusCode: HttpStatus.TOO_MANY_REQUESTS,
    description: 'Has excedido el limite de tokens generados',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', enum: [HttpStatus.TOO_MANY_REQUESTS] },
        message: {
          type: 'string',
          enum: ['You have exceeded the limit of tokens'],
        },
      },
    },
  })
  async createAnonymousSession(@Body() body: AnonymousSessionDto): Promise<ApiResponseCase<TAuthSessionResponse>> {
    try {
      const sessionData = await this.sessionUseCase.createAnonymousSession({
        seed: body.seed,
      });

      return {
        message: 'Anonymous session created successfully!',
        data: sessionData,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
