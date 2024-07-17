import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';

import config from 'src/framework/infrastructure/core/config';
import { LogsService } from 'src/logs/infrastructure/services/logs.service';
import { FrameworkService } from 'src/framework/infrastructure/services/framework.service';
import { CommonService } from 'src/common/infrastructure/services/common.service';
import { LogsModel } from 'src/logs/infrastructure/models/logs.model';
import { GatewayLogsModel } from 'src/logs/infrastructure/models/gateway-logs.model';

import { UsersModel } from '../models/users.model';
import { UsersController } from '../controllers/users.controller';
import { UsersService } from '../services/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersModel, LogsModel, GatewayLogsModel]),
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
