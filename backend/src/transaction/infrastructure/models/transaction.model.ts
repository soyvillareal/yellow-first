import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { UsersModel } from 'src/users/infrastructure/models/users.model';
import { ProductModel } from 'src/product/infrastructure/models/product.model';

import { ETransactionStatus, ITransactionEntity } from '../../domain/entities/transaction.entity';
import { GatewayTokenModel } from 'src/payment-gateway/infrastructure/models/token.model';

@Entity({ name: 'transactions' })
export class TransactionModel extends BaseEntity implements ITransactionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', nullable: false })
  userId: string;

  @Column({ type: 'varchar', length: 30, nullable: false })
  gatewayId: string;

  @Column({ type: 'uuid', nullable: false })
  gatewayTokenId: string;

  @Column({ type: 'uuid', nullable: false })
  reference: string;

  @Column({ type: 'uuid', nullable: false })
  productId: string;

  @Column({ type: 'enum', enum: ETransactionStatus, default: ETransactionStatus.PENDING, nullable: false })
  status: ETransactionStatus;

  @Column({
    type: 'int',
    nullable: false,
  })
  quantity: number;

  @Column({ type: 'numeric', precision: 10, scale: 0, nullable: false })
  amount: number;

  @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  createdAt: Date;

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
    foreignKeyConstraintName: 'fk_transaction_product',
  })
  products: ProductModel;

  @ManyToOne(() => UsersModel, {
    onDelete: 'RESTRICT',
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

  @ManyToOne(() => GatewayTokenModel, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    nullable: false,
    eager: false,
    cascade: true,
  })
  @JoinColumn({
    name: 'gatewayTokenId',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_transaction_gatewaytoken',
  })
  tokens: GatewayTokenModel;
}
