import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class SamlAuthGuard extends AuthGuard('saml') {
  handleRequest<IUser>(err: any | undefined, user: IUser) {
    // , _info: any, _context: ExecutionContext, _status?: any
    // Puedes agregar lógica personalizada aquí
    if (err?.code === 'ERR_OSSL_RSA_OAEP_DECODING_ERROR') {
      throw new UnauthorizedException('Error decoding response from authentication server');
    }
    if (err || !user) {
      throw new UnauthorizedException('You are not allowed to access this resource');
    }

    return user;
  }

  // Sobreescribe el método logIn para almacenar el nameID y el nameIDFormat en la sesión
  logIn(req: any): Promise<void> {
    return new Promise((resolve, reject) => {
      req.logIn((err, user) => {
        // , _info
        if (err) reject(err);
        // Almacena el nameID y el nameIDFormat en la sesión
        (req as any).user = user;
        resolve();
      });
    });
  }
}
