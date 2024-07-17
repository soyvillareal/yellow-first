import { TCreateGatewayLog, TCreateLog, TGatewayLog, TLog } from '../entities/logs.entity';

export interface logsRepository {
  createLog: (log: TCreateLog) => Promise<TLog | null>;
  createWebHookLog: (log: TCreateGatewayLog) => Promise<TGatewayLog | null>;
}
