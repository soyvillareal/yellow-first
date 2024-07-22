import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';

import config from 'src/environments';
import { UsersModel } from 'src/session/infrastructure/models/users.model';
import { CommonService } from 'src/common/infrastructure/services/common.service';
import { LogsModel } from 'src/logs/infrastructure/models/logs.model';
import { GatewayLogsModel } from 'src/logs/infrastructure/models/gateway-logs.model';
import { LogsService } from 'src/logs/infrastructure/services/logs.service';
import { SessionService } from 'src/session/infrastructure/services/session.service';

import { SessionModel } from '../models/session.model';
import { SessionController } from '../controllers/session.controller';

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
  providers: [SessionService, LogsService, CommonService],
  exports: [SessionService],
})
export class TokensModule {}
