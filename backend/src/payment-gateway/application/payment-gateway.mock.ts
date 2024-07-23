import { IMerchantsResponse, IOkResponseGA, IResponseAG } from '../domain/entities/payment-gateway.entity';

export const mockAcceptanceTokenResponse: IResponseAG<IOkResponseGA<IMerchantsResponse>> = {
  type: 'merchants',
  response: {
    data: {
      id: expect.any(String),
      accepted_currencies: ['USD'],
      accepted_payment_methods: ['CARD'],
      active: true,
      contact_name: 'John Doe',
      email: 'john.doe@example.com',
      fraud_groups: [],
      fraud_javascript_key: null,
      legal_id: '123456',
      legal_id_type: 'SSN',
      legal_name: 'John Doe',
      logo_url: 'https://example.com/logo.png',
      name: 'Example Merchant',
      payment_methods: [
        {
          name: 'CARD',
          payment_processors: [
            {
              name: 'Example Payment Processor',
            },
          ],
        },
      ],
      phone_number: '+1234567890',
      public_key: 'examplePublicKey',
      presigned_acceptance: {
        type: 'END_USER_POLICY',
        permalink: 'https://example.com/acceptance',
        acceptance_token: 'acceptanceToken123',
      },
    },
  },
};
