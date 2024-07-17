import { TPartialRequest } from 'src/framework/domain/entities/framework.entity';

export enum ELogPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}
export interface ILogsEntity {
  id: number;
  userId: string;
  request: TPartialRequest;
  response: object;
  priority: ELogPriority;
  createdAt: Date;
}

export type TCreateLog = Pick<ILogsEntity, 'userId' | 'request' | 'response' | 'priority'>;

export type TLog = Pick<ILogsEntity, 'id' | 'request' | 'response' | 'priority' | 'createdAt'>;

export interface IWebHookLogsEntity {
  id: number;
  logId: number;
  request: TPartialRequest | null;
  response: object | null;
  type: string;
  createdAt: Date;
}

export type TCreateWebHookLog = Pick<IWebHookLogsEntity, 'logId' | 'request' | 'response' | 'type'>;

export type TWebHookLog = Pick<ILogsEntity, 'id' | 'request' | 'response' | 'createdAt'>;
