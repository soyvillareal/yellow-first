import { usersRepository } from 'src/users/domain/repository/users.repository';

import { PaymentGatewayUseCase } from '../../payment-gateway/application/payment-gateway.usecase';
import { productRepository } from '../../product/domain/repository/product.repository';
import { transactionRepository } from '../domain/repository/transaction.repository';
import { paymentGatewayRepository } from '../../payment-gateway/domain/repository/payment-gateway.repository';
import {
  ETransactionStatus,
  ICardTokenizationPayload,
  ICardTokenizationResponse,
  ICreatePaymentPayload,
  ITransactionResponse,
} from '../domain/entities/transaction.entity';
import { CardData } from '../domain/valueobject/transaction.value';
import { CommonUseCase } from 'src/common/application/common.usecase';
import { ConfigService } from '@nestjs/config';

export class TransactionUseCase {
  protected readonly commonUseCase: CommonUseCase;
  protected readonly paymentGatewayUseCase: PaymentGatewayUseCase;
  constructor(
    private readonly transactionRepository: transactionRepository,
    private readonly productRepository: productRepository,
    private readonly userRepository: usersRepository,
    private readonly paymentGatewayRepository: paymentGatewayRepository,
    private readonly configService: ConfigService,
  ) {
    this.commonUseCase = new CommonUseCase(this.configService);
    this.paymentGatewayUseCase = new PaymentGatewayUseCase(this.paymentGatewayRepository);
  }

  async createPayment(userId: string, { productId, installments }: ICreatePaymentPayload): Promise<ITransactionResponse> {
    const user = await this.userRepository.getInfoById(userId);

    if (user === null || user === undefined) {
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

    const transactionReference = this.commonUseCase.createReference(10, 20);

    const createdTransaction = await this.transactionRepository.createTransaction({
      userId,
      reference: transactionReference,
      productId,
      amount: parseInt(product.price),
    });

    if (createdTransaction === null) {
      throw new Error('Whoops! Something went wrong.');
    }

    const signature = await this.commonUseCase.generateSignature({
      amountInCents: parseInt(product.price),
      currency: 'COP',
      reference: transactionReference,
    });

    const gatewayTransaction = await this.paymentGatewayRepository.transactions({
      amount_in_cents: parseInt(product.price),
      currency: 'COP',
      customer_email: user.email,
      payment_source_id: user.paymentSourceHolder,
      reference: transactionReference,
      signature,
      payment_method: {
        installments,
      },
    });

    if ('error' in gatewayTransaction.response) {
      throw new Error('Whoops! Something went wrong.');
    }

    const updatedTransaction = await this.transactionRepository.updateTransactionStatus(
      createdTransaction.id,
      ETransactionStatus[gatewayTransaction.response.data.status],
    );

    if (updatedTransaction === false) {
      throw new Error('Whoops! Something went wrong.');
    }

    return {
      transactionId: createdTransaction.id,
    };
  }

  async cardTokenization(
    userId: string,
    { number, cvc, expMonth, expYear, cardHolder }: ICardTokenizationPayload,
  ): Promise<ICardTokenizationResponse> {
    const cardData = new CardData(expMonth, expYear);

    const user = await this.userRepository.getInfoById(userId);

    const cardToken = await this.paymentGatewayUseCase.generateCardToken({
      number,
      cvc,
      expMonth: cardData.monthToString(),
      expYear: cardData.yearToString(),
      cardHolder,
    });

    const paymentSource = await this.paymentGatewayUseCase.generatePaymentSources({
      customerEmail: user.email,
      cardToken,
      type: 'CARD',
    });

    const updatedUser = await this.userRepository.updatePaymentSourceHolder(userId, paymentSource);

    if (updatedUser === false) {
      throw new Error('We could not update the payment source holder!');
    }

    return {
      tokenId: paymentSource,
    };
  }
}
