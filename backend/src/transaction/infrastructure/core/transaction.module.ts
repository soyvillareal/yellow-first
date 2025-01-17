import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';

import config from 'src/environments';

import { TransactionService } from '../services/transaction.service';
import { TransactionModel } from '../models/transaction.model';
import { TransactionController } from '../controllers/transaction.controller';
import { SessionService } from 'src/session/infrastructure/services/session.service';
import { UsersModel } from 'src/session/infrastructure/models/users.model';
import { LogsService } from 'src/logs/infrastructure/services/logs.service';
import { LogsModel } from 'src/logs/infrastructure/models/logs.model';
import { ProductService } from 'src/product/infrastructure/services/product.service';
import { ProductModel } from 'src/product/infrastructure/models/product.model';
import { PaymentGatewayService } from 'src/payment-gateway/infrastructure/services/payment-gateway.service';
import { HttpModule } from '@nestjs/axios';
import { GatewayTokenService } from 'src/payment-gateway/infrastructure/services/gateway-token.service';
import { GatewayTokenModel } from 'src/payment-gateway/infrastructure/models/gateway-token.model';
import { SessionModel } from 'src/session/infrastructure/models/session.model';

import { TransactionsWebsockets } from '../websockets/transaction.websoket';
import { TransactionProductsModel } from '../models/transaction-products.model';
import { DeliveryModel } from '../models/delivery.model';
import { TransactionConfigModel } from '../models/transaction-config.model';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      TransactionModel,
      TransactionProductsModel,
      TransactionConfigModel,
      DeliveryModel,
      UsersModel,
      SessionModel,
      ProductModel,
      LogsModel,
      GatewayTokenModel,
    ]),
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
  providers: [
    TransactionService,
    TransactionsWebsockets,
    SessionService,
    ProductService,
    LogsService,
    GatewayTokenService,
    PaymentGatewayService,
  ],
  exports: [],
})
export class TransactionModule {}
