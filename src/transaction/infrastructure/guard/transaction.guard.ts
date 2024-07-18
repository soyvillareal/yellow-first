import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { IHeaderUserTokenData } from 'src/framework/domain/entities/framework.entity';
import { GatewayTokenService } from 'src/payment-gateway/infrastructure/services/token.service';
import { TransactionService } from '../services/transaction.service';

@Injectable()
export class ValidateTokenGuard implements CanActivate {
  constructor(
    private readonly gatewayTokenService: GatewayTokenService,
    private readonly transactionService: TransactionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<IHeaderUserTokenData>();
    const userId = request.user.userId;

    const lastTokenId = await this.gatewayTokenService.lastTokenIdByUserId(userId);

    if (lastTokenId === null || lastTokenId === undefined) {
      throw new UnauthorizedException("You can't make a payment without a card token.");
    }

    const tokenExistsInTransaction = await this.transactionService.tokenExistsInTransaction(lastTokenId);

    if (tokenExistsInTransaction === true) {
      throw new UnauthorizedException("You can't make a payment without a card token.");
    }

    return true;
  }
}
