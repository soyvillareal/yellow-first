import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { usersRepository } from 'src/users/domain/repository/users.repository';
import { ICreateUser, IGetInfoByUsername, IUsersEntity, TGetInfoUser } from 'src/users/domain/entities/users.entity';

import { UsersModel } from '../models/users.model';

@Injectable()
export class UsersService implements usersRepository {
  constructor(@InjectRepository(UsersModel) private readonly userModel: Repository<UsersModel>) {}

  async createUser({ email, username, password, role }: ICreateUser): Promise<IUsersEntity | null> {
    try {
      const createdUser = this.userModel.create({
        email,
        username,
        password,
        role,
      });

      const savedUser = await this.userModel.save(createdUser);

      return savedUser;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getInfoById(id: string): Promise<TGetInfoUser | undefined | null> {
    try {
      const userFound = await this.userModel.findOne({
        select: {
          email: true,
          phoneCode: true,
          phoneNumber: true,
          firstAddress: true,
          secondAddress: true,
          state: true,
          city: true,
          pincode: true,
        },
        where: { id },
      });

      if (userFound === null) {
        return undefined;
      }

      return userFound;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getInfoByUsername(username: string): Promise<IGetInfoByUsername | null> {
    try {
      const userFound = await this.userModel.findOne({
        select: {
          id: true,
          email: true,
          username: true,
          password: true,
          role: true,
          firstAddress: true,
          secondAddress: true,
          state: true,
          city: true,
          pincode: true,
          phoneCode: true,
          phoneNumber: true,
        },
        where: { username },
      });

      if (userFound === null) {
        return undefined;
      }

      return userFound;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async userExistsByUsername(username: string): Promise<boolean | null> {
    try {
      const userCount = await this.userModel.countBy({ username });

      return userCount > 0;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async userExistsById(id: string): Promise<boolean | null> {
    try {
      const userCount = await this.userModel.countBy({ id });

      return userCount > 0;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
