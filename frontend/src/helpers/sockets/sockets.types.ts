import { ETransactionStatus } from '@helpers/types';

export interface ISubscribeToTransactionUpdates {
  transactionId: string;
  status: ETransactionStatus;
}
