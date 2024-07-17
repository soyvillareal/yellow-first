import { ERoles, ICreateUserDTO, ICreateUserResponse, IGetInfoUser } from '../domain/entities/users.entity';
import { usersRepository } from '../domain/repository/users.repository';

export class UsersUseCase {
  constructor(private readonly usersRepository: usersRepository) {}

  async createUser(user: ICreateUserDTO): Promise<ICreateUserResponse> {
    const createdUser = await this.usersRepository.createUser({
      username: user.username,
      password: user.password,
      role: ERoles.CLIENT,
    });

    return {
      id: createdUser.id,
      username: createdUser.username,
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
