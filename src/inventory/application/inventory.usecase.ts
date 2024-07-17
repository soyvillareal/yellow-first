import { usersRepository } from 'src/users/domain/repository/users.repository';

import { PaymentGatewayUseCase } from '../../payment-gateway/application/payment-gateway.usecase';
import { productRepository } from '../../product/domain/repository/product.repository';
import { inventoryRepository } from '../domain/repository/inventory.repository';
import { paymentGatewayRepository } from '../../payment-gateway/domain/repository/payment-gateway.repository';
import {
  ETransactionStatus,
  ICardTokenizationPayload,
  ICardTokenizationResponse,
  ITransactionPayload,
  ITransactionResponse,
} from '../domain/entities/inventory.entity';

export class InventoryUseCase {
  protected readonly paymentGatewayUseCase: PaymentGatewayUseCase;
  constructor(
    private readonly inventoryRepository: inventoryRepository,
    private readonly productRepository: productRepository,
    private readonly userRepository: usersRepository,
    private readonly paymentGatewayRepository: paymentGatewayRepository,
  ) {
    this.paymentGatewayUseCase = new PaymentGatewayUseCase(this.paymentGatewayRepository);
  }

  async transaction(
    userId: string,
    { productId, paymentSourceId, signature }: ITransactionPayload,
  ): Promise<ITransactionResponse> {
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

    const createdTransaction = await this.inventoryRepository.createTransaction({
      userId,
      productId,
      amount: product.price,
    });

    if (createdTransaction === null) {
      throw new Error('Whoops! Something went wrong.');
    }

    const gatewayTransaction = await this.paymentGatewayRepository.transactions({
      amount_in_cents: product.price,
      currency: 'COP',
      customer_email: user.email,
      payment_source_id: paymentSourceId,
      reference: product.reference,
      signature,
      payment_method: {
        installments: 1,
      },
    });

    if ('error' in gatewayTransaction.response) {
      throw new Error('Whoops! Something went wrong.');
    }

    let transactionStatus = ETransactionStatus.FAILED;
    if (gatewayTransaction.response.status === 'CREATED') {
      transactionStatus = ETransactionStatus.COMPLETED;
    } else if (gatewayTransaction.response.status === 'DECLINED') {
      transactionStatus = ETransactionStatus.DECLINED;
    }

    const updatedTransaction = await this.inventoryRepository.updateTransactionStatus(product.stock - 1, transactionStatus);

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
    const user = await this.userRepository.getInfoById(userId);

    const cardToken = await this.paymentGatewayUseCase.generateCardToken({
      number,
      cvc,
      expMonth,
      expYear,
      cardHolder,
    });

    const paymentSource = await this.paymentGatewayUseCase.generatePaymentSources({
      customerEmail: user.email,
      cardToken,
      type: 'CARD',
    });

    return {
      tokenId: paymentSource,
    };
  }
}
