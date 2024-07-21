import { ETransactionStatus } from '@helpers/types';

export interface IMessageByStatusValue {
  icon: JSX.Element;
  title: JSX.Element | string;
  errorMessage?: string;
}

export type TMessageByStatus = Record<
  ETransactionStatus,
  IMessageByStatusValue
>;
