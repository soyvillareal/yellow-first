import { TCreateLog, TCreateWebHookLog, TLog, TWebHookLog } from '../entities/logs.entity';

export interface logsRepository {
  createLog: (log: TCreateLog) => Promise<TLog | null>;
  createWebHookLog: (log: TCreateWebHookLog) => Promise<TWebHookLog | null>;
}
