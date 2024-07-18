import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, IsUUID, Matches, Max, Min } from 'class-validator';
import moment from 'moment-timezone';
import {
  IGatewayEvent,
  IGatewayEventData,
  IGatewayEventSignature,
} from 'src/payment-gateway/domain/entities/payment-gateway.entity';

import { ICardTokenizationPayload, ICreatePaymentPayload } from 'src/transaction/domain/entities/transaction.entity';

export class CreatePaymentDto implements ICreatePaymentPayload {
  @IsNotEmpty({
    message: 'The productId is required',
  })
  @IsUUID(4, {
    message: 'The productId must be a valid UUID',
  })
  @ApiProperty({
    description: 'Id del producto',
    example: 'f7b3b3b3-1b3b-4b3b-8b3b-1b3b3b3b3b3b',
    required: true,
    type: 'uuid',
  })
  productId: string;

  @IsNotEmpty({
    message: 'The installments is required',
  })
  @IsInt({
    message: 'The installments must be a number',
  })
  @ApiProperty({
    description: 'Número de cuotas de la transacción',
    example: 1,
    required: true,
  })
  installments: number;
}

export class GatewayEventDto implements IGatewayEvent {
  event: 'transaction.updated' | 'nequi_token.updated';
  data: IGatewayEventData;
  environment: 'test' | 'prod';
  signature: IGatewayEventSignature;
  timestamp: number;
  sent_at: string;
}

export class CardTokenizeDto implements ICardTokenizationPayload {
  @ApiProperty({
    description: 'Número de la tarjeta de crédito',
    example: '4111111111111111',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{16}$/, { message: 'El número de la tarjeta debe tener 16 dígitos' })
  number: string;

  @ApiProperty({
    description: 'Código de seguridad de la tarjeta (CVC)',
    example: '123',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{3,4}$/, { message: 'El CVC debe tener 3 o 4 dígitos' })
  cvc: string;

  @ApiProperty({
    description: 'Mes de expiración de la tarjeta (formato MM)',
    example: 11,
  })
  @IsInt()
  @Min(1)
  @Max(12)
  expMonth: number;

  @ApiProperty({
    description: 'Año de expiración de la tarjeta (formato YYYY)',
    example: 25,
  })
  @IsInt()
  @Min(moment().year())
  expYear: number;

  @ApiProperty({
    description: 'Nombre del titular de la tarjeta',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  cardHolder: string;
}
