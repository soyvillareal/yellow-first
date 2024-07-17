import { Module } from '@nestjs/common';
import { ConfigModule, type ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TokensModule } from 'src/tokens/infrastructure/core/tokens.module';
import { UsersModule } from 'src/users/infrastructure/core/users.module';
import { TharotLiteModule } from 'src/payment-gateway/infrastructure/core/payment-gateway.module';
import { InventoryModule } from 'src/inventory/infrastructure/core/inventory.module';
import { LogsModule } from 'src/logs/infrastructure/core/logs.module';
import { UsersService } from 'src/users/infrastructure/services/users.service';
import { UsersModel } from 'src/users/infrastructure/models/users.model';
import { StockModel } from 'src/inventory/infrastructure/models/stock.model';
import { TransactionModel } from 'src/inventory/infrastructure/models/transaction.model';
import { ProductService } from 'src/product/infrastructure/services/product.service';
import { ProductsModule } from 'src/product/infrastructure/core/product.module';
import { DatabaseModule } from 'src/../database/database.module';
import { ProductModel } from 'src/product/infrastructure/models/product.model';

import config from './config';
import { JwtAuthGuard } from '../guards/jwt.guard';

@Module({
  imports: [
    DatabaseModule,
    ProductsModule,
    TokensModule,
    UsersModule,
    LogsModule,
    InventoryModule,
    TharotLiteModule,
    TypeOrmModule.forFeature([ProductModel, UsersModel, StockModel, TransactionModel]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [config.KEY],
      useFactory: async (configService: ConfigType<typeof config>) => {
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
