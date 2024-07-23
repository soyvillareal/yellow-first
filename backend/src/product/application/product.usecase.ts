import { IPageMetaResponse, IPageOptions } from 'src/common/domain/entities/common.entity';
import { CommonUseCase } from 'src/common/application/common.usecase';

import { TGetProduct } from '../domain/entities/product.entity';
import { productRepository } from '../domain/repository/product.repository';
import { configRepository } from 'src/common/domain/repository/common.repository';

export class ProductUseCase {
  private readonly commonUseCase: CommonUseCase;

  constructor(
    private readonly productRepository: productRepository,
    private readonly configRepository: configRepository,
  ) {
    this.commonUseCase = new CommonUseCase(this.configRepository);
  }

  async getProducts({ limit, page, order }: IPageOptions): Promise<IPageMetaResponse<TGetProduct[]>> {
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
