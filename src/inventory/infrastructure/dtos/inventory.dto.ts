import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsString, Matches, Max, Min } from 'class-validator';

import { ICardTokenizationPayload, ITransactionPayload } from 'src/inventory/domain/entities/inventory.entity';

export class CreateTransactionDto implements ITransactionPayload {
  @IsNotEmpty({
    message: 'The userId is required',
  })
  @IsNumber(
    {
      allowInfinity: false,
      allowNaN: false,
      maxDecimalPlaces: 0,
    },
    {
      message: 'The userId must be a number',
    },
  )
  @ApiProperty({
    description: 'Id del producto',
    example: 4583,
    required: true,
  })
  productId: string;

  @IsNotEmpty({
    message: 'The paymentSourceId is required',
  })
  @IsNumber(
    {
      allowInfinity: false,
      allowNaN: false,
      maxDecimalPlaces: 0,
    },
    {
      message: 'The paymentSourceId must be a number',
    },
  )
  @ApiProperty({
    description: 'Id de la fuente de pago',
    example: 8478,
    required: true,
  })
  paymentSourceId: number;

  @IsNotEmpty({
    message: 'The paymentSourceId is required',
  })
  @IsString({
    message: 'The signature must be a string',
  })
  @ApiProperty({
    description: 'Firma de la transacción',
    example: 'e2f06cb73145071cba0dd1b1007cd3a4f45632b29d4a70482f18e420d162b784',
    required: true,
  })
  signature: string;
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
    example: '12',
  })
  @IsInt()
  @Min(1)
  @Max(12)
  expMonth: string;

  @ApiProperty({
    description: 'Año de expiración de la tarjeta (formato YYYY)',
    example: '2025',
  })
  @IsInt()
  // @Min(2024)
  expYear: string;

  @ApiProperty({
    description: 'Nombre del titular de la tarjeta',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  cardHolder: string;
}
