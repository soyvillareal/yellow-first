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

  public extractJWTToken(req: Request | string | undefined): string | undefined {
    if (req === undefined) {
      return '';
    }
    if (typeof req === 'string') {
      return req?.split(' ')[1];
    }
    return req.headers.authorization?.split(' ')[1];
  }

  public indexBy = <T>(array: T[], key: string): Record<typeof key, T> => {
    return array.reduce((acc, item) => {
      acc[item[key]] = item;
      return acc;
    }, {});
  };

  public generateSignature({ reference, amountInCents, currency }: IGenerateSignature): string {
    const integrityKey = this.configRepository.get<string>('config.integrity_key', {
      infer: true,
    });

    const concatenatedString = reference + amountInCents + currency + integrityKey;

    const hashHex = crypto.createHash('sha256').update(concatenatedString).digest('hex');

    return hashHex;
  }

  public verifySignature(
    signature: string,
    payload: {
      transaction: {
        id: string;
        status: string;
        amountInCents: number;
      };
      timestamp: number;
    },
  ): boolean {
    const eventsKey = this.configRepository.get<string>('config.events_key', {
      infer: true,
    });

    const concatenatedString =
      payload.transaction.id + payload.transaction.status + payload.transaction.amountInCents + payload.timestamp + eventsKey;

    const hashHex = crypto.createHash('sha256').update(concatenatedString).digest('hex');

    return hashHex === signature;
  }
}
