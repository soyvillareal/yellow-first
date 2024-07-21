import { OnGatewayConnection } from '@nestjs/websockets';
import {
  ETransactionStatus,
  IGetTransactionByGatewayId,
  INotifyTransactionUpdate,
  ITransactionEntity,
  TCreateTransaction,
} from '../entities/transaction.entity';

export interface transactionRepository {
  createTransaction: ({ userId, productId, amount }: TCreateTransaction) => Promise<ITransactionEntity | null>;
  updateTransactionStatus: (gatewayId: string, status: ETransactionStatus) => Promise<boolean | null>;
  tokenExistsInTransaction: (gatewayTokenId: string) => Promise<boolean | null>;
  getTransactionByGatewayId: (gatewayId: string) => Promise<IGetTransactionByGatewayId | undefined | null>;
}

export interface websocketRepository extends OnGatewayConnection {
  notifyTransactionUpdate: (userId: string, data: INotifyTransactionUpdate) => void;
}
