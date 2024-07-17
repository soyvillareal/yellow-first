import { Request } from 'express';

import { IPageMetaParameters, IPageMetaResponse } from '../domain/entities/common.entity';

export class CommonUseCase {
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
}
