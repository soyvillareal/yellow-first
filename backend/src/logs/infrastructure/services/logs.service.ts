import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { logsRepository } from 'src/logs/domain/repository/logs.repository';
import { TCreateGatewayLog, TCreateLog, TGatewayLog, TLog } from 'src/logs/domain/entities/logs.entity';

import { LogsModel } from '../models/logs.model';
import { GatewayLogsModel } from '../models/gateway-logs.model';

@Injectable()
export class LogsService implements logsRepository {
  constructor(
    @InjectRepository(LogsModel) private readonly logsModel: Repository<LogsModel>,
    @InjectRepository(GatewayLogsModel) private readonly gatewayLogsModel: Repository<GatewayLogsModel>,
  ) {}

  public createLog = async ({ userId, request, response, priority }: TCreateLog): Promise<TLog | null> => {
    try {
      const createdLog = this.logsModel.create({
        userId,
        request,
        response,
        priority,
      });

      const savedLog = await this.logsModel.save(createdLog);

      return savedLog;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  public createWebHookLog = async ({ logId, request, response, type }: TCreateGatewayLog): Promise<TGatewayLog | null> => {
    try {
      const createdWebHookLog = this.gatewayLogsModel.create({
        logId,
        request,
        response,
        type,
      });

      const savedWebHookLog = await this.gatewayLogsModel.save(createdWebHookLog);

      return savedWebHookLog;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
}
