import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isNotEmpty } from 'class-validator';

import {
  ETransactionStatus,
  IStockEntity,
  ITransactionEntity,
  TCreateStock,
  TCreateTransaction,
} from 'src/transaction/domain/entities/transaction.entity';
import { transactionRepository } from 'src/transaction/domain/repository/transaction.repository';

import { StockModel } from '../models/stock.model';
import { TransactionModel } from '../models/transaction.model';

@Injectable()
export class TransactionService implements transactionRepository {
  constructor(
    @InjectRepository(StockModel) private readonly stockModel: Repository<StockModel>,
    @InjectRepository(TransactionModel) private readonly transactionModel: Repository<TransactionModel>,
  ) {}

  async createStock({ productId, quantity }: TCreateStock): Promise<IStockEntity | null> {
    try {
      const createdStock = this.stockModel.create({
        productId,
        quantity,
      });

      const savedStock = await this.stockModel.save(createdStock);

      return savedStock;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async updateStockQuantity(stockId: number, quantity: number): Promise<boolean | null> {
    try {
      const findOrFailStock = await this.stockModel.findOneOrFail({
        where: {
          id: stockId,
        },
      });

      const createdStock = this.stockModel.create({
        ...findOrFailStock,
        quantity,
      });

      const savedStock = await this.stockModel.save(createdStock);

      return isNotEmpty(savedStock);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async createTransaction({ userId, reference, productId, amount }: TCreateTransaction): Promise<ITransactionEntity | null> {
    try {
      const createdTransaction = this.transactionModel.create({ userId, reference, productId, amount });

      const savedTransaction = await this.transactionModel.save(createdTransaction);

      return savedTransaction;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async updateTransactionStatus(transactionId: number, status: ETransactionStatus): Promise<boolean | null> {
    try {
      const findOrFailTransaction = await this.transactionModel.findOneOrFail({
        where: {
          id: transactionId,
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
}
