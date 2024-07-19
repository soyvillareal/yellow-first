import { ERoles, ICreateUserDTO, ICreateUserResponse } from '../domain/entities/users.entity';
import { usersRepository } from '../domain/repository/users.repository';

export class UsersUseCase {
  constructor(private readonly usersRepository: usersRepository) {}

  async createUser(user: ICreateUserDTO): Promise<ICreateUserResponse> {
    const createdUser = await this.usersRepository.createUser({
      username: user.username,
      password: user.password,
      role: ERoles.CLIENT,
      email: user.email,
    });

    return {
      id: createdUser.id,
      username: createdUser.username,
    };
  }
}
