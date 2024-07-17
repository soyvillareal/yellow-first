import { HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';

import { ICreateUser } from 'src/users/domain/entities/users.entity';

import { UsersService } from '../services/users.service';

@Injectable()
export class UserByUsernameExistsPipe implements PipeTransform {
  constructor(private readonly usersService: UsersService) {}

  async transform(user: ICreateUser) {
    const userFound = await this.usersService.userExistsByUsername(user.username);

    if (userFound === true) {
      throw new HttpException('User already exists!', HttpStatus.CONFLICT);
    }

    return user;
  }
}
