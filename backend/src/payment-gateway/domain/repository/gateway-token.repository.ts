import { IGatewayTokenEntity, TCreateGatewayToken, TGetLastTokenById } from '../entities/gateway-token.entity';

export interface gatewayTokenRepository {
  createToken: (payload: TCreateGatewayToken) => Promise<IGatewayTokenEntity | null>;
  getTokenById: (tokenId: string) => Promise<TGetLastTokenById | undefined | null>;
  tokenExists: (tokenId: string) => Promise<boolean | null>;
}
