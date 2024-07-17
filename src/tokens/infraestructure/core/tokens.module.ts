import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';

import config from 'src/framework/infraestructure/core/config';
import { UsersModel } from 'src/users/infraestructure/models/users.model';
import { FrameworkService } from 'src/framework/infraestructure/services/framework.service';
import { LogsModel } from 'src/logs/infraestructure/models/logs.model';
import { GatewayLogsModel } from 'src/logs/infraestructure/models/gateway-logs.model';
import { LogsService } from 'src/logs/infraestructure/services/logs.service';
import { UsersService } from 'src/users/infraestructure/services/users.service';

import { TokensModel } from '../models/tokens.model';
import { TokensController } from '../controllers/tokens.controller';
import { TokensService } from '../services/token.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TokensModel, UsersModel, LogsModel, GatewayLogsModel]),
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
  controllers: [TokensController],
  providers: [UsersService, TokensService, LogsService, FrameworkService],
  exports: [],
})
export class TokensModule {}
