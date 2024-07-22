import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { ELogPriority, ILogsEntity } from 'src/logs/domain/entities/logs.entity';
import { TPartialRequest } from 'src/common/domain/entities/common.entity';
import { UsersModel } from 'src/session/infrastructure/models/users.model';

@Entity({ name: 'logs' })
export class LogsModel implements ILogsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', nullable: true, default: null })
  userId: string;

  @Column({ type: 'jsonb', nullable: false })
  request: TPartialRequest;

  @Column({ type: 'jsonb', nullable: true })
  response: object;

  @Column({ type: 'enum', enum: ELogPriority, default: ELogPriority.LOW, nullable: false })
  priority: ELogPriority;

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
    foreignKeyConstraintName: 'fk_log_user',
  })
  users: UsersModel;
}
