import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';

import { gatewayTokenRepository } from 'src/payment-gateway/domain/repository/gateway-token.repository';
import {
  IGatewayTokenEntity,
  TCreateGatewayToken,
  TGetLastTokenById,
} from 'src/payment-gateway/domain/entities/gateway-token.entity';

import { GatewayTokenModel } from '../models/gateway-token.model';
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

  async getTokenById(tokenId: string): Promise<TGetLastTokenById | undefined | null> {
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
          id: tokenId,
          createdAt: LessThan(moment().add(10, 'minutes').toDate()),
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

  async tokenExists(tokenId: string): Promise<boolean | null> {
    try {
      const token = await this.gatewayTokenModel.countBy({
        id: tokenId,
        createdAt: LessThan(moment().add(10, 'minutes').toDate()),
      });

      return token > 0;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
