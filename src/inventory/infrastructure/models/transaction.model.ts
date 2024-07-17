import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { UsersModel } from 'src/users/infrastructure/models/users.model';
import { ProductModel } from 'src/product/infrastructure/models/product.model';

import { ETransactionStatus, ITransactionEntity } from '../../domain/entities/inventory.entity';

@Entity({ name: 'transaction' })
export class TransactionModel extends BaseEntity implements ITransactionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', nullable: false })
  userId: string;

  @Column({ type: 'uuid', nullable: false })
  productId: string;

  @Column({ type: 'enum', enum: ETransactionStatus, default: ETransactionStatus.PENDING, nullable: false })
  status: ETransactionStatus;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: false })
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
}
