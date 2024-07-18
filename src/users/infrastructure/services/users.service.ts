import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { usersRepository } from 'src/users/domain/repository/users.repository';
import { ICreateUser, IGetInfoByUsername, IGetInfoUser, IUsersEntity } from 'src/users/domain/entities/users.entity';

import { UsersModel } from '../models/users.model';
import { isNotEmpty } from 'class-validator';

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

  async getInfoById(id: string): Promise<IGetInfoUser | undefined | null> {
    try {
      const userFound = await this.userModel.findOne({
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
          paymentSourceHolder: true,
          updatedAt: true,
          createdAt: true,
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

  async updatePaymentSourceHolder(userId: string, paymentSourceId: number): Promise<boolean | null> {
    try {
      const findOrFailUser = await this.userModel.findOneOrFail({
        where: {
          id: userId,
        },
      });

      const createdUser = this.userModel.create({
        ...findOrFailUser,
        paymentSourceHolder: paymentSourceId,
      });

      const savedUser = await this.userModel.save(createdUser);

      return isNotEmpty(savedUser);
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
          username: true,
          password: true,
          role: true,
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
