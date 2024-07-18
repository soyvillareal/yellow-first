import { IGatewayTokenEntity, TCreateGatewayToken, TGetLastTokenById } from '../entities/token.entity';

export interface gatewayTokenRepository {
  createToken: (payload: TCreateGatewayToken) => Promise<IGatewayTokenEntity | null>;
  getLastTokenByUserId: (userId: string) => Promise<TGetLastTokenById | undefined | null>;
}
