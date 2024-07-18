import { ApiProperty } from '@nestjs/swagger';

import { IPageMetaDtoParameters, IPageMetaResponse } from 'src/common/domain/entities/common.entity';
import { PageMetaDto } from 'src/common/infrastructure/dtos/page-meta.dto';
import { TGetProduct } from 'src/product/domain/entities/product.entity';

export class getProductDto implements TGetProduct {
  @ApiProperty({
    description: 'UUID del proyecto',
    example: 1,
    required: true,
    type: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Oreo',
    required: true,
    maxLength: 80,
    type: 'string',
  })
  name: string;

  @ApiProperty({
    description: 'Descripción del producto',
    example: 'Galleta de chocolate',
    required: true,
    maxLength: 800,
    type: 'string',
  })
  description: string;

  @ApiProperty({
    description: 'Precio del producto',
    example: 100,
    required: true,
    type: 'string',
  })
  price: string;

  @ApiProperty({
    description: 'Stock del producto',
    example: 5000,
    required: true,
    type: 'number',
  })
  stock: number;
}

export class productPaginatedDto implements IPageMetaResponse<TGetProduct> {
  @ApiProperty({
    type: [getProductDto],
  })
  readonly content: getProductDto;

  @ApiProperty()
  readonly meta: PageMetaDto;

  constructor(content: getProductDto, meta: IPageMetaDtoParameters) {
    this.content = content;
    this.meta = new PageMetaDto(meta);
  }
}
