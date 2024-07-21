import { TFunction } from 'i18next';

import { EPaginationOrder } from '@helpers/types';

export const initialProductFilter = {
  limit: 10,
  order: EPaginationOrder.DESC,
};

export const limitProductOptions = [
  {
    label: '10',
    value: 10,
  },
  {
    label: '20',
    value: 20,
  },
  {
    label: '30',
    value: 30,
  },
  {
    label: '40',
    value: 40,
  },
  {
    label: '50',
    value: 50,
  },
];

export const sortProductOptions = (t: TFunction) => [
  {
    label: t('products.newest'),
    value: EPaginationOrder.DESC,
  },
  {
    label: t('products.oldest'),
    value: EPaginationOrder.ASC,
  },
];
