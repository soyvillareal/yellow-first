import { Module } from '@nestjs/common';
import { ConfigModule, type ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TokensModule } from 'src/tokens/infrastructure/core/tokens.module';
import { UsersModule } from 'src/users/infrastructure/core/users.module';
import { PaymentGatewayModule } from 'src/payment-gateway/infrastructure/core/payment-gateway.module';
import { TransactionModule } from 'src/transaction/infrastructure/core/transaction.module';
import { LogsModule } from 'src/logs/infrastructure/core/logs.module';
import { UsersService } from 'src/users/infrastructure/services/users.service';
import { UsersModel } from 'src/users/infrastructure/models/users.model';
import { TransactionModel } from 'src/transaction/infrastructure/models/transaction.model';
import { ProductService } from 'src/product/infrastructure/services/product.service';
import { ProductsModule } from 'src/product/infrastructure/core/product.module';
import { DatabaseModule } from 'src/../database/database.module';
import { ProductModel } from 'src/product/infrastructure/models/product.model';

import config from '../../application/config';
import { JwtAuthGuard } from '../guards/jwt.guard';

@Module({
  imports: [
    DatabaseModule,
    ProductsModule,
    TokensModule,
    UsersModule,
    LogsModule,
    TransactionModule,
    PaymentGatewayModule,
    TypeOrmModule.forFeature([ProductModel, UsersModel, TransactionModel]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        return {
          secret: configService.secret_key,
          signOptions: { expiresIn: configService.jwt_expires_in },
        };
      },
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000, // 1 second
        limit: 3, // limit each IP to 3 requests per ttl
      },
      {
        name: 'medium',
        ttl: 10000, // 10 seconds
        limit: 20, // limit each IP to 20 requests per ttl
      },
      {
        name: 'long',
        ttl: 60000, // 1 minute
        limit: 100, // limit each IP to 100 requests per ttl
      },
    ]),
  ],
  controllers: [],
  providers: [JwtAuthGuard, UsersService, ProductService],
  exports: [JwtAuthGuard],
})
export class AppModule {}
