import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';

import { EOrderType, IPageOptions } from 'src/common/domain/entities/common.entity';

export class PageOptionsDto implements IPageOptions {
  @ApiPropertyOptional({ enum: EOrderType, default: EOrderType.ASC })
  @IsEnum(EOrderType)
  readonly order?: EOrderType = EOrderType.ASC;

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  readonly page: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    default: 10,
    enum: [10, 20, 30, 40, 50],
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsEnum([10, 20, 30, 40, 50], {
    each: true,
    message: ({ value }) => `Limit must be one of the following values: 10, 20, 30, 40, 50. Received: ${value}`,
  })
  @IsOptional()
  readonly limit: number = 10;

  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}
