import { Module } from '@nestjs/common';
import { ConfigModule, type ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TokensModule } from 'src/tokens/infraestructure/core/tokens.module';
import { DatabaseModule } from 'src/database/database.module';
import { UsersModule } from 'src/users/infraestructure/core/users.module';
import { TharotLiteModule } from 'src/payment-gateway/infraestructure/core/payment-gateway.module';
import { InventoryModule } from 'src/inventory/infraestructure/core/inventory.module';
import { LogsModule } from 'src/logs/infraestructure/core/logs.module';
import { UsersService } from 'src/users/infraestructure/services/users.service';
import { UsersModel } from 'src/users/infraestructure/models/users.model';
import { StockModel } from 'src/inventory/infraestructure/models/stock.model';
import { TransactionModel } from 'src/inventory/infraestructure/models/transaction.model';
import { ProductService } from 'src/product/infraestructure/services/product.service';
import { ProductModel } from 'src/product/infraestructure/models/product.model';

import config from './config';
import { ProductsModule } from '../../../product/infraestructure/core/product.module';
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
