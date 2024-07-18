import {
  ETransactionStatus,
  IStockEntity,
  ITransactionEntity,
  TCreateStock,
  TCreateTransaction,
} from '../entities/transaction.entity';

export interface transactionRepository {
  createStock: ({ productId, quantity }: TCreateStock) => Promise<IStockEntity | null>;
  updateStockQuantity: (stockId: number, quantity: number) => Promise<boolean | null>;
  createTransaction: ({ userId, productId, amount }: TCreateTransaction) => Promise<ITransactionEntity | null>;
  updateTransactionStatus: (transactionId: number, status: ETransactionStatus) => Promise<boolean | null>;
}
