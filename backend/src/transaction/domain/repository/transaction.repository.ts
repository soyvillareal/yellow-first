import { OnGatewayConnection } from '@nestjs/websockets';
import {
  ETransactionStatus,
  IDeliveryEntity,
  IGetTransactionByGatewayId,
  INotifyTransactionUpdate,
  ITransactionEntity,
  ITransactionProductsEntity,
  TCreateDelivery,
  TCreateTransaction,
  TCreateTransactionProduct,
  TGetTransactionById,
  TGetTransactionConfig,
} from '../entities/transaction.entity';

export interface transactionRepository {
  createTransaction: ({ userId, gatewayId, gatewayTokenId, reference }: TCreateTransaction) => Promise<ITransactionEntity | null>;
  deleteTransactionById: (transactionId: string) => Promise<boolean | null>;
  createTransactionProduct: ({
    userId,
    productId,
    quantity,
    amount,
  }: TCreateTransactionProduct) => Promise<ITransactionProductsEntity | null>;
  updateTransactionStatus: (gatewayId: string, status: ETransactionStatus) => Promise<boolean | null>;
  tokenExistsInTransaction: (gatewayTokenId: string) => Promise<boolean | null>;
  getTransactionProductByGatewayId: (gatewayId: string) => Promise<IGetTransactionByGatewayId | undefined | null>;
  getTransactionById: (userId: string, transactionId: string) => Promise<TGetTransactionById | undefined | null>;
  createDelivery: (data: TCreateDelivery) => Promise<IDeliveryEntity | null>;
  getTransactionConfig: () => Promise<TGetTransactionConfig | undefined | null>;
}

export interface websocketRepository extends OnGatewayConnection {
  notifyTransactionUpdate: (userId: string, data: INotifyTransactionUpdate) => void;
}
