import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

import { CommonUseCase } from 'src/common/application/common.usecase';
import { usersRepository } from 'src/users/domain/repository/users.repository';
import { IGatewayEvent } from 'src/payment-gateway/domain/entities/payment-gateway.entity';
import { gatewayTokenRepository } from 'src/payment-gateway/domain/repository/token.repository';
import { websocketRepository } from 'src/transaction/domain/repository/transaction.repository';
import { TGetProductById } from 'src/product/domain/entities/product.entity';

import { PaymentGatewayUseCase } from '../../payment-gateway/application/payment-gateway.usecase';
import { productRepository } from '../../product/domain/repository/product.repository';
import { transactionRepository } from '../domain/repository/transaction.repository';
import { paymentGatewayRepository } from '../../payment-gateway/domain/repository/payment-gateway.repository';
import {
  ETransactionStatus,
  ICardTokenizationPayload,
  ICardTokenizationResponse,
  ICreatePaymentPayload,
  IUpdateTransactionResponse,
} from '../domain/entities/transaction.entity';
import { CardData, TransactionPrice } from '../domain/valueobject/transaction.value';

export class TransactionUseCase {
  protected readonly commonUseCase: CommonUseCase;
  protected readonly paymentGatewayUseCase: PaymentGatewayUseCase;
  constructor(
    private readonly transactionRepository: transactionRepository,
    private readonly productRepository: productRepository,
    private readonly userRepository: usersRepository,
    private readonly paymentGatewayRepository: paymentGatewayRepository,
    private readonly gatewayTokenRepository: gatewayTokenRepository,
    private readonly websocketRepository: websocketRepository,
    private readonly configService: ConfigService,
  ) {
    this.commonUseCase = new CommonUseCase(this.configService);
    this.paymentGatewayUseCase = new PaymentGatewayUseCase(this.paymentGatewayRepository);
  }

  async createPayment(userId: string, { products, tokenId, installments }: ICreatePaymentPayload): Promise<void> {
    const user = await this.userRepository.getInfoById(userId);

    if (user === null || user === undefined) {
      throw new Error('Whoops! Something went wrong.');
    }

    const cardToken = await this.gatewayTokenRepository.getTokenById(tokenId);

    if (cardToken === null || cardToken === undefined) {
      throw new Error('Whoops! Something went wrong.');
    }

    let total = 0;
    const foundProducts: Record<string, TGetProductById> = {};

    for (let i = 0; i < products.length; i++) {
      const product = products[i];

      const foundProduct = await this.productRepository.getProductById(product.id);

      if (foundProduct === null) {
        throw new Error('Whoops! Something went wrong.');
      }

      if (foundProduct === undefined) {
        throw new Error('Product not found!');
      }

      if (foundProduct.stock === 0) {
        throw new Error('Product out of stock!');
      }

      foundProducts[product.id] = foundProduct;
      total += parseInt(foundProduct.price) * product.quantity;
    }

    const gatewayPrice = new TransactionPrice(total);
    const transactionReference = uuidv4();

    const signature = await this.commonUseCase.generateSignature({
      amountInCents: gatewayPrice.getGatewayPrice(),
      currency: 'COP',
      reference: transactionReference,
    });

    const transactionId = await this.paymentGatewayUseCase.createTransaction({
      amount_in_cents: gatewayPrice.getGatewayPrice(),
      currency: 'COP',
      customer_email: user.email,
      reference: transactionReference,
      signature,
      payment_method: {
        type: 'CARD',
        installments,
        token: cardToken.token,
      },
    });

    for (let i = 0; i < products.length; i++) {
      const product = products[i];

      const foundProduct = foundProducts[product.id];

      const createdTransaction = await this.transactionRepository.createTransaction({
        userId,
        gatewayTokenId: cardToken.id,
        gatewayId: transactionId,
        reference: transactionReference,
        productId: product.id,
        quantity: product.quantity,
        amount: parseInt(foundProduct.price),
      });

      if (createdTransaction === null) {
        throw new Error('Whoops! Something went wrong.');
      }

      const newStock = foundProduct.stock - product.quantity;

      const updatedStockInArticle = await this.productRepository.updateStockInProduct(product.id, newStock);

      if (updatedStockInArticle === false) {
        throw new Error('Whoops! Something went wrong.');
      }
    }
  }

  async cardTokenization(
    userId: string,
    { number, cvc, expMonth, expYear, cardHolder }: ICardTokenizationPayload,
  ): Promise<ICardTokenizationResponse> {
    const cardData = new CardData(expMonth, expYear);

    const cardToken = await this.paymentGatewayUseCase.generateCardToken({
      number,
      cvc,
      expMonth: cardData.monthToString(),
      expYear: cardData.yearToString(),
      cardHolder,
    });

    const createdToken = await this.gatewayTokenRepository.createToken({
      userId,
      token: cardToken.cardToken,
      brand: cardToken.brand,
      lastFour: cardToken.lastFour,
      expMonth: cardToken.expMonth,
      expYear: cardToken.expYear,
      cardHolder: cardToken.cardHolder,
      expiredAt: moment(cardToken.expiredAt).toDate(),
      validityEndsAt: moment(cardToken.validityEndsAt).toDate(),
    });

    if (createdToken === null) {
      throw new Error('Whoops! Something went wrong.');
    }

    return {
      tokenId: createdToken.id,
      brand: cardToken.brand,
      lastFour: cardToken.lastFour,
      expMonth: cardToken.expMonth,
      expYear: cardToken.expYear,
      cardHolder: cardToken.cardHolder,
    };
  }

  async webHookTransaction(checksum: string, { event, data, timestamp }: IGatewayEvent): Promise<IUpdateTransactionResponse> {
    const isValid = this.commonUseCase.verifySignature(checksum, {
      transaction: {
        id: data.transaction.id,
        status: data.transaction.status,
        amountInCents: data.transaction.amount_in_cents,
      },
      timestamp,
    });

    if (isValid === false) {
      throw new Error('Invalid webhook signature!');
    }

    if (event !== 'transaction.updated') {
      throw new Error('Invalid webhook event!');
    }

    const updatedTransaction = await this.transactionRepository.updateTransactionStatus(
      data.transaction.id,
      ETransactionStatus[data.transaction.status],
    );

    if (updatedTransaction === false) {
      throw new Error('Whoops! Something went wrong.');
    }

    const transaction = await this.transactionRepository.getTransactionByGatewayId(data.transaction.id);

    if (transaction === null || transaction === undefined) {
      throw new Error('Whoops! Something went wrong.');
    }

    if (data.transaction.status !== 'APPROVED') {
      const product = await this.productRepository.getProductById(transaction.productId);

      if (product === null || product === undefined) {
        throw new Error('Whoops! Something went wrong.');
      }

      const updatedStock = await this.productRepository.updateStockInProduct(
        transaction.productId,
        product.stock + transaction.quantity,
      );

      if (updatedStock === null || updatedStock === false) {
        throw new Error('Whoops! Something went wrong.');
      }
    }

    this.websocketRepository.notifyTransactionUpdate(transaction.userId, {
      transactionId: data.transaction.id,
      status: data.transaction.status,
    });
    return {
      recieve: true,
    };
  }
}
