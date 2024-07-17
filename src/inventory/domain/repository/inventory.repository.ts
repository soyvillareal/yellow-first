import {
  ETransactionStatus,
  IStockEntity,
  ITransactionEntity,
  TCreateStock,
  TCreateTransaction,
} from '../entities/inventory.entity';

export interface inventoryRepository {
  createStock: ({ productId, quantity }: TCreateStock) => Promise<IStockEntity | null>;
  updateStockQuantity: (stockId: number, quantity: number) => Promise<boolean | null>;
  createTransaction: ({ userId, productId, amount }: TCreateTransaction) => Promise<ITransactionEntity | null>;
  updateTransactionStatus: (stockId: number, status: ETransactionStatus) => Promise<boolean | null>;
}
