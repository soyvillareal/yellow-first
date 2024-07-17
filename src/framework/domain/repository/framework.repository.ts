import { Observable } from 'rxjs';
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';

import { IGenerateLog, IResponseApi } from '../entities/framework.entity';

export interface frameworkRepository<T> extends NestInterceptor<T, IResponseApi<T>> {
  generateLog: (data: IGenerateLog) => Promise<void>;

  intercept: (context: ExecutionContext, next: CallHandler) => Observable<IResponseApi<T>>;
}
