import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

import { IParamsWithUUID } from 'src/common/domain/entities/common.entity';
import { ApiResponseCase } from 'src/framework/domain/entities/framework.entity';

export class apiResponseDto<T> implements ApiResponseCase<T> {
  @ApiProperty({
    type: Number,
    enum: HttpStatus,
    description: 'HTTP Status Code',
    example: HttpStatus.OK,
  })
  statusCode: HttpStatus;

  @ApiProperty()
  message?: string;

  data: T;
}

export class paramsWithUUIDDto implements IParamsWithUUID {
  @IsUUID(4, {
    message: 'The ID is not a valid UUID',
  })
  @ApiProperty({
    description: 'UUID of the entity',
    example: '12345678-1234-1234-1234-123456789012',
  })
  id: string;
}
