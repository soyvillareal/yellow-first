import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LogsService } from '../services/logs.service';
import { LogsModel } from '../models/logs.model';
import { GatewayLogsModel } from '../models/gateway-logs.model';

@Module({
  imports: [TypeOrmModule.forFeature([LogsModel, GatewayLogsModel])],
  controllers: [],
  providers: [LogsService],
  exports: [LogsService],
})
export class LogsModule {}