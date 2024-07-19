import { HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import bcrypt from 'bcrypt';

import { UsersService } from 'src/users/infrastructure/services/users.service';
import { ICredentialsToken } from 'src/session/domain/entities/session.entity';
import { IGetInfoByUsername } from 'src/users/domain/entities/users.entity';

import { authSessionDto } from '../dtos/session.dto';

@Injectable()
export class TokenValidationPipe implements PipeTransform {
  constructor(private readonly usersService: UsersService) {}

  async transform(credentials: ICredentialsToken): Promise<IGetInfoByUsername> {
    const planCredentialsClass = plainToClass(authSessionDto, credentials);
    const errors = await validate(planCredentialsClass, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      const messages = errors.flatMap((error) => Object.values(error.constraints));
      throw new HttpException({ message: messages }, HttpStatus.BAD_REQUEST);
    }

    const userFound = await this.usersService.getInfoByUsername(credentials.username);

    if (userFound === null) {
      throw new HttpException('Ups! Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (userFound === undefined) {
      throw new HttpException('Invalid username or password!', HttpStatus.UNAUTHORIZED);
    }

    const passwordMatch = bcrypt.compareSync(credentials.password, userFound.password);

    if (passwordMatch === false) {
      throw new HttpException('Invalid username or password!', HttpStatus.UNAUTHORIZED);
    }

    return userFound;
  }
}
