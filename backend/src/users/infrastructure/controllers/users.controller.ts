import { Body, Controller, HttpCode, HttpException, HttpStatus, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiResponseCase } from 'src/common/domain/entities/common.entity';
import { ICreateUserResponse } from 'src/users/domain/entities/users.entity';
import { RoleAdminGuard } from 'src/common/infrastructure/guards/roles.guard';
import { DApiResponseCase } from 'src/common/infrastructure/decorators/common.decorator';
import { CommonService } from 'src/common/infrastructure/services/common.service';

import { UsersUseCase } from '../../application/users.usecase';
import { createUserDto } from '../dtos/users.dto';
import { UserByUsernameExistsPipe } from '../core/users-by-username.pipe';
import { UsersService } from '../services/users.service';

@ApiTags('Users')
@Controller('user')
@ApiBearerAuth()
@UseGuards(RoleAdminGuard)
@UseInterceptors(CommonService)
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
          email: user.email,
        }),
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
