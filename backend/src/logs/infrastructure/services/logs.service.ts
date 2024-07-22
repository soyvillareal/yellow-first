import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { logsRepository } from 'src/logs/domain/repository/logs.repository';
import { TCreateLog, TLog } from 'src/logs/domain/entities/logs.entity';

import { LogsModel } from '../models/logs.model';

@Injectable()
export class LogsService implements logsRepository {
  constructor(@InjectRepository(LogsModel) private readonly logsModel: Repository<LogsModel>) {}

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
}
