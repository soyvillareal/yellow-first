import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsNotEmpty, IsString, IsUUID, Matches, Max, Min, ValidateNested } from 'class-validator';
import moment from 'moment-timezone';
import {
  IGatewayEvent,
  IGatewayEventData,
  IGatewayEventSignature,
  IGatewayEventTransaction,
  TCardTypes,
  TTransactionStatus,
} from 'src/payment-gateway/domain/entities/payment-gateway.entity';

import {
  ICardTokenizationPayload,
  ICreatePaymentPayload,
  ICreatePaymentProducts,
  IGetTransactionConfig,
  ITransactionByIdResponse,
  IUpdateTransactionResponse,
} from 'src/transaction/domain/entities/transaction.entity';

export class CreatePaymentProductsDto implements ICreatePaymentProducts {
  @IsNotEmpty({
    message: 'The id is required',
  })
  @IsUUID(4, {
    message: 'The id must be a valid UUID',
  })
  @ApiProperty({
    description: 'Id del producto',
    example: 'f7b3b3b3-1b3b-4b3b-8b3b-1b3b3b3b3b3b',
    required: true,
    type: 'uuid',
  })
  id: string;

  @IsInt({
    message: 'The quantity must be a number',
  })
  @Min(1, {
    message: 'The quantity must be greater than 0',
  })
  @ApiProperty({
    description: 'Cantidad del producto',
    example: 1,
    required: true,
  })
  quantity: number;
}

export class CreatePaymentDto implements ICreatePaymentPayload {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePaymentProductsDto)
  @ApiProperty({
    description: 'Id del producto',
    example: 'f7b3b3b3-1b3b-4b3b-8b3b-1b3b3b3b3b3b',
    required: true,
    type: 'uuid',
  })
  products: ICreatePaymentProducts[];

  @IsNotEmpty({
    message: 'The tokenId is required',
  })
  @IsUUID(4, {
    message: 'The tokenId must be a valid UUID',
  })
  @ApiProperty({
    description: 'Token de la transacción',
    example: 'f7b3b3b3-1b3b-4b3b-8b3b-1b3b3b3b3b3b',
    required: true,
    type: 'uuid',
  })
  tokenId: string;

  @IsNotEmpty({
    message: 'The installments is required',
  })
  @IsInt({
    message: 'The installments must be a number',
  })
  @IsEnum([3, 6, 12, 24, 36], {
    message: 'The installments must be 3, 6, 12, 24 or 36',
  })
  @ApiProperty({
    description: 'Número de cuotas de la transacción',
    example: 1,
    required: true,
  })
  installments: number;
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

export class GetTransactionConfigDto implements IGetTransactionConfig {
  @ApiProperty({
    nullable: false,
    description: 'Tasa fija de la transacción',
    type: 'number',
    example: 1000,
  })
  fixedRate: number;

  @ApiProperty({
    nullable: false,
    description: 'Porcentaje variable de la transacción',
    type: 'float',
    example: 0.05,
  })
  variablePercentage: number;

  @ApiProperty({
    nullable: false,
    description: 'Tarifa de envío',
    type: 'number',
    example: 5000,
  })
  shippingFee: number;
}

export class TransactionByIdResponseDto implements ITransactionByIdResponse {
  @ApiProperty({
    nullable: false,
    description: 'Id de la transacción',
    type: 'uuid',
    example: 'f7b3b3b3-1b3b-4b3b-8b3b-1b3b3b3b3b3b',
  })
  amount: number;

  @ApiProperty({
    nullable: false,
    description: 'Estado de la transacción',
    type: 'enum',
    example: 'APPROVED',
    enum: ['APPROVED', 'DECLINED', 'PENDING', 'VOIDED'],
  })
  status: TTransactionStatus;
}

export class GatewayEventTransaction implements IGatewayEventTransaction {
  @ApiProperty({
    nullable: false,
    description: 'Id de la transacción',
    type: 'string',
    example: 'f7b3b3b3-1b3b-4b3b-8b3b-1b3b3b3b3b3b',
  })
  id: string;

  @ApiProperty({
    nullable: false,
    description: 'Monto de la transacción en centavos',
    type: 'number',
    example: 100000,
  })
  amount_in_cents: number;

  @ApiProperty({
    nullable: false,
    description: 'Referencia de la transacción',
    type: 'string',
    example: 'f7b3b3b3-1b3b-4b3b-8b3b-1b3b3b3b3b3b',
  })
  reference: string;

  @ApiProperty({
    nullable: false,
    description: 'Email del cliente',
    type: 'string',
    example: 'john.doe@gmail.com',
  })
  customer_email: string;

  @ApiProperty({
    nullable: false,
    description: 'Moneda de la transacción',
    type: 'string',
    example: 'COP',
  })
  currency: string;

  @ApiProperty({
    nullable: false,
    description: 'Tipo de método de pago',
    type: 'enum',
    example: 'CARD',
    enum: ['CARD', 'NEQUI', 'BANCOLOMBIA', 'BANCOLOMBIA_TRANSFER', 'CLAVE', 'DAVIPLATA'],
  })
  payment_method_type: TCardTypes;

  @ApiProperty({
    nullable: false,
    description: 'URL de redirección de la transacción',
    type: 'string',
    example: 'https://example.com',
  })
  redirect_url: string;

  @ApiProperty({
    nullable: false,
    description: 'Estado de la transacción',
    type: 'enum',
    example: 'APPROVED',
    enum: ['APPROVED', 'DECLINED', 'PENDING', 'VOIDED'],
  })
  status: TTransactionStatus;

  @ApiProperty({
    nullable: false,
    description: 'Dirección de envío de la transacción',
    type: 'string',
    example: 'Calle 123 # 45-67',
  })
  shipping_address: string;

  @ApiProperty({
    nullable: false,
    description: 'Enlace de pago de la transacción',
    type: 'null',
    example: null,
  })
  payment_link_id: number;

  @ApiProperty({
    nullable: false,
    description: 'Fuente de pago de la transacción',
    type: 'number',
    example: 4567,
  })
  payment_source_id: number | null;
}

export class GatewayEventDataDto implements IGatewayEventData {
  @ApiProperty({
    nullable: false,
    description: 'Datos de la transacción',
    type: GatewayEventTransaction,
    example: {
      id: 'f7b3b3b3-1b3b-4b3b-8b3b-1b3b3b3b3b3b',
      status: 'APPROVED',
      amount_in_cents: 100,
    },
  })
  transaction: IGatewayEventTransaction;
}

export class GatewayEventSignatureDto implements IGatewayEventSignature {
  @ApiProperty({
    nullable: false,
    description: 'Propiedades del evento',
    type: 'array',
    example: ['transaction.id', 'transaction.status', 'transaction.amount_in_cents'],
  })
  properties: ['transaction.id', 'transaction.status', 'transaction.amount_in_cents'];

  @ApiProperty({
    nullable: false,
    description: 'Checksum del evento',
    type: 'string',
    example: 'f7b3b3b3-1b3b-4b3b-8b3b-1b3b3b3b3b3b',
  })
  checksum: string;
}

export class GatewayEventDto implements IGatewayEvent {
  @ApiProperty({
    nullable: false,
    description: 'Evento de la transacción',
    type: 'enum',
    example: 'transaction.updated',
    enum: ['transaction.updated', 'nequi_token.updated'],
  })
  event: 'transaction.updated' | 'nequi_token.updated';

  @ApiProperty({
    nullable: false,
    description: 'Datos del evento',
    type: GatewayEventDataDto,
    example: {
      transaction: {
        id: 'f7b3b3b3-1b3b-4b3b-8b3b-1b3b3b3b3b3b',
        status: 'APPROVED',
        amount_in_cents: 100000,
      },
    },
  })
  data: IGatewayEventData;

  @ApiProperty({
    nullable: false,
    description: 'Ambiente del evento',
    type: 'enum',
    example: 'test',
    enum: ['test', 'prod'],
  })
  environment: 'test' | 'prod';

  @ApiProperty({
    nullable: false,
    description: 'Firma del evento',
    type: GatewayEventSignatureDto,
    example: {
      properties: ['transaction.id', 'transaction.status', 'transaction.amount_in_cents'],
      checksum: 'f7b3b3b3-1b3b-4b3b-8b3b-1b3b3b3b3b3b',
    },
  })
  signature: IGatewayEventSignature;

  @ApiProperty({
    nullable: false,
    description: 'Timestamp del evento',
    type: 'number',
    example: 1633824610,
  })
  timestamp: number;

  @ApiProperty({
    nullable: false,
    description: 'Fecha en la que se envió el evento',
    type: 'string',
    example: '2021-10-10T10:10:10.000Z',
  })
  sent_at: string;
}

export class UpdateTransactionDto implements IUpdateTransactionResponse {
  @ApiProperty({
    nullable: false,
    description: 'Transacción actualizada',
    type: 'boolean',
    example: true,
  })
  recieve: boolean;
}
