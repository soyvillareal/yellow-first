import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';

import { gatewayTokenRepository } from 'src/payment-gateway/domain/repository/token.repository';
import { IGatewayTokenEntity, TCreateGatewayToken, TGetLastTokenById } from 'src/payment-gateway/domain/entities/token.entity';

import { GatewayTokenModel } from '../models/token.model';
import moment from 'moment';

@Injectable()
export class GatewayTokenService implements gatewayTokenRepository {
  constructor(@InjectRepository(GatewayTokenModel) private readonly gatewayTokenModel: Repository<GatewayTokenModel>) {}

  async createToken({
    userId,
    token,
    brand,
    lastFour,
    cardHolder,
    expMonth,
    expYear,
    expiredAt,
    validityEndsAt,
  }: TCreateGatewayToken): Promise<IGatewayTokenEntity | null> {
    try {
      const createdTransaction = this.gatewayTokenModel.create({
        userId,
        token,
        brand,
        cardHolder,
        expMonth,
        expYear,
        expiredAt,
        lastFour,
        validityEndsAt,
      });

      const savedTransaction = await this.gatewayTokenModel.save(createdTransaction);

      return savedTransaction;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getLastTokenByUserId(userId: string): Promise<TGetLastTokenById | undefined | null> {
    try {
      const token = await this.gatewayTokenModel.findOne({
        select: {
          id: true,
          token: true,
          brand: true,
          lastFour: true,
          expMonth: true,
          expYear: true,
          cardHolder: true,
          expiredAt: true,
        },

        where: {
          userId,
          createdAt: LessThan(moment().add(10, 'minutes').toDate()),
        },
        order: {
          createdAt: 'DESC',
        },
      });

      if (token === null) {
        return undefined;
      }

      return token;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async lastTokenIdByUserId(userId: string): Promise<string | undefined | null> {
    try {
      const token = await this.gatewayTokenModel.findOne({
        select: {
          id: true,
        },
        where: {
          userId,
          createdAt: LessThan(moment().add(10, 'minutes').toDate()),
        },
        order: {
          createdAt: 'DESC',
        },
      });

      if (token === null) {
        return undefined;
      }

      return token.id;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
