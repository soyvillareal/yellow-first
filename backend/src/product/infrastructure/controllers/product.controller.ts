import { Controller, Get, HttpCode, HttpException, HttpStatus, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { TGetProduct } from 'src/product/domain/entities/product.entity';
import { JwtAuthGuard } from 'src/common/infrastructure/guards/jwt.guard';
import { ApiResponseCase } from 'src/common/domain/entities/common.entity';
import { DApiResponseCase } from 'src/common/infrastructure/decorators/common.decorator';
import { CommonService } from 'src/common/infrastructure/services/common.service';
import { PageOptionsDto } from 'src/common/infrastructure/dtos/page-options.dto';
import { IPageMetaResponse } from 'src/common/domain/entities/common.entity';

import { ProductService } from '../services/product.service';
import { ProductUseCase } from '../../application/product.usecase';
import { productPaginatedDto } from '../dtos/product.dto';
import { ConfigService } from '@nestjs/config';

@ApiTags('Products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(CommonService)
@Controller('product')
export class ProductController {
  private readonly productUseCase: ProductUseCase;

  constructor(
    private readonly productService: ProductService,
    private readonly configService: ConfigService,
  ) {
    this.productUseCase = new ProductUseCase(this.productService, this.configService);
  }

  @Get('list')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Listar los proyectos',
    description: 'Este servicio devolverá una lista de proyectos con paginación.',
    tags: ['Products'],
  })
  @DApiResponseCase({
    statusCode: HttpStatus.OK,
    description: 'Productos obtenidos correctamente!',
    dataDto: productPaginatedDto,
  })
  async getProducts(@Query() query: PageOptionsDto): Promise<ApiResponseCase<IPageMetaResponse<TGetProduct[]>>> {
    try {
      const products = await this.productUseCase.getProducts({
        limit: query.limit,
        page: query.page,
        order: query.order,
      });

      return {
        message: 'Products obtained successfully!',
        data: products,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
