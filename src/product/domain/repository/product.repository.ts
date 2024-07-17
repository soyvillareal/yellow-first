import { IListAndTotal, IPageFilter } from 'src/common/domain/entities/common.entity';

import { TGetProduct } from '../entities/product.entity';

export interface productRepository {
  getProducts: ({ limit, page, order, skip }: IPageFilter) => Promise<IListAndTotal<TGetProduct[]> | null>;
}
