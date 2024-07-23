import { paymentGatewayRepository } from 'src/payment-gateway/domain/repository/payment-gateway.repository';

import {
  IGenerateCardTokenPayload,
  IGenerateCardTokenResponse,
  TCreateTransactions,
} from '../domain/entities/payment-gateway.entity';

export class PaymentGatewayUseCase {
  constructor(private readonly paymentGatewayRepository: paymentGatewayRepository) {}

  async generateCardToken({
    number,
    cvc,
    expMonth,
    expYear,
    cardHolder,
  }: IGenerateCardTokenPayload): Promise<IGenerateCardTokenResponse> {
    const cardToken = await this.paymentGatewayRepository.tokensCards({
      number,
      cvc,
      exp_month: expMonth,
      exp_year: expYear,
      card_holder: cardHolder,
    });

    if ('error' in cardToken.response) {
      throw new Error('Whoops! Something went wrong.');
    }

    if (cardToken.response.status !== 'CREATED') {
      throw new Error('Whoops! Something went wrong.');
    }

    return {
      cardToken: cardToken.response.data.id,
      brand: cardToken.response.data.brand,
      cardHolder: cardToken.response.data.card_holder,
      expMonth: cardToken.response.data.exp_month,
      expiredAt: cardToken.response.data.expires_at,
      expYear: cardToken.response.data.exp_year,
      lastFour: cardToken.response.data.last_four,
      validityEndsAt: cardToken.response.data.validity_ends_at,
    };
  }

  async createTransaction({
    amount_in_cents,
    currency,
    customer_email,
    reference,
    signature,
    payment_method,
  }: TCreateTransactions): Promise<string> {
    const acceptanceToken = await this.paymentGatewayRepository.merchants();

    if ('error' in acceptanceToken.response) {
      throw new Error('Whoops! Something went wrong.');
    }

    const creaatedTransaction = await this.paymentGatewayRepository.transactions({
      amount_in_cents,
      currency,
      customer_email,
      reference,
      signature,
      acceptance_token: acceptanceToken.response.data.presigned_acceptance.acceptance_token,
      payment_method,
    });

    if ('error' in creaatedTransaction.response) {
      throw new Error('Whoops! Something went wrong.');
    }

    return creaatedTransaction.response.data.id;
  }
}
