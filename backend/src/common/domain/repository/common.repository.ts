import { Observable } from 'rxjs';
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';

import { IGenerateLog, IResponseApi } from '../entities/common.entity';

export interface commonRepository<T> extends NestInterceptor<T, IResponseApi<T>> {
  generateLog: (data: IGenerateLog) => Promise<void>;
  intercept: (context: ExecutionContext, next: CallHandler) => Observable<IResponseApi<T>>;
}

export interface configRepository {
  get: <T = string>(key: string, options?: { infer: boolean }) => T;
}
