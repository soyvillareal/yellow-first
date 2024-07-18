import { lastValueFrom } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

import { paymentGatewayRepository } from 'src/payment-gateway/domain/repository/payment-gateway.repository';
import {
  IMerchantsResponse,
  IPaymentResourcePayload,
  IPaymentResourceResponse,
  IResponseAG,
  ITokensCardsPayload,
  ITokensCardsResponse,
  ITransactionsPayload,
  ITransactionsResponse,
  TResponseOkOrError,
} from 'src/payment-gateway/domain/entities/payment-gateway.entity';

@Injectable()
export class PaymentGatewayService implements paymentGatewayRepository {
  private readonly hostname: string = '';
  private readonly publicKey: string = '';
  private readonly privateKey: string = '';
  private readonly headers: Request['headers'] = {
    'Content-Type': 'application/json',
  };
  constructor(
    private http: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.hostname = this.configService.get<string>('config.api_gateway', {
      infer: true,
    });
    this.publicKey = this.configService.get<string>('config.public_key', {
      infer: true,
    });
    this.privateKey = this.configService.get<string>('config.private_key', {
      infer: true,
    });
  }

  async merchants(): Promise<IResponseAG<TResponseOkOrError<IMerchantsResponse>>> {
    try {
      const response = this.http.post(`${this.hostname}/merchants/${this.publicKey}`);

      const lastValue = await lastValueFrom(response);

      return {
        type: 'merchants',
        response: lastValue.data,
      };
    } catch (error) {
      return {
        type: 'merchants',
        response: error.response.data,
      };
    }
  }

  async tokensCards(payload: ITokensCardsPayload): Promise<IResponseAG<TResponseOkOrError<ITokensCardsResponse>>> {
    const { number, exp_year, card_holder, cvc, exp_month } = payload;

    // const merchantsResponse = await this.merchants();

    // if ('error' in merchantsResponse.response) {
    //   return {
    //     type: merchantsResponse.type,
    //     response: merchantsResponse.response,
    //   };
    // }

    const bodyTokensCards = {
      number,
      exp_year,
      card_holder,
      cvc,
      exp_month,
    };

    const request = {
      headers: this.headers,
      body: bodyTokensCards,
    };

    try {
      const response = this.http.post(`${this.hostname}/tokens/cards`, bodyTokensCards, {
        headers: {
          ...this.headers,
          Authorization: `Bearer ${this.publicKey}`,
        },
      });

      const lastValue = await lastValueFrom(response);

      const responseData = lastValue.data;

      return {
        request,
        type: 'tokensCards',
        response: responseData,
      };
    } catch (error) {
      return {
        request,
        type: 'tokensCards',
        response: error.response.data,
      };
    }
  }

  async paymentResource(payload: IPaymentResourcePayload): Promise<IResponseAG<TResponseOkOrError<IPaymentResourceResponse>>> {
    const { type, token, acceptance_token, customer_email } = payload;

    const bodyTokensCards = { type, token, acceptance_token, customer_email };

    const request = {
      headers: this.headers,
      body: bodyTokensCards,
    };

    try {
      const response = this.http.post(`${this.hostname}/payment_sources`, bodyTokensCards, {
        headers: {
          ...this.headers,
          Authorization: `Bearer ${this.privateKey}`,
        },
      });

      const lastValue = await lastValueFrom(response);

      const responseData = lastValue.data;

      return {
        request,
        type: 'paymentResources',
        response: responseData,
      };
    } catch (error) {
      return {
        request,
        type: 'paymentResources',
        response: error.response.data,
      };
    }
  }

  async transactions(payload: ITransactionsPayload): Promise<IResponseAG<TResponseOkOrError<ITransactionsResponse>>> {
    const { reference, currency, amount_in_cents, customer_email, payment_source_id, signature, payment_method } = payload;

    const bodyTransactions = {
      reference,
      currency,
      amount_in_cents,
      customer_email,
      payment_source_id,
      signature,
      payment_method,
    };

    const request = {
      headers: this.headers,
      body: bodyTransactions,
    };

    try {
      const response = this.http.post(`${this.hostname}/payment_sources`, bodyTransactions, {
        headers: {
          ...this.headers,
          Authorization: `Bearer ${this.privateKey}`,
        },
      });

      const lastValue = await lastValueFrom(response);

      const responseData = lastValue.data;

      return {
        request,
        type: 'transactions',
        response: responseData,
      };
    } catch (error) {
      return {
        request,
        type: 'transactions',
        response: error.response.data,
      };
    }
  }
}
