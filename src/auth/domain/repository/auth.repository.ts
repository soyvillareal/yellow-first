import { RequestWithUser } from 'passport-saml/lib/passport-saml/types';

export interface authRepository {
  logout(req: RequestWithUser, callback: (err: Error, url?: string) => void): void;
}
