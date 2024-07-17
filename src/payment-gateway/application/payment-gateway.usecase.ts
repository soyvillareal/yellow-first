import { paymentGatewayRepository } from 'src/payment-gateway/domain/repository/payment-gateway.repository';

import { IGenerateCardTokenPayload, IGeneratePaymentSourcesPayload } from '../domain/entities/payment-gateway.entity';

export class PaymentGatewayUseCase {
  constructor(private readonly paymentGatewayRepository: paymentGatewayRepository) {}

  async generateCardToken({ number, cvc, expMonth, expYear, cardHolder }: IGenerateCardTokenPayload): Promise<string> {
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

    return cardToken.response.data.id;
  }

  async generatePaymentSources({ customerEmail, cardToken, type }: IGeneratePaymentSourcesPayload): Promise<number> {
    const acceptanceToken = await this.paymentGatewayRepository.merchants();

    if ('error' in acceptanceToken.response) {
      throw new Error('Whoops! Something went wrong.');
    }

    const paymentSource = await this.paymentGatewayRepository.paymentResource({
      acceptance_token: acceptanceToken.response.data.presigned_acceptance.acceptance_token,
      customer_email: customerEmail,
      type,
      token: cardToken,
    });

    if ('error' in paymentSource.response) {
      throw new Error('Whoops! Something went wrong.');
    }

    if (paymentSource.response.status !== 'CREATED') {
      throw new Error('Whoops! Something went wrong.');
    }

    return paymentSource.response.data.id;
  }
}
