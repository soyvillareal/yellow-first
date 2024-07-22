import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { IHeaderUserTokenData } from 'src/common/domain/entities/common.entity';
import { GatewayTokenService } from 'src/payment-gateway/infrastructure/services/gateway-token.service';
import { TransactionService } from '../services/transaction.service';

@Injectable()
export class ValidateTokenGuard implements CanActivate {
  constructor(
    private readonly gatewayTokenService: GatewayTokenService,
    private readonly transactionService: TransactionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<IHeaderUserTokenData>();
    const tokenId = request.body.tokenId;

    const tokenExists = await this.gatewayTokenService.tokenExists(tokenId);

    if (tokenExists === false || tokenExists === null) {
      throw new UnauthorizedException("You can't make a payment without a card token.");
    }

    const tokenExistsInTransaction = await this.transactionService.tokenExistsInTransaction(tokenId);

    if (tokenExistsInTransaction === true) {
      throw new UnauthorizedException("You can't make a payment without a card token.");
    }

    return true;
  }
}
