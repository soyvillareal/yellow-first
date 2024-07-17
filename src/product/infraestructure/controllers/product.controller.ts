import { Controller, Get, HttpCode, HttpException, HttpStatus, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { TGetProduct } from 'src/product/domain/entities/product.entity';
import { JwtAuthGuard } from 'src/framework/infraestructure/guards/jwt.guard';
import { ApiResponseCase } from 'src/framework/domain/entities/framework.entity';
import { DApiResponseCase } from 'src/common/infraestructure/decorators/common.decorator';
import { FrameworkService } from 'src/framework/infraestructure/services/framework.service';
import { PageOptionsDto } from 'src/common/infraestructure/dtos/page-options.dto';
import { IPageMetaResponse } from 'src/common/domain/entities/common.entity';

import { ProductService } from '../services/product.service';
import { ProductUseCase } from '../../aplication/product.usecase';
import { productPaginatedDto } from '../dtos/product.dto';

@ApiTags('Products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(FrameworkService)
@Controller('product')
export class ProductController {
  private readonly productUseCase: ProductUseCase;

  constructor(private readonly productService: ProductService) {
    this.productUseCase = new ProductUseCase(this.productService);
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
      const { data: leads } = await this.productUseCase.getProducts({
        limit: query.limit,
        page: query.page,
        order: query.order,
      });

      return {
        message: 'Lead created successfully!',
        data: leads,
      };
    } catch (error) {
      console.log('errorCatch: ', error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
