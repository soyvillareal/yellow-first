import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/common/infrastructure/guards/jwt.guard';

import { ApiResponseCase, IHeaderUserTokenData } from 'src/common/domain/entities/common.entity';
import { CommonService } from 'src/common/infrastructure/services/common.service';
import { PaymentGatewayService } from 'src/payment-gateway/infrastructure/services/payment-gateway.service';
import { ProductService } from 'src/product/infrastructure/services/product.service';
import { SessionService } from 'src/session/infrastructure/services/session.service';
import {
  ICardTokenizationResponse,
  ICreatePaymentResponse,
  IGetTransactionConfig,
  ITransactionByIdResponse,
  IUpdateTransactionResponse,
} from 'src/transaction/domain/entities/transaction.entity';

import { TransactionService } from '../services/transaction.service';
import { TransactionUseCase } from '../../application/transaction.usecase';
import {
  CardTokenizeDto,
  CreatePaymentDto,
  GatewayEventDto,
  GetTransactionConfigDto,
  TransactionByIdResponseDto,
  UpdateTransactionDto,
} from '../dtos/transaction.dto';
import { ConfigService } from '@nestjs/config';
import { IGatewayEvent, IGatewayEventHeaders } from 'src/payment-gateway/domain/entities/payment-gateway.entity';
import { GatewayTokenService } from 'src/payment-gateway/infrastructure/services/gateway-token.service';
import { ValidateTokenGuard } from '../guard/transaction.guard';
import { TransactionsWebsockets } from '../websockets/transaction.websoket';
import { paramsWithUUIDDto } from 'src/common/infrastructure/dtos/common.dto';
import { LoggedAuthGuard } from 'src/common/infrastructure/guards/logged.guard';
import { DApiResponseCase } from 'src/common/infrastructure/decorators/common.decorator';

@ApiTags('Transactions')
@ApiBearerAuth()
@UseInterceptors(CommonService)
@Controller('transaction')
export class TransactionController {
  private readonly transactionUseCase: TransactionUseCase;

  constructor(
    private readonly transactionService: TransactionService,
    private readonly productService: ProductService,
    private readonly sessionService: SessionService,
    private readonly paymentGatewayService: PaymentGatewayService,
    private readonly gatewayTokenService: GatewayTokenService,
    private readonly transactionsWebsockets: TransactionsWebsockets,
    private readonly configService: ConfigService,
  ) {
    this.transactionUseCase = new TransactionUseCase(
      this.transactionService,
      this.productService,
      this.sessionService,
      this.paymentGatewayService,
      this.gatewayTokenService,
      this.transactionsWebsockets,
      this.configService,
    );
  }

  @Post('payment')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @UseGuards(LoggedAuthGuard)
  @UseGuards(ValidateTokenGuard)
  @ApiOperation({
    summary: 'Generar una transacción',
    description: 'Este servicio toma los productos y el monto para luego generar una transacción.',
    tags: ['Transactions'],
  })
  @DApiResponseCase({
    statusCode: HttpStatus.OK,
    description: 'Payment created successfully!',
    dataDto: CreatePaymentDto,
  })
  @DApiResponseCase({
    statusCode: HttpStatus.BAD_REQUEST,
    description: 'El producto no tiene existencias o stock suficiente',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', enum: [HttpStatus.BAD_REQUEST] },
        message: {
          type: 'string',
          enum: ['Product out of stock!'],
        },
      },
    },
  })
  async createPayment(
    @Body() body: CreatePaymentDto,
    @Req() req: IHeaderUserTokenData,
  ): Promise<ApiResponseCase<ICreatePaymentResponse>> {
    try {
      const transactionId = await this.transactionUseCase.createPayment(req.user.data.id, {
        products: body.products,
        tokenId: body.tokenId,
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
  @UseGuards(JwtAuthGuard)
  @UseGuards(LoggedAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Tokeniza una tarjeta',
    description: 'Este servicio obtiene los datos de una tarjeta y la tokeniza.',
    tags: ['Transactions'],
  })
  @DApiResponseCase({
    statusCode: HttpStatus.OK,
    description: 'Tarjeta tokenizada correctamente!',
    dataDto: CardTokenizeDto,
  })
  async cardTokenize(
    @Body() body: CardTokenizeDto,
    @Req() req: IHeaderUserTokenData,
  ): Promise<ApiResponseCase<ICardTokenizationResponse>> {
    try {
      const cardTokenized = await this.transactionUseCase.cardTokenization(req.user.data.id, {
        cardHolder: body.cardHolder,
        cvc: body.cvc,
        expMonth: body.expMonth,
        expYear: body.expYear,
        number: body.number,
      });

      return {
        message: 'Card tokenized successfully!',
        data: cardTokenized,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Actualiza una transacción',
    description: 'Este servicio actualizará una transacción mediante un webhook.',
    tags: ['Transactions'],
  })
  @ApiBody({
    type: GatewayEventDto,
  })
  @DApiResponseCase({
    statusCode: HttpStatus.OK,
    description: '¡Trasacción actualizada correctamente!',
    dataDto: UpdateTransactionDto,
  })
  async webHookTransaction(
    @Body() body: IGatewayEvent,
    @Headers() headers: IGatewayEventHeaders,
  ): Promise<ApiResponseCase<IUpdateTransactionResponse>> {
    try {
      const response = await this.transactionUseCase.webHookTransaction(headers['x-event-checksum'], {
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
      console.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/config')
  @UseGuards(JwtAuthGuard)
  @UseGuards(LoggedAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Configuración de una transacción',
    description: 'Este servicio obtendrá la configuración de una transacción.',
    tags: ['Transactions'],
  })
  @DApiResponseCase({
    statusCode: HttpStatus.OK,
    description: '¡Configuración de transacción encontrada correctamente!',
    dataDto: GetTransactionConfigDto,
  })
  @DApiResponseCase({
    statusCode: HttpStatus.BAD_REQUEST,
    description: '¡Configuración de transacción no encontrada!',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', enum: [HttpStatus.BAD_REQUEST] },
        message: {
          type: 'string',
          enum: ['Transaction config not found!'],
        },
      },
    },
  })
  async getTransactionConfig(): Promise<ApiResponseCase<IGetTransactionConfig>> {
    try {
      const config = await this.transactionUseCase.getTransactionConfig();

      return {
        message: 'Transaction config found successfully!',
        data: config,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  @UseGuards(LoggedAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtiene una transacción por id',
    description: 'Este servicio obtiene la información de una transacción por id',
    tags: ['Transactions'],
  })
  @DApiResponseCase({
    statusCode: HttpStatus.OK,
    description: '¡Transacción encontrada correctamente!',
    dataDto: TransactionByIdResponseDto,
  })
  @DApiResponseCase({
    statusCode: HttpStatus.BAD_REQUEST,
    description: '¡Transacción no encontrada!',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', enum: [HttpStatus.BAD_REQUEST] },
        message: {
          type: 'string',
          enum: ['Transaction not found!'],
        },
      },
    },
  })
  async getTransactionByid(
    @Param() param: paramsWithUUIDDto,
    @Req() req: IHeaderUserTokenData,
  ): Promise<ApiResponseCase<ITransactionByIdResponse>> {
    try {
      const transaction = await this.transactionUseCase.getTransactionById(req.user.data.id, param.id);

      return {
        message: 'Transaction found successfully!',
        data: {
          amount: transaction.amount,
          status: transaction.status,
        },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
