import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { ITransactionConfigEntity } from '../../domain/entities/transaction.entity';

@Entity({ name: 'transaction_config' })
export class TransactionConfigModel extends BaseEntity implements ITransactionConfigEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'numeric', precision: 10, scale: 0, nullable: false })
  fixedRate: string;

  @Column({ type: 'numeric', precision: 5, scale: 3, nullable: false })
  variablePercentage: string;

  @Column({ type: 'numeric', precision: 10, scale: 0, nullable: false })
  shippingFee: string;

  @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  updatedAt: Date;

  @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  createdAt: Date;
}
