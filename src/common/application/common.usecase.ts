import { Request } from 'express';
import crypto from 'crypto';

import { config } from 'src/framework/application/config';
import { IGenerateSignature, IPageMetaParameters, IPageMetaResponse } from '../domain/entities/common.entity';
import { ConfigService } from '@nestjs/config';

export class CommonUseCase {
  constructor(private readonly configRepository: ConfigService<typeof config>) {}

  public getSkipped(page: number, limit: number): number {
    return (page - 1) * limit;
  }

  public pageMeta<T>(data: T, meta: IPageMetaParameters): IPageMetaResponse<T> {
    const pageCount = Math.ceil(meta.itemCount / meta.pageOptions.limit);
    return {
      content: data,
      meta: {
        page: meta.pageOptions.page,
        limit: meta.pageOptions.limit,
        itemCount: meta.itemCount,
        pageCount: pageCount,
        hasPreviousPage: meta.pageOptions.page > 1,
        hasNextPage: meta.pageOptions.page < pageCount,
      },
    };
  }

  public extractJWTToken(req: Request): string | undefined {
    return req.headers.authorization?.split(' ')[1];
  }

  public indexBy = <T>(array: T[], key: string): Record<typeof key, T> => {
    return array.reduce((acc, item) => {
      acc[item[key]] = item;
      return acc;
    }, {});
  };

  public async generateSignature({ reference, amountInCents, currency }: IGenerateSignature): Promise<string> {
    const integrityKey = this.configRepository.get<string>('config.integrity_key', {
      infer: true,
    });

    const cadenaConcatenada = reference + amountInCents + currency + integrityKey;

    const encondedText = new TextEncoder().encode(cadenaConcatenada);
    const hashBuffer = await crypto.subtle.digest('SHA-256', encondedText);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

    return hashHex;
  }

  public createReference(min: number, max: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    const length = Math.floor(Math.random() * (max - min + 1) + min);
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
