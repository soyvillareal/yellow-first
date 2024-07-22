import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IGetInfoByUsername, ISessionEntity, TCreateSession, TGetInfoUser } from 'src/session/domain/entities/session.entity';
import { sessionRepository } from 'src/session/domain/repository/session.repository';

import { SessionModel } from '../models/session.model';
import { UsersModel } from '../models/users.model';

@Injectable()
export class SessionService implements sessionRepository {
  constructor(
    @InjectRepository(SessionModel) private readonly sessionModel: Repository<SessionModel>,
    @InjectRepository(UsersModel) private readonly userModel: Repository<UsersModel>,
  ) {}

  async createSession({ id, userId, jwt, type, expiredAt }: TCreateSession): Promise<ISessionEntity | null> {
    try {
      const createdToken = this.sessionModel.create({
        id,
        userId,
        jwt,
        type,
        expiredAt,
      });

      const savedToken = await this.sessionModel.save(createdToken);

      return savedToken;
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
