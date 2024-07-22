import { TCreateLog, TLog } from '../entities/logs.entity';

export interface logsRepository {
  createLog: (log: TCreateLog) => Promise<TLog | null>;
}
