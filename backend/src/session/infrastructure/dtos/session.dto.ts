import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

import {
  ESessionType,
  IAnonymousSessionPayload,
  ICredentialsToken,
  TAuthSessionData,
  TAuthSessionResponse,
} from 'src/session/domain/entities/session.entity';
import { ERoles } from 'src/session/domain/entities/session.entity';

export class authSessionDto implements ICredentialsToken {
  @IsNotEmpty({
    message: 'El nombre de usuario es requerido',
  })
  @MaxLength(60, {
    message: 'El nombre de usuario no puede tener mas de 60 caracteres',
  })
  @ApiProperty({
    description: 'Nombre de usuario',
    example: 'John',
    required: true,
    maxLength: 60,
  })
  username: string;

  @IsNotEmpty({
    message: 'La contraseña es requerida',
  })
  @MaxLength(255, {
    message: 'La contraseña no puede tener mas de 255 caracteres',
  })
  @ApiProperty({
    description: 'Contraseña',
    example: '123456',
    required: true,
    maxLength: 255,
  })
  password: string;
}

export class AnonymousSessionDto implements IAnonymousSessionPayload {
  @IsNotEmpty({
    message: 'La semilla es requerida',
  })
  @MaxLength(36, {
    message: 'La semilla no puede tener mas de 255 caracteres',
  })
  @ApiProperty({
    description: 'Semilla',
    example: 'empty',
    required: true,
    maxLength: 36,
  })
  seed: string;
}

export class authSessionDataDto implements TAuthSessionData {
  @ApiProperty({
    description: 'UUID del usuario',
    example: '1bd1b3b0-1b3b-4b3b-8b3b-1b3b3b3b3b3b',
    required: true,
  })
  id: string;

  @ApiProperty({
    description: 'Nombre de usuario',
    example: 'John',
    required: true,
    maxLength: 60,
  })
  username: string;

  @ApiProperty({
    description: 'Correo electrónico',
    example: 'john.doe@example.com',
    required: true,
  })
  email: string;

  @ApiProperty({
    description: 'Rol del usuario',
    example: ERoles.ADMIN,
    required: true,
  })
  role: ERoles;

  @ApiProperty({
    description: 'Dirección 1',
    example: 'Calle 123',
    maxLength: 255,
    required: true,
  })
  firstAddress: string;

  @ApiProperty({
    description: 'Dirección 2',
    example: 'Calle 123',
    maxLength: 255,
    required: true,
  })
  secondAddress: string;

  @ApiProperty({
    description: 'Estado',
    example: 'Bolivar',
    maxLength: 80,
    required: true,
  })
  state: string;

  @ApiProperty({
    description: 'Ciudad',
    example: 'Cartagena',
    maxLength: 80,
    required: true,
  })
  city: string;

  @ApiProperty({
    description: 'Código postal',
    example: '130001',
    maxLength: 10,
    required: true,
  })
  pincode: string;

  @ApiProperty({
    description: 'Código de país',
    example: '+1',
    maxLength: 5,
    required: true,
  })
  phoneCode: string;

  @ApiProperty({
    description: 'Número de teléfono',
    example: '1234567890',
    maxLength: 15,
    required: true,
  })
  phoneNumber: string;
}

export class authSessionResponseDto implements TAuthSessionResponse {
  @ApiProperty({
    description: 'UUID de la sesión',
    example: '1bd1b3b0-1b3b-4b3b-8b3b-1b3b3b3b3b3b',
    required: true,
  })
  id: string;

  @ApiProperty({
    description: 'Datos de la sesión',
    required: true,
    type: authSessionDataDto,
  })
  data?: authSessionDataDto;

  @ApiProperty({
    description: 'Tipo de sesión',
    example: ESessionType.ANONYMOUS,
    enum: ESessionType,
    type: 'string',
    required: true,
  })
  type: ESessionType;

  @ApiProperty({
    description: 'Semilla',
    example: '123456',
    required: true,
    maxLength: 255,
  })
  seed?: string;

  @ApiProperty({
    description: 'Fecha de expiración',
    example: '2021-09-30T22:00:00.000Z',
    required: true,
  })
  expiredAt?: Date;

  @ApiProperty({
    description: 'JWT token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaG4ifQ.1L6VZVp7Z6N0Z8y2mJ1',
    required: true,
    maxLength: 255,
  })
  jwt: string;
}
