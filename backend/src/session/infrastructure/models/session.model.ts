import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { ESessionType, ISessionEntity } from 'src/session/domain/entities/session.entity';
import { UsersModel } from 'src/session/infrastructure/models/users.model';

@Entity({ name: 'sessions' })
export class SessionModel implements ISessionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  userId: string | null;

  @Column({ type: 'text', nullable: false })
  jwt: string;

  @Column({
    type: 'enum',
    enum: ESessionType,
    nullable: false,
    default: ESessionType.ANONYMOUS,
  })
  type: ESessionType;

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  expiredAt: Date;

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
