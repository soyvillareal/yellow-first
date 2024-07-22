import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { IGatewayTokenEntity } from 'src/payment-gateway/domain/entities/token.entity';
import { UsersModel } from 'src/session/infrastructure/models/users.model';

@Entity({ name: 'gateway_tokens' })
export class GatewayTokenModel extends BaseEntity implements IGatewayTokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  userId: string;

  @Column({ type: 'varchar', length: 90, nullable: false })
  token: string;

  @Column({ type: 'varchar', length: 10, nullable: false })
  brand: string;

  @Column({ type: 'varchar', length: 4, nullable: false })
  lastFour: string;

  @Column({ type: 'varchar', length: 2, nullable: false })
  expMonth: string;

  @Column({ type: 'varchar', length: 2, nullable: false })
  expYear: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  cardHolder: string;

  @Column({ type: 'date', nullable: false })
  expiredAt: Date;

  @Column({ type: 'date', nullable: false })
  validityEndsAt: Date;

  @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  createdAt: Date;

  @ManyToOne(() => UsersModel, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
    nullable: false,
    eager: false,
    cascade: true,
  })
  @JoinColumn({
    name: 'userId',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_gatewaytoken_user',
  })
  users: UsersModel;
}
