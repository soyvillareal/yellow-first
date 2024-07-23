import { v4 as uuidv4 } from 'uuid';

import { PaymentGatewayUseCase } from './payment-gateway.usecase';
import { paymentGatewayRepository } from '../domain/repository/payment-gateway.repository';
import {
  IErrorResponseGA,
  IGenerateCardTokenPayload,
  IOkResponseGA,
  IResponseAG,
  ITokensCardsResponse,
  ITransactionsResponse,
  TCreateTransactions,
} from '../domain/entities/payment-gateway.entity';
import { mockAcceptanceTokenResponse } from './payment-gateway.mock';

describe('PaymentGatewayUseCase', () => {
  const mockPaymentGatewayRepository: jest.Mocked<paymentGatewayRepository> = {
    getTransactionById: jest.fn(),
    merchants: jest.fn(),
    paymentResource: jest.fn(),
    tokensCards: jest.fn(),
    transactions: jest.fn(),
  };

  let paymentGatewayUseCase: PaymentGatewayUseCase;

  beforeEach(() => {
    paymentGatewayUseCase = new PaymentGatewayUseCase(mockPaymentGatewayRepository);
    jest.clearAllMocks();
  });

  describe('generateCardToken', () => {
    it('should generate a card token successfully', async () => {
      const payload: IGenerateCardTokenPayload = {
        number: '4111111111111111',
        cvc: '123',
        expMonth: '12',
        expYear: '2025',
        cardHolder: 'John Doe',
      };
      const mockResponse: IResponseAG<IOkResponseGA<ITokensCardsResponse>> = {
        type: 'transactions',
        response: {
          status: 'CREATED',
          data: {
            id: 'token123',
            bin: '411111',
            brand: 'VISA',
            card_holder: 'John Doe',
            exp_month: '12',
            expires_at: '2025-12-31',
            exp_year: '2025',
            last_four: '1111',
            validity_ends_at: '2025-12-31',
            created_with_cvc: true,
            created_at: '2021-08-31T00:00:00Z',
            name: 'John Doe',
          },
        },
      };

      mockPaymentGatewayRepository.tokensCards.mockResolvedValue(mockResponse);

      const result = await paymentGatewayUseCase.generateCardToken(payload);

      expect(mockPaymentGatewayRepository.tokensCards).toHaveBeenCalledWith({
        number: payload.number,
        cvc: payload.cvc,
        exp_month: payload.expMonth,
        exp_year: payload.expYear,
        card_holder: payload.cardHolder,
      });
      expect(result).toEqual({
        cardToken: 'token123',
        brand: mockResponse.response.data.brand,
        cardHolder: mockResponse.response.data.card_holder,
        expMonth: mockResponse.response.data.exp_month,
        expiredAt: mockResponse.response.data.expires_at,
        expYear: mockResponse.response.data.exp_year,
        lastFour: mockResponse.response.data.last_four,
        validityEndsAt: mockResponse.response.data.validity_ends_at,
      });
    });

    it('should throw an error if response contains error', async () => {
      const payload: IGenerateCardTokenPayload = {
        number: '4111111111111111',
        cvc: '123',
        expMonth: '12',
        expYear: '2025',
        cardHolder: 'John Doe',
      };
      const mockErrorResponse: IResponseAG<IErrorResponseGA> = {
        type: 'transactions',
        response: {
          error: {
            type: 'error',
            code: 'some_error',
            messages: ['Some error'],
            reason: 'Some error',
          },
        },
      };

      mockPaymentGatewayRepository.tokensCards.mockResolvedValue(mockErrorResponse);

      await expect(paymentGatewayUseCase.generateCardToken(payload)).rejects.toThrow('Whoops! Something went wrong.');
    });

    it('should throw an error if status is not CREATED', async () => {
      const payload: IGenerateCardTokenPayload = {
        number: '4111111111111111',
        cvc: '123',
        expMonth: '12',
        expYear: '2025',
        cardHolder: 'John Doe',
      };
      const mockResponse: IResponseAG<IOkResponseGA<ITokensCardsResponse>> = {
        type: 'transactions',
        response: {
          status: 'DECLINED',
          data: expect.any(Object),
        },
      };

      mockPaymentGatewayRepository.tokensCards.mockResolvedValue(mockResponse);

      await expect(paymentGatewayUseCase.generateCardToken(payload)).rejects.toThrow('Whoops! Something went wrong.');
    });
  });

  describe('createTransaction', () => {
    it('should create a transaction successfully', async () => {
      const payload: TCreateTransactions = {
        amount_in_cents: 1000,
        currency: 'USD',
        customer_email: 'customer@example.com',
        reference: 'order123',
        signature: '1nc3pt10n2s213jhiuqd109he21',
        payment_method: {
          type: 'CARD',
          token: 'token123',
        },
      };
      const mockTransactionResponse: IResponseAG<IOkResponseGA<ITransactionsResponse>> = {
        type: 'transactions',
        response: {
          data: {
            id: uuidv4(),
            amount_in_cents: 1000,
            bill_id: null,
            billing_data: null,
            currency: 'COP',
            customer_data: null,
            customer_email: 'john.doe@example.com',
            finalized_at: null,
            payment_link_id: null,
            payment_method: {
              type: 'CARD',
              extra: {
                bin: '411111',
                brand: 'VISA',
                card_holder: 'John Doe',
                card_type: 'CREDIT',
                exp_month: '12',
                exp_year: '2025',
                is_three_ds: null,
                last_four: '1111',
                name: 'John Doe',
                unique_code: 'uniqueCode123',
              },
              installments: null,
            },
            payment_method_type: 'CARD',
            payment_source_id: null,
            redirect_url: null,
            reference: 'order123',
            shipping_address: null,
            status: 'PENDING',
            status_message: 'PENDING',
            taxes: [],
            tip_in_cents: null,
            created_at: '2021-08-31T00:00:00Z',
          },
        },
      };

      mockPaymentGatewayRepository.merchants.mockResolvedValue(mockAcceptanceTokenResponse);
      mockPaymentGatewayRepository.transactions.mockResolvedValue(mockTransactionResponse);

      const result = await paymentGatewayUseCase.createTransaction(payload);

      expect(mockPaymentGatewayRepository.merchants).toHaveBeenCalled();
      expect(mockPaymentGatewayRepository.transactions).toHaveBeenCalledWith({
        ...payload,
        acceptance_token: 'acceptanceToken123',
      });
      expect(result).toBe(mockTransactionResponse.response.data.id);
    });

    it('should throw an error if acceptance token response contains error', async () => {
      const payload: TCreateTransactions = {
        amount_in_cents: 1000,
        currency: 'USD',
        customer_email: 'customer@example.com',
        reference: 'order123',
        signature: 'signature123',
        payment_method: {
          type: 'CARD',
          token: 'token123',
        },
      };
      const mockErrorResponse: IResponseAG<IErrorResponseGA> = {
        type: 'merchants',
        response: {
          error: {
            type: 'error',
            code: 'some_error',
            messages: ['Some error'],
            reason: 'Some error',
          },
        },
      };

      mockPaymentGatewayRepository.merchants.mockResolvedValue(mockErrorResponse);

      await expect(paymentGatewayUseCase.createTransaction(payload)).rejects.toThrow('Whoops! Something went wrong.');
    });

    it('should throw an error if transaction response contains error', async () => {
      const payload: TCreateTransactions = {
        amount_in_cents: 1000,
        currency: 'USD',
        customer_email: 'customer@example.com',
        reference: 'order123',
        signature: 'signature123',
        payment_method: { type: 'CARD', token: 'token123' },
      };
      const mockErrorResponse: IResponseAG<IErrorResponseGA> = {
        type: 'merchants',
        response: {
          error: {
            type: 'error',
            code: 'some_error',
            messages: ['Some error'],
            reason: 'Some error',
          },
        },
      };

      mockPaymentGatewayRepository.merchants.mockResolvedValue(mockAcceptanceTokenResponse);
      mockPaymentGatewayRepository.transactions.mockResolvedValue(mockErrorResponse);

      await expect(paymentGatewayUseCase.createTransaction(payload)).rejects.toThrow('Whoops! Something went wrong.');
    });
  });
});
