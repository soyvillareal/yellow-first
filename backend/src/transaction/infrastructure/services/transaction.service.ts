import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isNotEmpty } from 'class-validator';

import {
  ETransactionStatus,
  IGetTransactionByGatewayId,
  ITransactionEntity,
  TCreateTransaction,
} from 'src/transaction/domain/entities/transaction.entity';
import { transactionRepository } from 'src/transaction/domain/repository/transaction.repository';

import { TransactionModel } from '../models/transaction.model';

@Injectable()
export class TransactionService implements transactionRepository {
  constructor(@InjectRepository(TransactionModel) private readonly transactionModel: Repository<TransactionModel>) {}

  async createTransaction({
    userId,
    gatewayTokenId,
    gatewayId,
    reference,
    productId,
    quantity,
    amount,
  }: TCreateTransaction): Promise<ITransactionEntity | null> {
    try {
      const createdTransaction = this.transactionModel.create({
        userId,
        gatewayTokenId,
        gatewayId,
        reference,
        productId,
        quantity,
        amount,
      });

      const savedTransaction = await this.transactionModel.save(createdTransaction);

      return savedTransaction;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async updateTransactionStatus(gatewayId: string, status: ETransactionStatus): Promise<boolean | null> {
    try {
      const findOrFailTransaction = await this.transactionModel.findOneOrFail({
        where: {
          gatewayId,
        },
      });

      const createdTransaction = this.transactionModel.create({
        ...findOrFailTransaction,
        status,
      });

      const savedTransaction = await this.transactionModel.save(createdTransaction);

      return isNotEmpty(savedTransaction);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async tokenExistsInTransaction(gatewayTokenId: string): Promise<boolean | null> {
    try {
      const tokenExists = await this.transactionModel.countBy({
        gatewayTokenId,
      });

      return tokenExists > 0;
    } catch (error) {
      return null;
    }
  }
  async getTransactionByGatewayId(gatewayId: string): Promise<IGetTransactionByGatewayId | undefined | null> {
    try {
      const foundTransaction = await this.transactionModel.findOne({
        select: {
          productId: true,
          amount: true,
          quantity: true,
        },
        where: {
          gatewayId,
        },
      });

      if (foundTransaction === null) {
        return undefined;
      }

      return foundTransaction;
    } catch (error) {
      return null;
    }
  }
}
