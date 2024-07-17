import { Injectable } from '@nestjs/common';
import { RequestWithUser } from 'passport-saml/lib/passport-saml/types';

import { authRepository } from 'src/auth/domain/repository/auth.repository';

import { SamlStrategy } from '../strategies/saml.strategy';

@Injectable()
export class AuthService implements authRepository {
  constructor(private readonly samlStrategy: SamlStrategy) {}

  // En tu servicio de autenticación
  logout(req: RequestWithUser, callback: (err: Error, url: string) => void): void {
    // Asegúrate de que req.user está definido y tiene un nameID y un nameIDFormat
    if (req.user && req.user.nameID && req.user.nameIDFormat) {
      this.samlStrategy.logout(req, callback);
    } else {
      callback(new Error('El usuario no está autenticado'), null);
    }
  }
}
