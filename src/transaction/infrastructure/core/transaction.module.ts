import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';

import config from 'src/framework/application/config';

import { TransactionService } from '../services/transaction.service';
import { StockModel } from '../models/stock.model';
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

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([StockModel, TransactionModel, UsersModel, ProductModel, LogsModel, GatewayLogsModel]),
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
  providers: [TransactionService, UsersService, ProductService, LogsService, PaymentGatewayService],
  exports: [],
})
export class TransactionModule {}
