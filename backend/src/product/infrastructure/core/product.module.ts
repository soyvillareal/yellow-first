import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import config from 'src/environments';
import { LogsService } from 'src/logs/infrastructure/services/logs.service';
import { UsersModel } from 'src/users/infrastructure/models/users.model';
import { LogsModel } from 'src/logs/infrastructure/models/logs.model';
import { GatewayLogsModel } from 'src/logs/infrastructure/models/gateway-logs.model';
import { CommonService } from 'src/common/infrastructure/services/common.service';
import { UsersService } from 'src/users/infrastructure/services/users.service';

import { ProductModel } from '../models/product.model';
import { ProductController } from '../controllers/product.controller';
import { ProductService } from '../services/product.service';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([ProductModel, UsersModel, LogsModel, GatewayLogsModel]),
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
  controllers: [ProductController],
  providers: [ProductService, UsersService, LogsService, CommonService],
  exports: [],
})
export class ProductsModule {}
