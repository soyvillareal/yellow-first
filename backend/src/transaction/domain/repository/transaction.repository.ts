import {
  ETransactionStatus,
  IGetTransactionByGatewayId,
  ITransactionEntity,
  TCreateTransaction,
} from '../entities/transaction.entity';

export interface transactionRepository {
  createTransaction: ({ userId, productId, amount }: TCreateTransaction) => Promise<ITransactionEntity | null>;
  updateTransactionStatus: (gatewayId: string, status: ETransactionStatus) => Promise<boolean | null>;
  tokenExistsInTransaction: (gatewayTokenId: string) => Promise<boolean | null>;
  getTransactionByGatewayId: (gatewayId: string) => Promise<IGetTransactionByGatewayId | undefined | null>;
}
