export interface IGatewayTokenEntity {
  id: string;
  userId: string;
  token: string;
  brand: string;
  lastFour: string;
  expMonth: string;
  expYear: string;
  cardHolder: string;
  expiredAt: Date;
  validityEndsAt: Date;
  createdAt: Date;
}

export type TCreateGatewayToken = Pick<
  IGatewayTokenEntity,
  'userId' | 'token' | 'brand' | 'lastFour' | 'expMonth' | 'expYear' | 'cardHolder' | 'expiredAt' | 'validityEndsAt'
>;

export type TGetLastTokenById = Pick<
  IGatewayTokenEntity,
  'id' | 'token' | 'brand' | 'lastFour' | 'expMonth' | 'expYear' | 'cardHolder' | 'expiredAt'
>;
