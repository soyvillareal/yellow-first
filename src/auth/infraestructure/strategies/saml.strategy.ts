// saml.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import fs from 'fs';
import path from 'path';
import { SamlConfig, Strategy } from 'passport-saml';
import { Request as ExpressRequest } from 'express';

interface RequestWithSaml extends ExpressRequest {
  samlLogoutRequest: any;
}

@Injectable()
export class SamlStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const spOptions: SamlConfig = {
      callbackUrl: 'http://localhost:4001/callback',
      entryPoint: 'http://localhost:3000',
      logoutUrl: 'http://localhost:3000/logout',
      cert: fs.readFileSync(path.join(__dirname, '../../../../../keys/cert.pem'), 'utf-8'),
      decryptionPvk: fs.readFileSync(path.join(__dirname, '../../../../../keys/key.pem'), 'utf-8'),
      privateKey: fs.readFileSync(path.join(__dirname, '../../../../../keys/key.pem'), 'utf-8'),
      digestAlgorithm: 'sha256',
      signatureAlgorithm: 'sha256',
      issuer: 'http://localhost:4001',
      validateInResponseTo: false,
      requestIdExpirationPeriodMs: 28800000, // 8 hours
    };
    super(spOptions);
  }

  async validate(payload: any) {
    // Aquí puedes validar el payload del SAML Response
    // Por ejemplo, podrías buscar al usuario en tu base de datos

    return payload;
  }

  logout(req: RequestWithSaml, callback: (err: Error, url?: string) => void): void {
    super.logout(req, callback);
  }
}
