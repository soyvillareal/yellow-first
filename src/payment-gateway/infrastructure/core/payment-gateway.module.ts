import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { PaymentGatewayService } from '../../../payment-gateway/infrastructure/services/payment-gateway.service';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [PaymentGatewayService],
  exports: [],
})
export class PaymentGatewayModule {}
