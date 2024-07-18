import { Body, Controller, HttpCode, HttpException, HttpStatus, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/framework/infrastructure/guards/jwt.guard';

import { ApiResponseCase, IHeaderUserTokenData } from 'src/framework/domain/entities/framework.entity';
import { FrameworkService } from 'src/framework/infrastructure/services/framework.service';
import { PaymentGatewayService } from 'src/payment-gateway/infrastructure/services/payment-gateway.service';
import { ProductService } from 'src/product/infrastructure/services/product.service';
import { UsersService } from 'src/users/infrastructure/services/users.service';
import { ICardTokenizationResponse, ITransactionResponse } from 'src/inventory/domain/entities/inventory.entity';

import { InventoryService } from '../services/inventory.service';
import { InventoryUseCase } from '../../application/inventory.usecase';
import { CardTokenizeDto, CreateTransactionDto } from '../dtos/inventory.dto';

@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(FrameworkService)
@Controller('inventory')
export class InventoryController {
  private readonly inventoryUseCase: InventoryUseCase;

  constructor(
    private readonly inventoryService: InventoryService,
    private readonly productService: ProductService,
    private readonly userService: UsersService,
    private readonly paymentGatewayService: PaymentGatewayService,
  ) {
    this.inventoryUseCase = new InventoryUseCase(
      this.inventoryService,
      this.productService,
      this.userService,
      this.paymentGatewayService,
    );
  }

  @Post('transaction')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Crea una transacción',
    description: 'Este servicio creará una transacción.',
    tags: ['Transactions'],
  })
  async createTransaction(
    @Body() body: CreateTransactionDto,
    @Req() req: IHeaderUserTokenData,
  ): Promise<ApiResponseCase<ITransactionResponse>> {
    try {
      const { transactionId } = await this.inventoryUseCase.transaction(req.user.userId, {
        paymentSourceId: body.paymentSourceId,
        productId: body.productId,
        signature: body.signature,
      });

      return {
        message: 'Transaction created successfully!',
        data: {
          transactionId,
        },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('transaction')
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
      const { tokenId } = await this.inventoryUseCase.cardTokenization(req.user.userId, {
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
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
