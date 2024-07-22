import { BaseEntity, Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { UsersModel } from 'src/users/infrastructure/models/users.model';

import { ETransactionStatus, ITransactionEntity } from '../../domain/entities/transaction.entity';
import { GatewayTokenModel } from 'src/payment-gateway/infrastructure/models/token.model';
import { TransactionProductsModel } from './transaction-products.model';

@Entity({ name: 'transactions' })
export class TransactionModel extends BaseEntity implements ITransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  userId: string;

  @Column({ type: 'varchar', length: 30, unique: true, nullable: false })
  gatewayId: string;

  @Column({ type: 'uuid', nullable: false })
  gatewayTokenId: string;

  @Column({ type: 'uuid', nullable: false })
  reference: string;

  @Column({ type: 'numeric', precision: 10, scale: 0, nullable: false })
  totalAmount: number;

  @Column({ type: 'enum', enum: ETransactionStatus, default: ETransactionStatus.PENDING, nullable: false })
  status: ETransactionStatus;

  @Column({ type: 'varchar', length: 5, nullable: false, default: '+1' })
  phoneCode: string;

  @Column({ type: 'varchar', length: 15, nullable: true, default: null })
  phoneNumber: string;

  @Column({ type: 'varchar', length: 255, nullable: true, default: null })
  firstAddress: string;

  @Column({ type: 'varchar', length: 255, nullable: true, default: null })
  secondAddress: string;

  @Column({ type: 'varchar', length: 80, nullable: true, default: null })
  state: string;

  @Column({ type: 'varchar', length: 80, nullable: true, default: null })
  city: string;

  @Column({ type: 'varchar', length: 10, nullable: true, default: null })
  pincode: string;

  @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  createdAt: Date;

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

  @ManyToMany(() => TransactionProductsModel, (transactionProduct) => transactionProduct.transactions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
    eager: false,
    cascade: true,
  })
  transactionProducts: TransactionProductsModel[];
}
