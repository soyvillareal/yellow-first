import { IListAndTotal, IPageFilter } from 'src/common/domain/entities/common.entity';

import { TGetProduct, TGetProductById } from '../entities/product.entity';

export interface productRepository {
  getProducts: ({ limit, page, order, skip }: IPageFilter) => Promise<IListAndTotal<TGetProduct[]> | null>;
  getProductById: (productId: string) => Promise<TGetProductById | undefined | null>;
}
