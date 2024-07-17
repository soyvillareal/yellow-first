import { Body, Controller, HttpCode, HttpException, HttpStatus, Post, Req, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { RequestWithUser } from 'passport-saml/lib/passport-saml/types';

import { ApiResponseCase } from 'src/framework/domain/entities/framework.entity';
import { IGenerateTokenResponse } from 'src/tokens/domain/entities/tokens.entity';
import { IGetInfoByUsername } from 'src/users/domain/entities/users.entity';
import { DApiResponseCase } from 'src/common/infraestructure/decorators/common.decorator';
import { FrameworkService } from 'src/framework/infraestructure/services/framework.service';

import { TokensService } from '../services/token.service';
import { TokensUseCase } from '../../aplication/tokens.usecase';
import { generateTokenDto, generateTokenResponse } from '../dtos/tokens.dto';
import { TokenValidationPipe } from '../core/token.pipe';

@ApiTags('Tokens')
@Controller('token')
@UseInterceptors(FrameworkService)
export class TokensController {
  private readonly tokensUseCase: TokensUseCase;

  constructor(private readonly tokensService: TokensService, private readonly configService: ConfigService) {
    this.tokensUseCase = new TokensUseCase(this.tokensService, this.configService);
  }

  @Post('generate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Genenerar un token',
    description:
      'Este servicio generará un token, el token generado será necesario para realizar cualquier petición a la API. <br /> <br /> <strong>Tener en cuenta:</strong> <br /><br /><b>1.</b> El token generado tendrá una duración de 6 horas.<br /><br /> <b>2.</b> Si se le ha indicado que usted tiene un límite de tokens a generar por día, no podrá generar más tokens hasta el siguiente día.',
    tags: ['Tokens'],
  })
  @ApiBody({ type: generateTokenDto })
  @DApiResponseCase({
    statusCode: HttpStatus.OK,
    description: 'Token generado correctamente!',
    dataDto: generateTokenResponse,
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
  async generateToken(
    @Body(TokenValidationPipe) body: IGetInfoByUsername,
    @Req() request: RequestWithUser,
  ): Promise<ApiResponseCase<IGenerateTokenResponse>> {
    request.user = {
      userId: body.id,
      origin: body.origin,
      projectName: body.projectName,
      role: body.role,
      username: body.username,
    };

    try {
      const token = await this.tokensUseCase.generateToken(body);

      return {
        message: 'Token generated successfully!',
        data: {
          token,
        },
      };
    } catch (error) {
      console.log('errorCatch: ', error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
