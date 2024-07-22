import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';

import config from 'src/environments';
import { UsersModel } from 'src/users/infrastructure/models/users.model';
import { CommonService } from 'src/common/infrastructure/services/common.service';
import { LogsModel } from 'src/logs/infrastructure/models/logs.model';
import { GatewayLogsModel } from 'src/logs/infrastructure/models/gateway-logs.model';
import { LogsService } from 'src/logs/infrastructure/services/logs.service';
import { UsersService } from 'src/users/infrastructure/services/users.service';

import { SessionModel } from '../models/session.model';
import { SessionController } from '../controllers/session.controller';
import { SessionService } from '../services/session.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SessionModel, UsersModel, LogsModel, GatewayLogsModel]),
    JwtModule.registerAsync({
      inject: [config.KEY],
      useFactory: (configServie: ConfigType<typeof config>) => {
        return {
          secret: configServie.secret_key,
          signOptions: { expiresIn: configServie.jwt_expires_in },
        };
      },
    }),
  ],
  controllers: [SessionController],
  providers: [UsersService, SessionService, LogsService, CommonService],
  exports: [],
})
export class TokensModule {}
