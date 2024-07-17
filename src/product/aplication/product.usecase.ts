import { IPageOptions } from 'src/common/domain/entities/common.entity';
import { CommonUseCase } from 'src/common/application/common.usecase';

import { TGetProduct } from '../domain/entities/product.entity';
import { productRepository } from '../domain/repository/product.repository';

export class ProductUseCase {
  private readonly commonUseCase: CommonUseCase;

  constructor(private readonly productRepository: productRepository) {
    this.commonUseCase = new CommonUseCase();
  }

  async getProducts({ limit, page, order }: IPageOptions): Promise<any> {
    const products = await this.productRepository.getProducts({
      limit,
      order,
      page,
      skip: this.commonUseCase.getSkipped(page, limit),
    });

    const entities = this.commonUseCase.pageMeta<TGetProduct[]>(products.list, {
      itemCount: products.total,
      pageOptions: {
        limit,
        order,
        page,
      },
    });

    return entities;
  }
}
