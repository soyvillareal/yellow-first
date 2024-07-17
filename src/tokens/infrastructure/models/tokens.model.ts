import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { ITokensEntity } from 'src/tokens/domain/entities/tokens.entity';
import { UsersModel } from 'src/users/infrastructure/models/users.model';

@Entity({ name: 'tokens' })
export class TokensModel implements ITokensEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', nullable: false })
  userId: string;

  @Column({ type: 'text', nullable: false })
  token: string;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  updatedAt: Date;

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
    foreignKeyConstraintName: 'fk_token_user',
  })
  users: UsersModel;
}
