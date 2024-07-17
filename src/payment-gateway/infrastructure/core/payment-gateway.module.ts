import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { ApiGatewayService } from '../../../payment-gateway/infrastructure/services/payment-gateway.service';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [ApiGatewayService],
  exports: [],
})
export class TharotLiteModule {}
