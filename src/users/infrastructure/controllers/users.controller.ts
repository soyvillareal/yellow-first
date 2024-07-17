import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { ApiResponseCase } from 'src/framework/domain/entities/framework.entity';
import { ERoles, ICreateUserResponse, IGetInfoUser } from 'src/users/domain/entities/users.entity';
import { RoleAdminGuard } from 'src/framework/infrastructure/guards/roles.guard';
import { DApiResponseCase } from 'src/common/infrastructure/decorators/common.decorator';
import { JwtAuthGuard } from 'src/framework/infrastructure/guards/jwt.guard';
import { FrameworkService } from 'src/framework/infrastructure/services/framework.service';
import { paramsWithUUIDDto } from 'src/common/infrastructure/dtos/common.dto';

import { UsersUseCase } from '../../application/users.usecase';
import { createUserDto } from '../dtos/users.dto';
import { UserByUsernameExistsPipe } from '../core/users-by-username.pipe';
import { UsersService } from '../services/users.service';

@ApiTags('Users')
@Controller('user')
@ApiBearerAuth()
@UseGuards(RoleAdminGuard)
@UseInterceptors(FrameworkService)
export class UsersController {
  private readonly usersUseCase: UsersUseCase;

  constructor(private readonly usersService: UsersService) {
    this.usersUseCase = new UsersUseCase(this.usersService);
  }

  @Post('create')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Crear usuario',
    description:
      'Este servicio creará un usuario con rol Super cuando no haya ningún usuario registrado en la base de datos, de lo contrario se creará un usuario con rol Client.',
    tags: ['Users'],
  })
  @ApiBody({ type: createUserDto })
  @DApiResponseCase({
    statusCode: HttpStatus.OK,
    description: '¡Usuario creado correctamente!',
    dataDto: createUserDto,
  })
  @DApiResponseCase({
    statusCode: HttpStatus.BAD_REQUEST,
    description: '¡No se encontró algún proyecto con el nombre proporcionado!',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', enum: [HttpStatus.BAD_REQUEST] },
        message: {
          type: 'string',
          enum: ['Project not found!'],
        },
      },
    },
  })
  @DApiResponseCase({
    statusCode: HttpStatus.CONFLICT,
    description: '¡El nombre de usuario ya se encuentra registrado en la base de datos!',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', enum: [HttpStatus.CONFLICT] },
        message: {
          type: 'string',
          enum: ['User already exists!'],
        },
      },
    },
  })
  async createUser(@Body(UserByUsernameExistsPipe) user: createUserDto): Promise<ApiResponseCase<ICreateUserResponse>> {
    try {
      return {
        message: 'User created successfully!',
        data: await this.usersUseCase.createUser({
          username: user.username,
          password: user.password,
        }),
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('only/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: 'id',
    type: String,
    description: 'UUID del usuario',
  })
  @ApiOperation({
    summary: 'Obtener información del usuario',
    description: 'Este servicio retornará la información del usuario registrado en la base de datos',
    tags: ['Users'],
  })
  @DApiResponseCase({
    statusCode: HttpStatus.OK,
    description: '¡Usuario encontrado!',
    schema: {
      example: {
        statusCode: 200,
        message: 'User found!',
        data: {
          id: 'b1b9b1b1-1b1b-1b1b-1b1b-1b1b1b1b1b1b',
          username: 'User1',
          role: ERoles.ADMIN,
          updatedAt: '2024-04-18T19:16:06.838Z',
          createdAt: '2024-04-18T19:16:06.838Z',
        },
      },
    },
  })
  @DApiResponseCase({
    statusCode: HttpStatus.BAD_REQUEST,
    description: '¡No se pudo encontrar algún usuario con el UUID proporcionado!',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', enum: [HttpStatus.BAD_REQUEST] },
        message: {
          type: 'string',
          enum: ['User not found!'],
        },
      },
    },
  })
  async getUserInfo(@Param() param: paramsWithUUIDDto): Promise<ApiResponseCase<IGetInfoUser>> {
    try {
      return {
        message: 'User found!',
        data: await this.usersUseCase.getUserInfo(param.id),
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
