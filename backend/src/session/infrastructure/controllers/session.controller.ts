import { Body, Controller, HttpCode, HttpException, HttpStatus, Post, Req, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { RequestWithUser } from 'passport-saml/lib/passport-saml/types';

import { ApiResponseCase } from 'src/common/domain/entities/common.entity';
import { TAuthSessionResponse } from 'src/session/domain/entities/session.entity';
import { IGetInfoByUsername } from 'src/session/domain/entities/session.entity';
import { DApiResponseCase } from 'src/common/infrastructure/decorators/common.decorator';
import { CommonService } from 'src/common/infrastructure/services/common.service';

import { SessionService } from '../services/session.service';
import { SessionUseCase } from '../../application/session.usecase';
import { AnonymousSessionDto, authSessionDto, authSessionResponseDto } from '../dtos/session.dto';
import { TokenValidationPipe } from '../core/session.pipe';

@ApiTags('Sessions')
@Controller('session')
@UseInterceptors(CommonService)
export class SessionController {
  private readonly sessionUseCase: SessionUseCase;

  constructor(
    private readonly sessionService: SessionService,
    private readonly configService: ConfigService,
  ) {
    this.sessionUseCase = new SessionUseCase(this.sessionService, this.configService);
  }

  @Post('auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Iniciar sesión, con un usuario y contraseña',
    description:
      'Este servicio generará un token, el token generado será necesario para realizar cualquier petición a la API. <br /> <br /> <strong>Tener en cuenta:</strong> <br /><br /><b>1.</b> El token generado tendrá una duración de 6 horas.',
    tags: ['Sessions'],
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
    summary: 'Generar un token anonimo para realizar peticiones autenticadas',
    description:
      'Este servicio generará un token, el token generado será necesario para realizar cualquier petición a la API. <br /> <br /> <strong>Tener en cuenta:</strong> <br /><br /><b>1.</b> El token generado tendrá una duración de 6 horas.',
    tags: ['Sessions'],
  })
  @ApiBody({ type: authSessionDto })
  @DApiResponseCase({
    statusCode: HttpStatus.OK,
    description: 'Token generado correctamente!',
    dataDto: authSessionResponseDto,
  })
  @DApiResponseCase({
    statusCode: HttpStatus.BAD_REQUEST,
    description: 'Falló la creación de la sesión, intente nuevamente',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', enum: [HttpStatus.UNAUTHORIZED] },
        message: {
          type: 'string',
          enum: ['Failed to create session!'],
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
