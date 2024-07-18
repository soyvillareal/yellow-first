import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

import { CommonUseCase } from 'src/common/application/common.usecase';
import { usersRepository } from 'src/users/domain/repository/users.repository';

import { PaymentGatewayUseCase } from '../../payment-gateway/application/payment-gateway.usecase';
import { productRepository } from '../../product/domain/repository/product.repository';
import { transactionRepository } from '../domain/repository/transaction.repository';
import { paymentGatewayRepository } from '../../payment-gateway/domain/repository/payment-gateway.repository';
import {
  ETransactionStatus,
  ICardTokenizationPayload,
  ICreatePaymentPayload,
  IUpdateTransactionResponse,
} from '../domain/entities/transaction.entity';
import { CardData } from '../domain/valueobject/transaction.value';
import { IGatewayEvent } from 'src/payment-gateway/domain/entities/payment-gateway.entity';
import { gatewayTokenRepository } from 'src/payment-gateway/domain/repository/token.repository';
import moment from 'moment';

export class TransactionUseCase {
  protected readonly commonUseCase: CommonUseCase;
  protected readonly paymentGatewayUseCase: PaymentGatewayUseCase;
  constructor(
    private readonly transactionRepository: transactionRepository,
    private readonly productRepository: productRepository,
    private readonly userRepository: usersRepository,
    private readonly paymentGatewayRepository: paymentGatewayRepository,
    private readonly gatewayTokenRepository: gatewayTokenRepository,
    private readonly configService: ConfigService,
  ) {
    this.commonUseCase = new CommonUseCase(this.configService);
    this.paymentGatewayUseCase = new PaymentGatewayUseCase(this.paymentGatewayRepository);
  }

  async createPayment(userId: string, { productId, installments }: ICreatePaymentPayload): Promise<void> {
    const user = await this.userRepository.getInfoById(userId);

    if (user === null || user === undefined) {
      throw new Error('Whoops! Something went wrong.');
    }

    const lastToken = await this.gatewayTokenRepository.getLastTokenByUserId(userId);

    if (lastToken === null || lastToken === undefined) {
      throw new Error('Whoops! Something went wrong.');
    }

    const product = await this.productRepository.getProductById(productId);

    if (product === null) {
      throw new Error('Whoops! Something went wrong.');
    }

    if (product === undefined) {
      throw new Error('Product not found!');
    }

    if (product.stock === 0) {
      throw new Error('Product out of stock!');
    }

    const transactionReference = uuidv4();

    const signature = await this.commonUseCase.generateSignature({
      amountInCents: parseInt(product.price),
      currency: 'COP',
      reference: transactionReference,
    });

    const transactionId = await this.paymentGatewayUseCase.createTransaction({
      amount_in_cents: parseInt(product.price),
      currency: 'COP',
      customer_email: user.email,
      reference: transactionReference,
      signature,
      payment_method: {
        type: 'CARD',
        installments,
        token: lastToken.token,
      },
    });

    const createdTransaction = await this.transactionRepository.createTransaction({
      userId,
      gatewayTokenId: lastToken.id,
      gatewayId: transactionId,
      reference: transactionReference,
      productId,
      amount: parseInt(product.price),
    });

    if (createdTransaction === null) {
      throw new Error('Whoops! Something went wrong.');
    }

    const newStock = product.stock - 1;

    const updatedStockInArticle = await this.productRepository.updateStockInProduct(productId, newStock);

    if (updatedStockInArticle === false) {
      throw new Error('Whoops! Something went wrong.');
    }
  }

  async cardTokenization(
    userId: string,
    { number, cvc, expMonth, expYear, cardHolder }: ICardTokenizationPayload,
  ): Promise<void> {
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
  }

  async webHookTransaction(checksum: string, { event, data, timestamp }: IGatewayEvent): Promise<IUpdateTransactionResponse> {
    const isValid = await this.commonUseCase.verifySignature(checksum, {
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

    if (event === 'transaction.updated') {
      const updatedTransaction = await this.transactionRepository.updateTransactionStatus(
        data.transaction.id,
        ETransactionStatus[data.transaction.status],
      );

      if (updatedTransaction === false) {
        throw new Error('Whoops! Something went wrong.');
      }

      return {
        recieve: true,
      };
    }

    return {
      recieve: false,
    };
  }
}
