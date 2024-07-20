import { EPaginationOrder } from '@helpers/types';

export interface IProductFilterState {
  limit: number;
  order: EPaginationOrder;
}
