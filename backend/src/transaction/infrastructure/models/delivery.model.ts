import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { UsersModel } from 'src/users/infrastructure/models/users.model';

import { IDeliveryEntity } from '../../domain/entities/transaction.entity';
import { TransactionModel } from './transaction.model';

@Entity({ name: 'deliveries' })
export class DeliveryModel extends BaseEntity implements IDeliveryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  userId: string;

  @Column({ type: 'uuid', nullable: false })
  transactionId: string;

  @Column({ type: 'varchar', length: 5, nullable: false, default: '+1' })
  phoneCode: string;

  @Column({ type: 'varchar', length: 15, nullable: false })
  phoneNumber: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  firstAddress: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  secondAddress: string;

  @Column({ type: 'varchar', length: 80, nullable: false })
  state: string;

  @Column({ type: 'varchar', length: 80, nullable: false })
  city: string;

  @Column({ type: 'varchar', length: 10, nullable: false })
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
    foreignKeyConstraintName: 'fk_delivery_user',
  })
  users: UsersModel;

  @OneToOne(() => TransactionModel, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
    nullable: false,
    eager: false,
    cascade: true,
  })
  @JoinColumn({
    name: 'transactionId',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_delivery_transaction',
  })
  transactions: TransactionModel;
}
