import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { usersRepository } from 'src/users/domain/repository/users.repository';
import {
  ICreateUser,
  IFindUserById,
  IGetInfoByUsername,
  IGetInfoUser,
  IUpdateUser,
  IUsersEntity,
} from 'src/users/domain/entities/users.entity';

import { UsersModel } from '../models/users.model';

@Injectable()
export class UsersService implements usersRepository {
  constructor(
    @InjectRepository(UsersModel) private readonly userModel: Repository<UsersModel>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async createUser({ username, password, role }: ICreateUser): Promise<IUsersEntity | null> {
    try {
      const createdUser = this.userModel.create({
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

  async updateUser(id: string, { username, password }: IUpdateUser): Promise<IUsersEntity | null> {
    try {
      const findOrFailUser = await this.userModel.findOneOrFail({
        where: { id },
      });

      const createdUser = this.userModel.create({
        ...findOrFailUser,
        username,
        password,
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
          username: true,
          role: true,
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

  async findUserById(userId: string): Promise<IFindUserById | null> {
    try {
      const userFound = await this.userModel.findOne({
        select: {
          username: true,
        },
        where: { id: userId },
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

  async countUsers(): Promise<number> {
    try {
      const usersCount = await this.userModel.count();

      return usersCount;
    } catch (error) {
      console.log(error);
      return 0;
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
