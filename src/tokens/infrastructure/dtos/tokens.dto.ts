import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

import { ICredentialsToken, IGenerateTokenResponse } from 'src/tokens/domain/entities/tokens.entity';

export class generateTokenDto implements ICredentialsToken {
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

export class generateTokenResponse implements IGenerateTokenResponse {
  @ApiProperty({
    description: 'Token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaG4ifQ.1L6VZVp7Z6N0Z8y2mJ1',
    required: true,
    maxLength: 255,
  })
  token: string;
}
