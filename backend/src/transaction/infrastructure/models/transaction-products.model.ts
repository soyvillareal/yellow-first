import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { ProductModel } from 'src/product/infrastructure/models/product.model';

import { ITransactionProductsEntity } from '../../domain/entities/transaction.entity';
import { TransactionModel } from './transaction.model';
import { UsersModel } from 'src/users/infrastructure/models/users.model';

@Entity({ name: 'transactions_products' })
export class TransactionProductsModel extends BaseEntity implements ITransactionProductsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  userId: string;

  @Column({ type: 'uuid', nullable: false })
  transactionId: string;

  @Column({ type: 'uuid', nullable: false })
  productId: string;

  @Column({ type: 'varchar', length: 30, nullable: false })
  gatewayId: string;

  @Column({
    type: 'int',
    nullable: false,
  })
  quantity: number;

  @Column({ type: 'numeric', precision: 10, scale: 0, nullable: false })
  amount: number;

  @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  createdAt: Date;

  @ManyToOne(() => UsersModel, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
    eager: false,
    cascade: true,
  })
  @JoinColumn({
    name: 'userId',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_transaction_user',
  })
  users: UsersModel;

  @ManyToOne(() => ProductModel, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    nullable: false,
    eager: false,
    cascade: true,
  })
  @JoinColumn({
    name: 'productId',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_tp_product',
  })
  products: ProductModel;

  @ManyToOne(() => TransactionModel, (transaction) => transaction.transactionProducts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
    eager: false,
  })
  @JoinColumn({
    name: 'transactionId',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_transaction_tp',
  })
  transactions: TransactionModel[];
}
