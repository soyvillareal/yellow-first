import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FrameworkService } from 'src/framework/infraestructure/services/framework.service';
import { LogsService } from 'src/logs/infraestructure/services/logs.service';
import { LogsModel } from 'src/logs/infraestructure/models/logs.model';
import { WebHookLogsModel } from 'src/logs/infraestructure/models/webhook-logs.model';

import { SamlStrategy } from '../strategies/saml.strategy';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';

@Module({
  imports: [PassportModule, TypeOrmModule.forFeature([LogsModel, WebHookLogsModel])],
  providers: [SamlStrategy, LogsService, FrameworkService, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
