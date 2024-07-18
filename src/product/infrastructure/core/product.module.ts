import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import config from 'src/framework/infrastructure/core/config';
import { LogsService } from 'src/logs/infrastructure/services/logs.service';
import { UsersModel } from 'src/users/infrastructure/models/users.model';
import { LogsModel } from 'src/logs/infrastructure/models/logs.model';
import { GatewayLogsModel } from 'src/logs/infrastructure/models/gateway-logs.model';
import { FrameworkService } from 'src/framework/infrastructure/services/framework.service';
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
  providers: [ProductService, UsersService, LogsService, FrameworkService],
  exports: [],
})
export class ProductsModule {}
