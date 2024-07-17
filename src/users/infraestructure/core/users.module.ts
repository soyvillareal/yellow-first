import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';

import config from 'src/framework/infraestructure/core/config';
import { LogsService } from 'src/logs/infraestructure/services/logs.service';
import { FrameworkService } from 'src/framework/infraestructure/services/framework.service';
import { CommonService } from 'src/common/infraestructure/services/common.service';
import { LogsModel } from 'src/logs/infraestructure/models/logs.model';
import { WebHookLogsModel } from 'src/logs/infraestructure/models/webhook-logs.model';

import { UsersModel } from '../models/users.model';
import { UsersController } from '../controllers/users.controller';
import { UsersService } from '../services/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersModel, LogsModel, WebHookLogsModel]),
    JwtModule.registerAsync({
      inject: [config.KEY],
      useFactory: async (configServie: ConfigType<typeof config>) => {
        return {
          secret: configServie.secret_key,
          signOptions: { expiresIn: configServie.jwt_expires_in },
        };
      },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, CommonService, LogsService, FrameworkService],
  exports: [],
})
export class UsersModule {}
