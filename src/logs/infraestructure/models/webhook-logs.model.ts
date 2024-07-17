import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { IWebHookLogsEntity } from 'src/logs/domain/entities/logs.entity';
import { TPartialRequest } from 'src/framework/domain/entities/framework.entity';

import { LogsModel } from './logs.model';

@Entity({ name: 'webhook_logs' })
export class WebHookLogsModel implements IWebHookLogsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  logId: number;

  @Column({ type: 'jsonb', nullable: true })
  request: TPartialRequest | null;

  @Column({ type: 'jsonb', nullable: true })
  response: object | null;

  @Column({ type: 'varchar', length: 80, nullable: false })
  type: string;

  @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  createdAt: Date;

  @ManyToOne(() => LogsModel, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    nullable: false,
    eager: false,
    cascade: true,
  })
  @JoinColumn({
    name: 'logId',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_wl_log',
  })
  logs: LogsModel;
}
