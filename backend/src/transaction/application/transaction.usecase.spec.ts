import { v4 as uuidv4 } from 'uuid';
import { CommonUseCase } from 'src/common/application/common.usecase';
import { TransactionUseCase } from './transaction.usecase';
import { sessionRepository } from 'src/session/domain/repository/session.repository';
import { gatewayTokenRepository } from 'src/payment-gateway/domain/repository/gateway-token.repository';
import { websocketRepository } from 'src/transaction/domain/repository/transaction.repository';
import { TGetProductById } from 'src/product/domain/entities/product.entity';
import { PaymentGatewayUseCase } from '../../payment-gateway/application/payment-gateway.usecase';
import { productRepository } from '../../product/domain/repository/product.repository';
import { transactionRepository } from '../domain/repository/transaction.repository';
import { paymentGatewayRepository } from '../../payment-gateway/domain/repository/payment-gateway.repository';
import {
  ETransactionStatus,
  ICardTokenizationPayload,
  ICreatePaymentPayload,
  IDeliveryEntity,
  IGetTransactionByGatewayId,
} from '../domain/entities/transaction.entity';
import { configRepository } from 'src/common/domain/repository/common.repository';
import {
  IGatewayEvent,
  IGatewayEventData,
  IGenerateCardTokenResponse,
} from 'src/payment-gateway/domain/entities/payment-gateway.entity';
import { IGatewayTokenEntity } from 'src/payment-gateway/domain/entities/gateway-token.entity';
import moment from 'moment-timezone';
import { TGetInfoUser } from 'src/session/domain/entities/session.entity';

const cardTypesRgx = /^(CARD|NEQUI|BANCOLOMBIA|BANCOLOMBIA_TRANSFER|CLAVE|DAVIPLATA)$/;
const transactionStatusRgx = /^(APPROVED|PENDING|DECLINED|VOIDED)$/;

describe('TransactionUseCase', () => {
  let transactionUseCase: TransactionUseCase;
  const mockConfigRepository: jest.Mocked<configRepository> = {
    get: jest.fn((key: string) => {
      const env = {
        'config.events_key': process.env.EVENTS_KEY,
      };
      return env[key];
    }),
  };
  const mockTransactionRepository: jest.Mocked<transactionRepository> = {
    createDelivery: jest.fn(),
    getTransactionById: jest.fn(),
    getTransactionProductByGatewayId: jest.fn(),
    tokenExistsInTransaction: jest.fn(),
    updateTransactionStatus: jest.fn(),
    getTransactionConfig: jest.fn(),
    createTransaction: jest.fn(),
    createTransactionProduct: jest.fn(),
    deleteTransactionById: jest.fn(),
  };
  const mockProductRepository: jest.Mocked<productRepository> = {
    getProductById: jest.fn(),
    updateStockInProduct: jest.fn(),
    getProducts: jest.fn(),
  };
  const mockSessionRepository: jest.Mocked<sessionRepository> = {
    getInfoById: jest.fn(),
    createSession: jest.fn(),
    getInfoByUsername: jest.fn(),
    userExistsById: jest.fn(),
    userExistsByUsername: jest.fn(),
  };
  const mockPaymentGatewayRepository: jest.Mocked<paymentGatewayRepository> = {
    merchants: jest.fn(),
    transactions: jest.fn(),
    getTransactionById: jest.fn(),
    paymentResource: jest.fn(),
    tokensCards: jest.fn(),
  };
  const mockGatewayTokenRepository: jest.Mocked<gatewayTokenRepository> = {
    createToken: jest.fn(),
    getTokenById: jest.fn(),
    tokenExists: jest.fn(),
  };
  const mockWebsocketRepository: jest.Mocked<websocketRepository> = {
    notifyTransactionUpdate: jest.fn(),
    handleConnection: jest.fn(),
  };
  let commonUseCase: CommonUseCase;
  let paymentGatewayUseCase: PaymentGatewayUseCase;

  beforeEach(() => {
    commonUseCase = new CommonUseCase(mockConfigRepository);
    paymentGatewayUseCase = new PaymentGatewayUseCase(mockPaymentGatewayRepository);
    transactionUseCase = new TransactionUseCase(
      mockTransactionRepository,
      mockProductRepository,
      mockSessionRepository,
      mockPaymentGatewayRepository,
      mockGatewayTokenRepository,
      mockWebsocketRepository,
      mockConfigRepository,
    );
    jest.clearAllMocks();
  });

  it('should create a payment successfully', async () => {
    const userId = uuidv4();
    const createPaymentPayload: ICreatePaymentPayload = {
      products: [
        {
          id: expect.any(String),
          quantity: expect.any(Number),
        },
      ],
      tokenId: expect.any(String),
      installments: expect.any(Number),
    };

    mockSessionRepository.getInfoById.mockResolvedValue({
      email: expect.any(String),
      firstAddress: expect.any(String),
      secondAddress: expect.any(String),
      state: expect.any(String),
      city: expect.any(String),
      phoneCode: expect.any(String),
      phoneNumber: expect.any(Number),
      pincode: expect.any(Number),
    });
    mockGatewayTokenRepository.getTokenById.mockResolvedValue({
      id: expect.any(String),
      token: expect.any(String),
      brand: expect.any(String),
      cardHolder: expect.any(String),
      expMonth: expect.any(Number),
      expYear: expect.any(Number),
      lastFour: expect.any(Number),
      expiredAt: expect.any(Date),
    });
    mockTransactionRepository.getTransactionConfig.mockResolvedValue({
      fixedRate: expect.any(Number),
      variablePercentage: expect.any(Float32Array),
      shippingFee: expect.any(Float32Array),
    });
    mockProductRepository.getProductById.mockResolvedValue({
      price: expect.any(Number),
      stock: expect.any(Number),
    } as TGetProductById);
    mockPaymentGatewayRepository.merchants.mockResolvedValue({
      type: expect.any(String),
      response: {
        data: {
          id: expect.any(String),
          name: expect.any(String),
          email: expect.any(String),
          contact_name: expect.any(String),
          phone_number: expect.any(String),
          active: expect.any(Boolean),
          logo_url: expect.any(String),
          legal_name: expect.any(String),
          legal_id_type: expect.any(String),
          legal_id: expect.any(String),
          public_key: expect.any(String),
          accepted_currencies: expect.arrayContaining([expect.any(String)]),
          fraud_javascript_key: expect.any(String),
          fraud_groups: expect.any(Array),
          accepted_payment_methods: expect.arrayContaining([
            {
              name: expect.any(String),
              payment_processors: expect.arrayContaining([
                {
                  name: expect.any(String),
                },
              ]),
            },
          ]),
          payment_methods: expect.arrayContaining([]),
          presigned_acceptance: expect.objectContaining({
            acceptance_token: expect.any(String),
            permalink: expect.any(String),
            type: expect.any(String),
          }),
        },
      },
    });

    mockPaymentGatewayRepository.transactions.mockResolvedValue({
      type: expect.any(String),
      response: {
        data: {
          id: expect.any(String),
          created_at: expect.any(String),
          finalized_at: expect.any(String),
          amount_in_cents: expect.any(Number),
          reference: expect.any(String),
          customer_email: expect.any(String),
          currency: expect.any(String),
          payment_method_type: expect.stringMatching(cardTypesRgx),
          payment_method: expect.objectContaining({
            type: expect.stringMatching(cardTypesRgx),
            extra: {
              bin: expect.any(String),
              name: expect.any(String),
              brand: expect.any(String),
              exp_year: expect.any(String),
              card_type: expect.stringMatching(/^(CREDIT|DEBIT)$/),
              exp_month: expect.any(String),
              last_four: expect.any(String),
              card_holder: expect.any(String),
              is_three_ds: expect.any(Boolean),
              unique_code: expect.any(String),
            },
            installments: expect.any(Number),
          }),
          status: expect.stringMatching(transactionStatusRgx),
          status_message: expect.any(String),
          billing_data: expect.any(Object),
          shipping_address: expect.any(String),
          redirect_url: expect.any(String),
          payment_source_id: expect.any(Number),
          payment_link_id: expect.any(Number),
          customer_data: expect.objectContaining({
            phone_number: expect.any(String),
            full_name: expect.any(String),
          }),
          bill_id: expect.any(Number),
          taxes: expect.arrayContaining([
            {
              type: expect.stringMatching(/^(VAT|IVA|CONSUMPTION)$/),
              amount_in_cents: expect.any(Number),
            },
          ]),
          tip_in_cents: expect.any(String),
        },
      },
    });
    const transactionIdResponse = uuidv4();
    paymentGatewayUseCase.createTransaction = jest.fn().mockResolvedValue(transactionIdResponse);
    mockTransactionRepository.createTransaction.mockResolvedValue({
      id: transactionIdResponse,
      userId,
      status: expect.any(ETransactionStatus),
      reference: expect.any(String),
      gatewayId: expect.any(String),
      gatewayTokenId: expect.any(String),
      firstAddress: expect.any(String),
      secondAddress: expect.any(String),
      phoneCode: expect.any(String),
      phoneNumber: expect.any(String),
      city: expect.any(String),
      state: expect.any(String),
      totalAmount: 250000,
      createdAt: expect.any(Date),
      pincode: expect.any(String),
    });

    const result = await transactionUseCase.createPayment(userId, createPaymentPayload);

    expect(result).toBe(transactionIdResponse);
    expect(mockSessionRepository.getInfoById).toHaveBeenCalledWith(userId);
    expect(mockGatewayTokenRepository.getTokenById).toHaveBeenCalledWith(createPaymentPayload.tokenId);
    expect(mockTransactionRepository.getTransactionConfig).toHaveBeenCalled();
    expect(mockProductRepository.getProductById).toHaveBeenCalledWith(expect.any(String));
    expect(mockTransactionRepository.createTransaction).toHaveBeenCalled();
  });

  it('should tokenize a card successfully', async () => {
    const userId = uuidv4();
    const cardPayload: ICardTokenizationPayload = {
      number: '4111111111111111',
      cvc: '123',
      expMonth: 12,
      expYear: 2025,
      cardHolder: 'John Doe',
    };

    const cardTokenResponse: IGenerateCardTokenResponse = {
      cardToken: expect.any(String),
      brand: 'Visa',
      lastFour: '1111',
      expMonth: '12',
      expYear: '2025',
      cardHolder: 'John Doe',
      expiredAt: '2025-12-31T23:59:59.999Z',
      validityEndsAt: '2025-12-31T23:59:59.999Z',
    };
    mockPaymentGatewayRepository.tokensCards.mockResolvedValue({
      type: expect.any(String),
      response: {
        status: 'CREATED',
        data: {
          id: expect.any(String),
          bin: expect.any(String),
          brand: cardTokenResponse.brand,
          card_holder: cardTokenResponse.cardHolder,
          exp_month: cardTokenResponse.expMonth,
          exp_year: cardTokenResponse.expYear,
          expires_at: cardTokenResponse.expiredAt,
          created_with_cvc: expect.any(Boolean),
          last_four: cardTokenResponse.lastFour,
          name: expect.any(String),
          validity_ends_at: cardTokenResponse.validityEndsAt,
          created_at: expect.any(String),
        },
      },
    });

    jest.spyOn(paymentGatewayUseCase, 'generateCardToken').mockResolvedValue(cardTokenResponse);

    const createdTokenResponse: IGatewayTokenEntity = {
      id: uuidv4(),
      userId,
      token: cardTokenResponse.cardToken,
      brand: cardTokenResponse.brand,
      lastFour: cardTokenResponse.lastFour,
      expMonth: cardTokenResponse.expMonth,
      expYear: cardTokenResponse.expYear,
      cardHolder: cardTokenResponse.cardHolder,
      expiredAt: moment(cardTokenResponse.expiredAt).toDate(),
      validityEndsAt: moment(cardTokenResponse.validityEndsAt).toDate(),
      createdAt: moment().toDate(),
    };

    // Simula la respuesta del método createToken en gatewayTokenRepository
    mockGatewayTokenRepository.createToken.mockResolvedValue(createdTokenResponse);

    const result = await transactionUseCase.cardTokenization(userId, cardPayload);

    expect(result).toEqual({
      tokenId: createdTokenResponse.id,
      brand: cardTokenResponse.brand,
      lastFour: cardTokenResponse.lastFour,
      expMonth: cardTokenResponse.expMonth,
      expYear: cardTokenResponse.expYear,
      cardHolder: cardTokenResponse.cardHolder,
    });

    expect(mockGatewayTokenRepository.createToken).toHaveBeenCalledWith({
      userId,
      token: expect.any(String),
      brand: cardTokenResponse.brand,
      lastFour: cardTokenResponse.lastFour,
      expMonth: cardTokenResponse.expMonth,
      expYear: cardTokenResponse.expYear,
      cardHolder: cardTokenResponse.cardHolder,
      expiredAt: moment(cardTokenResponse.expiredAt).toDate(),
      validityEndsAt: moment(cardTokenResponse.validityEndsAt).toDate(),
    });
  });

  it('should handle a valid webhook transaction update', async () => {
    mockTransactionRepository.updateTransactionStatus.mockResolvedValue(true);

    const productData: IGetTransactionByGatewayId = {
      userId: uuidv4(),
      transactionId: uuidv4(),
      productId: uuidv4(),
      quantity: 1,
      amount: 10000,
    };
    mockTransactionRepository.getTransactionProductByGatewayId.mockResolvedValue(productData);

    const userInfo: TGetInfoUser = {
      city: 'Cartagena',
      state: 'Bolívar',
      email: 'john.doe@gmail.com',
      firstAddress: 'Calle 123',
      secondAddress: 'Apt 4',
      phoneCode: '+57',
      phoneNumber: '3001234567',
      pincode: '123456',
    };

    mockSessionRepository.getInfoById.mockResolvedValue(userInfo);
    const deliveryData: IDeliveryEntity = {
      id: uuidv4(),
      userId: productData.userId,
      transactionId: productData.transactionId,
      city: userInfo.city,
      state: userInfo.state,
      firstAddress: userInfo.firstAddress,
      secondAddress: userInfo.secondAddress,
      phoneNumber: userInfo.phoneNumber,
      phoneCode: userInfo.phoneCode,
      pincode: userInfo.pincode,
      createdAt: moment().toDate(),
    };
    mockTransactionRepository.createDelivery.mockResolvedValue(deliveryData);
    commonUseCase.verifySignature = jest.fn().mockReturnValue(true);

    const validChecksum = '35baa4f75e23c51c7391debd2a8fb157ac2b4ea188e906de60f8cc4002c773c0';
    const eventData: IGatewayEventData = {
      transaction: {
        id: '15113-1721612144-60212',
        amount_in_cents: productData.amount,
        currency: 'COP',
        customer_email: userInfo.email,
        payment_link_id: 123,
        payment_source_id: 456,
        status: 'APPROVED',
        payment_method_type: 'CARD',
        redirect_url: 'https://example.com',
        reference: '123456',
        shipping_address: 'Calle 123, Cartagena, Bolívar',
      },
    };
    const result = await transactionUseCase.webHookTransaction(validChecksum, {
      environment: 'test',
      event: 'transaction.updated',
      sent_at: '2023-07-20T12:34:56Z',
      signature: {
        checksum: validChecksum,
        properties: ['transaction.id', 'transaction.status', 'transaction.amount_in_cents'],
      },
      timestamp: 1234567890,
      data: {
        ...eventData,
      },
    });

    expect(result).toEqual({ recieve: true });
    expect(mockTransactionRepository.updateTransactionStatus).toHaveBeenCalledWith(
      eventData.transaction.id,
      ETransactionStatus[eventData.transaction.status],
    );
    expect(mockWebsocketRepository.notifyTransactionUpdate).toHaveBeenCalledWith(expect.any(String), {
      transactionId: expect.any(String),
      status: eventData.transaction.status,
    });
  });

  it('should handle a webhook transaction update with failed stock update', async () => {
    mockTransactionRepository.updateTransactionStatus.mockResolvedValue(true);

    const transactionProductData: IGetTransactionByGatewayId = {
      userId: uuidv4(),
      transactionId: uuidv4(),
      productId: uuidv4(),
      quantity: 1,
      amount: 10000,
    };

    mockTransactionRepository.getTransactionProductByGatewayId.mockResolvedValue(transactionProductData);
    mockProductRepository.getProductById.mockResolvedValue({
      price: transactionProductData.amount.toString(),
      stock: 5,
    });
    mockProductRepository.updateStockInProduct.mockResolvedValue(false);
    commonUseCase.verifySignature = jest.fn().mockReturnValue(true);

    const validChecksum = '354e66889c86a9a7d994bd5b7960f65b72503d442e8c8992545e02b227c76a3f';
    const eventData: IGatewayEventData = {
      transaction: {
        id: '15113-1721612144-60212',
        status: 'DECLINED',
        amount_in_cents: 10000,
        currency: 'COP',
        customer_email: 'john.doe@gmail.com',
        payment_link_id: 123,
        payment_method_type: 'CARD',
        payment_source_id: 456,
        redirect_url: 'https://example.com',
        reference: '123456',
        shipping_address: 'Calle 123, Cartagena, Bolívar',
      },
    };

    await expect(
      transactionUseCase.webHookTransaction(validChecksum, {
        event: 'transaction.updated',
        data: {
          ...eventData,
        },
        environment: 'test',
        sent_at: '2023-07-20T12:34:56Z',
        signature: {
          checksum: validChecksum,
          properties: ['transaction.id', 'transaction.status', 'transaction.amount_in_cents'],
        },
        timestamp: 1234567890,
      }),
    ).rejects.toThrow('Whoops! Something went wrong.');

    expect(mockTransactionRepository.updateTransactionStatus).toHaveBeenCalledWith(
      eventData.transaction.id,
      ETransactionStatus[eventData.transaction.status],
    );
    expect(mockProductRepository.updateStockInProduct).toHaveBeenCalled();
  });

  it('should throw an error if the webhook signature is invalid', async () => {
    commonUseCase.verifySignature = jest.fn().mockReturnValue(false);

    const validCheckSum = '35baa4f75e23c51c7391debd2a8fb157ac2b4ea188e906de60f8cc4002cc73c0';
    await expect(
      transactionUseCase.webHookTransaction(validCheckSum, {
        event: 'transaction.updated',
        sent_at: '2023-07-20T12:34:56Z',
        data: {
          transaction: {
            id: '15113-1721612144-60212',
            amount_in_cents: 10000,
            currency: 'COP',
            customer_email: 'john.doe@gmail.com',
            payment_link_id: 123,
            payment_method_type: 'CARD',
            payment_source_id: 456,
            redirect_url: 'https://example.com',
            reference: '123456',
            shipping_address: 'Calle 123, Cartagena, Bolívar',
            status: 'APPROVED',
          },
        },
        environment: 'test',
        signature: {
          checksum: validCheckSum,
          properties: ['transaction.id', 'transaction.status', 'transaction.amount_in_cents'],
        },
        timestamp: 1234567890,
      }),
    ).rejects.toThrow('Invalid webhook signature!');

    expect(mockTransactionRepository.updateTransactionStatus).not.toHaveBeenCalled();
  });

  it('should throw an error if the webhook event is invalid', async () => {
    commonUseCase.verifySignature = jest.fn().mockReturnValue(true);

    const validCheckSum = '1bscr1b3d-ch3cksum';
    await expect(
      transactionUseCase.webHookTransaction(validCheckSum, {
        event: 'invalid.event' as IGatewayEvent['event'],
        environment: 'test',
        sent_at: '2023-07-20T12:34:56Z',
        signature: {
          checksum: validCheckSum,
          properties: ['transaction.id', 'transaction.status', 'transaction.amount_in_cents'],
        },
        timestamp: 1234567890,
        data: {
          transaction: {
            id: '15113-1721612144-60212',
            amount_in_cents: 10000,
            currency: 'COP',
            customer_email: 'john.doe@gmail.com',
            payment_link_id: 123,
            payment_method_type: 'CARD',
            payment_source_id: 456,
            redirect_url: 'https://example.com',
            reference: '123456',
            shipping_address: 'Calle 123, Cartagena, Bolívar',
            status: 'APPROVED',
          },
        },
      }),
    ).rejects.toThrow('Invalid webhook event!');

    expect(mockTransactionRepository.updateTransactionStatus).not.toHaveBeenCalled();
  });

  it('should return transaction details when found', async () => {
    const userId = uuidv4();
    const transactionId = uuidv4();
    const transactionData = {
      totalAmount: 10000,
      status: ETransactionStatus.APPROVED,
    };

    mockTransactionRepository.getTransactionById.mockResolvedValue(transactionData);

    const result = await transactionUseCase.getTransactionById(userId, transactionId);

    expect(mockTransactionRepository.getTransactionById).toHaveBeenCalledWith(userId, transactionId);
    expect(result).toEqual({
      amount: transactionData.totalAmount,
      status: transactionData.status,
    });
  });

  it('should throw an error if transaction is null', async () => {
    const userId = uuidv4();
    const transactionId = uuidv4();

    mockTransactionRepository.getTransactionById.mockResolvedValue(null);

    await expect(transactionUseCase.getTransactionById(userId, transactionId)).rejects.toThrow('Whoops! Something went wrong.');
    expect(mockTransactionRepository.getTransactionById).toHaveBeenCalledWith(userId, transactionId);
  });

  it('should throw an error if transaction is undefined', async () => {
    const userId = uuidv4();
    const transactionId = uuidv4();

    mockTransactionRepository.getTransactionById.mockResolvedValue(undefined);

    await expect(transactionUseCase.getTransactionById(userId, transactionId)).rejects.toThrow('Transaction not found!');
    expect(mockTransactionRepository.getTransactionById).toHaveBeenCalledWith(userId, transactionId);
  });
});
