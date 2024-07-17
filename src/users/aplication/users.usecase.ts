import { CommonUseCase } from 'src/common/application/common.usecase';

import { ERoles, ICreateUserDTO, ICreateUserResponse, IGetInfoUser, IUpdateUserDTO } from '../domain/entities/users.entity';
import { usersRepository } from '../domain/repository/users.repository';

export class UsersUseCase {
  private readonly commonUseCase: CommonUseCase;
  constructor(private readonly usersRepository: usersRepository) {}

  async createUser(user: ICreateUserDTO, haveUsers: boolean): Promise<ICreateUserResponse> {
    const createdUser = await this.usersRepository.createUser({
      username: user.username,
      password: user.password,
      role: haveUsers === false ? ERoles.ADMIN : ERoles.CLIENT,
    });

    return {
      id: createdUser.id,
      username: createdUser.username,
    };
  }

  async updateUser(userId: string, user: IUpdateUserDTO): Promise<ICreateUserResponse> {
    const foundUser = await this.usersRepository.findUserById(userId);

    if (foundUser === null) {
      throw new Error('Ups! Something went wrong, please try again');
    }

    if (foundUser === undefined) {
      throw new Error('User not found');
    }

    if (user?.username !== foundUser.username) {
      const userExists = await this.usersRepository.userExistsByUsername(user.username);

      if (userExists === null) {
        throw new Error('Ups! Something went wrong, please try again');
      }

      if (userExists === true) {
        throw new Error('Username already exists!');
      }
    }

    const updateUser = await this.usersRepository.updateUser(userId, {
      username: user?.username,
      password: user?.password,
    });

    if (updateUser === null) {
      throw new Error('Ups! Something went wrong, please try again');
    }

    return {
      id: updateUser.id,
      username: updateUser.username,
    };
  }

  async getUserInfo(userId: string): Promise<IGetInfoUser> {
    const foundUser = await this.usersRepository.getInfoById(userId);

    if (foundUser === null) {
      throw new Error('Ups! Something went wrong, please try again');
    }

    if (foundUser === undefined) {
      throw new Error('User not found!');
    }

    return foundUser;
  }
}
