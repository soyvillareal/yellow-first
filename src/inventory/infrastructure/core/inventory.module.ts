import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';

import config from 'src/framework/infrastructure/core/config';

import { InventoryService } from '../services/inventory.service';
import { StockModel } from '../models/stock.model';
import { TransactionModel } from '../models/transaction.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([StockModel, TransactionModel]),
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
  controllers: [],
  providers: [InventoryService],
  exports: [],
})
export class InventoryModule {}
