import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';

import config from 'src/framework/application/config';

import { TransactionService } from '../services/transaction.service';
import { TransactionModel } from '../models/transaction.model';
import { TransactionController } from '../controllers/transaction.controller';
import { UsersService } from 'src/users/infrastructure/services/users.service';
import { UsersModel } from 'src/users/infrastructure/models/users.model';
import { LogsService } from 'src/logs/infrastructure/services/logs.service';
import { LogsModel } from 'src/logs/infrastructure/models/logs.model';
import { GatewayLogsModel } from 'src/logs/infrastructure/models/gateway-logs.model';
import { ProductService } from 'src/product/infrastructure/services/product.service';
import { ProductModel } from 'src/product/infrastructure/models/product.model';
import { PaymentGatewayService } from 'src/payment-gateway/infrastructure/services/payment-gateway.service';
import { HttpModule } from '@nestjs/axios';
import { GatewayTokenService } from 'src/payment-gateway/infrastructure/services/token.service';
import { GatewayTokenModel } from 'src/payment-gateway/infrastructure/models/token.model';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([TransactionModel, UsersModel, ProductModel, LogsModel, GatewayTokenModel, GatewayLogsModel]),
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
  controllers: [TransactionController],
  providers: [TransactionService, UsersService, ProductService, LogsService, GatewayTokenService, PaymentGatewayService],
  exports: [],
})
export class TransactionModule {}
