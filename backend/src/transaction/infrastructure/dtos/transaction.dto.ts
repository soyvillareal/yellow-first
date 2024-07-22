import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsNotEmpty, IsString, IsUUID, Matches, Max, Min, ValidateNested } from 'class-validator';
import moment from 'moment-timezone';

import {
  ICardTokenizationPayload,
  ICreatePaymentPayload,
  ICreatePaymentProducts,
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
