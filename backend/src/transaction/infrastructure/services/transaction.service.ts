import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isNotEmpty } from 'class-validator';

import {
  ETransactionStatus,
  IDeliveryEntity,
  IGetTransactionByGatewayId,
  ITransactionEntity,
  ITransactionProductsEntity,
  TCreateDelivery,
  TCreateTransaction,
  TCreateTransactionProduct,
  TGetTransactionById,
  TGetTransactionConfig,
} from 'src/transaction/domain/entities/transaction.entity';
import { transactionRepository } from 'src/transaction/domain/repository/transaction.repository';

import { TransactionModel } from '../models/transaction.model';
import { TransactionProductsModel } from '../models/transaction-products.model';
import { DeliveryModel } from '../models/delivery.model';
import { TransactionConfigModel } from '../models/transaction-config.model';

@Injectable()
export class TransactionService implements transactionRepository {
  constructor(
    @InjectRepository(TransactionModel) private readonly transactionModel: Repository<TransactionModel>,
    @InjectRepository(TransactionProductsModel) private readonly transactionProductsModel: Repository<TransactionProductsModel>,
    @InjectRepository(DeliveryModel) private readonly deliveryModel: Repository<DeliveryModel>,
    @InjectRepository(TransactionConfigModel) private readonly transactionConfigModel: Repository<TransactionConfigModel>,
  ) {}

  async createTransaction({
    userId,
    gatewayTokenId,
    gatewayId,
    reference,
    totalAmount,
    phoneCode,
    phoneNumber,
    firstAddress,
    secondAddress,
    state,
    city,
    pincode,
  }: TCreateTransaction): Promise<ITransactionEntity | null> {
    try {
      const createdTransaction = this.transactionModel.create({
        userId,
        gatewayTokenId,
        gatewayId,
        reference,
        totalAmount,
        phoneCode,
        phoneNumber,
        firstAddress,
        secondAddress,
        state,
        city,
        pincode,
      });

      const savedTransaction = await this.transactionModel.save(createdTransaction);

      return savedTransaction;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async deleteTransactionById(transactionId: string): Promise<boolean | null> {
    try {
      const deletedTransaction = await this.transactionModel.delete({
        id: transactionId,
      });

      return isNotEmpty(deletedTransaction);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async createTransactionProduct({
    userId,
    transactionId,
    productId,
    gatewayId,
    quantity,
    amount,
  }: TCreateTransactionProduct): Promise<ITransactionProductsEntity | null> {
    try {
      const createdTransaction = this.transactionProductsModel.create({
        userId,
        transactionId,
        productId,
        gatewayId,
        quantity,
        amount,
      });

      const savedTransaction = await this.transactionProductsModel.save(createdTransaction);

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
  async getTransactionProductByGatewayId(gatewayId: string): Promise<IGetTransactionByGatewayId | undefined | null> {
    try {
      const foundTransaction = await this.transactionProductsModel.findOne({
        select: {
          transactionId: true,
          userId: true,
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

  async getTransactionById(userId: string, transactionId: string): Promise<TGetTransactionById | undefined | null> {
    try {
      const foundTransaction = await this.transactionModel.findOne({
        select: {
          totalAmount: true,
          status: true,
        },
        where: {
          id: transactionId,
          userId,
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

  async createDelivery({
    userId,
    transactionId,
    phoneCode,
    phoneNumber,
    firstAddress,
    secondAddress,
    state,
    city,
    pincode,
  }: TCreateDelivery): Promise<IDeliveryEntity | null> {
    try {
      const createdDelivery = this.deliveryModel.create({
        userId,
        transactionId,
        phoneCode,
        phoneNumber,
        firstAddress,
        secondAddress,
        state,
        city,
        pincode,
      });

      const savedDelivery = await this.deliveryModel.save(createdDelivery);

      return savedDelivery;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getTransactionConfig(): Promise<TGetTransactionConfig | undefined | null> {
    try {
      const transactionConfig = await this.transactionConfigModel.find({
        select: {
          fixedRate: true,
          variablePercentage: true,
          shippingFee: true,
        },
      });

      return transactionConfig ? transactionConfig[0] : undefined;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
