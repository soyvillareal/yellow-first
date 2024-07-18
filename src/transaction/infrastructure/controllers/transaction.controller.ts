import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/framework/infrastructure/guards/jwt.guard';

import { ApiResponseCase, IHeaderUserTokenData } from 'src/framework/domain/entities/framework.entity';
import { FrameworkService } from 'src/framework/infrastructure/services/framework.service';
import { PaymentGatewayService } from 'src/payment-gateway/infrastructure/services/payment-gateway.service';
import { ProductService } from 'src/product/infrastructure/services/product.service';
import { UsersService } from 'src/users/infrastructure/services/users.service';
import { IUpdateTransactionResponse } from 'src/transaction/domain/entities/transaction.entity';

import { TransactionService } from '../services/transaction.service';
import { TransactionUseCase } from '../../application/transaction.usecase';
import { CardTokenizeDto, CreatePaymentDto, GatewayEventDto } from '../dtos/transaction.dto';
import { ConfigService } from '@nestjs/config';
import { IGatewayEventHeaders } from 'src/payment-gateway/domain/entities/payment-gateway.entity';
import { GatewayTokenService } from 'src/payment-gateway/infrastructure/services/token.service';
import { ValidateTokenGuard } from '../guard/transaction.guard';

@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(FrameworkService)
@Controller('transaction')
export class TransactionController {
  private readonly transactionUseCase: TransactionUseCase;

  constructor(
    private readonly transactionService: TransactionService,
    private readonly productService: ProductService,
    private readonly userService: UsersService,
    private readonly paymentGatewayService: PaymentGatewayService,
    private readonly gatewayTokenService: GatewayTokenService,
    private readonly configService: ConfigService,
  ) {
    this.transactionUseCase = new TransactionUseCase(
      this.transactionService,
      this.productService,
      this.userService,
      this.paymentGatewayService,
      this.gatewayTokenService,
      this.configService,
    );
  }

  @Post('payment')
  @HttpCode(HttpStatus.OK)
  @UseGuards(ValidateTokenGuard)
  @ApiOperation({
    summary: 'Genera un pago',
    description: 'Este servicio generará un pago.',
    tags: ['Transactions'],
  })
  async createPayment(@Body() body: CreatePaymentDto, @Req() req: IHeaderUserTokenData): Promise<ApiResponseCase<void>> {
    try {
      await this.transactionUseCase.createPayment(req.user.userId, {
        productId: body.productId,
        installments: body.installments,
      });

      return {
        message: 'Payment created successfully!',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('card-tokenize')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Crea una transacción',
    description: 'Este servicio creará una transacción.',
    tags: ['Transactions'],
  })
  async cardTokenize(@Body() body: CardTokenizeDto, @Req() req: IHeaderUserTokenData): Promise<ApiResponseCase<void>> {
    try {
      await this.transactionUseCase.cardTokenization(req.user.userId, {
        cardHolder: body.cardHolder,
        cvc: body.cvc,
        expMonth: body.expMonth,
        expYear: body.expYear,
        number: body.number,
      });

      return {
        message: 'Card tokenized successfully!',
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('update-transaction')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Actualiza una transacción',
    description: 'Este servicio actualizará una transacción mediante un webhook.',
    tags: ['Transactions'],
  })
  async updateTransaction(
    @Body() body: GatewayEventDto,
    @Headers() headers: IGatewayEventHeaders,
  ): Promise<ApiResponseCase<IUpdateTransactionResponse>> {
    try {
      const response = await this.transactionUseCase.webHookTransaction(headers['X-Event-Checksum'], {
        event: body.event,
        data: body.data,
        environment: body.environment,
        signature: body.signature,
        timestamp: body.timestamp,
        sent_at: body.sent_at,
      });

      return {
        message: 'Transaction updated successfully!',
        data: response,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
