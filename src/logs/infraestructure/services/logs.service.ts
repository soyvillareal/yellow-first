import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { logsRepository } from 'src/logs/domain/repository/logs.repository';
import { TCreateLog, TCreateWebHookLog, TLog, TWebHookLog } from 'src/logs/domain/entities/logs.entity';

import { LogsModel } from '../models/logs.model';
import { WebHookLogsModel } from '../models/webhook-logs.model';

@Injectable()
export class LogsService implements logsRepository {
  constructor(
    @InjectRepository(LogsModel) private readonly logsModel: Repository<LogsModel>,
    @InjectRepository(WebHookLogsModel) private readonly webHookLogsModel: Repository<WebHookLogsModel>,
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

  public createWebHookLog = async ({ logId, request, response, type }: TCreateWebHookLog): Promise<TWebHookLog | null> => {
    try {
      const createdWebHookLog = this.webHookLogsModel.create({
        logId,
        request,
        response,
        type,
      });

      const savedWebHookLog = await this.webHookLogsModel.save(createdWebHookLog);

      return savedWebHookLog;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
}
