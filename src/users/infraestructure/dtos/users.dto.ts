import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

import { ICreateUserDTO, IUpdateUserDTO } from 'src/users/domain/entities/users.entity';

export class createUserDto implements ICreateUserDTO {
  @IsNotEmpty({
    message: 'The name is required',
  })
  @MaxLength(60, {
    message: 'The name must be less than 60 characters',
  })
  @ApiProperty({
    description: 'Name of the user',
    example: 'John',
    required: true,
    maxLength: 60,
  })
  username: string;

  @IsNotEmpty({
    message: 'The password is required',
  })
  @MaxLength(255, {
    message: 'The password must be less than 255 characters',
  })
  @ApiProperty({
    description: 'Password',
    example: '123456',
    required: true,
    maxLength: 255,
  })
  password: string;
}

export class updateUserDto implements IUpdateUserDTO {
  @IsOptional()
  @IsNotEmpty({
    message: 'The name is required',
  })
  @MaxLength(60, {
    message: 'The name must be less than 60 characters',
  })
  @ApiProperty({
    description: 'Name of the user',
    example: 'John',
    required: true,
    maxLength: 60,
  })
  username?: string;

  @IsOptional()
  @IsNotEmpty({
    message: 'The password is required',
  })
  @MaxLength(255, {
    message: 'The password must be less than 255 characters',
  })
  @ApiProperty({
    description: 'Password',
    example: '123456',
    required: true,
    maxLength: 255,
  })
  password?: string;
}
