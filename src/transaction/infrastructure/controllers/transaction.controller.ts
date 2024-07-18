import { Body, Controller, HttpCode, HttpException, HttpStatus, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/framework/infrastructure/guards/jwt.guard';

import { ApiResponseCase, IHeaderUserTokenData } from 'src/framework/domain/entities/framework.entity';
import { FrameworkService } from 'src/framework/infrastructure/services/framework.service';
import { PaymentGatewayService } from 'src/payment-gateway/infrastructure/services/payment-gateway.service';
import { ProductService } from 'src/product/infrastructure/services/product.service';
import { UsersService } from 'src/users/infrastructure/services/users.service';
import { ICardTokenizationResponse, ITransactionResponse } from 'src/transaction/domain/entities/transaction.entity';

import { TransactionService } from '../services/transaction.service';
import { TransactionUseCase } from '../../application/transaction.usecase';
import { CardTokenizeDto, CreatePaymentDto } from '../dtos/transaction.dto';
import { ConfigService } from '@nestjs/config';

@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(FrameworkService)
@Controller('transaction')
export class TransactionController {
  private readonly transactionUseCase: TransactionUseCase;

  constructor(
    private readonly inventoryService: TransactionService,
    private readonly productService: ProductService,
    private readonly userService: UsersService,
    private readonly paymentGatewayService: PaymentGatewayService,
    private readonly configService: ConfigService,
  ) {
    this.transactionUseCase = new TransactionUseCase(
      this.inventoryService,
      this.productService,
      this.userService,
      this.paymentGatewayService,
      this.configService,
    );
  }

  @Post('payment')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Genera un pago',
    description: 'Este servicio generará un pago.',
    tags: ['Transactions'],
  })
  async createPayment(
    @Body() body: CreatePaymentDto,
    @Req() req: IHeaderUserTokenData,
  ): Promise<ApiResponseCase<ITransactionResponse>> {
    try {
      const { transactionId } = await this.transactionUseCase.createPayment(req.user.userId, {
        productId: body.productId,
        installments: body.installments,
      });

      return {
        message: 'Payment created successfully!',
        data: {
          transactionId,
        },
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
  async cardTokenize(
    @Body() body: CardTokenizeDto,
    @Req() req: IHeaderUserTokenData,
  ): Promise<ApiResponseCase<ICardTokenizationResponse>> {
    try {
      const { tokenId } = await this.transactionUseCase.cardTokenization(req.user.userId, {
        cardHolder: body.cardHolder,
        cvc: body.cvc,
        expMonth: body.expMonth,
        expYear: body.expYear,
        number: body.number,
      });

      return {
        message: 'Card tokenized successfully!',
        data: {
          tokenId,
        },
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
