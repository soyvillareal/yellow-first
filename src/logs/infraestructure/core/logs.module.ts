import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LogsService } from '../services/logs.service';
import { LogsModel } from '../models/logs.model';
import { WebHookLogsModel } from '../models/webhook-logs.model';

@Module({
  imports: [TypeOrmModule.forFeature([LogsModel, WebHookLogsModel])],
  controllers: [],
  providers: [LogsService],
  exports: [LogsService],
})
export class LogsModule {}
