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

export const sortProductOptions = [
  {
    label: 'Newest',
    value: EPaginationOrder.DESC,
  },
  {
    label: 'Oldest',
    value: EPaginationOrder.ASC,
  },
];
