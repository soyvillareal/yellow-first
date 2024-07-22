import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { isEmpty } from 'class-validator';

import { TWebhookLeadResponse } from 'src/product/domain/entities/product.entity';
import { LogsService } from 'src/logs/infrastructure/services/logs.service';
import { IGenerateLog, IResponseApi } from 'src/common/domain/entities/common.entity';
import { commonRepository } from 'src/common/domain/repository/common.repository';
import { ELogPriority } from 'src/logs/domain/entities/logs.entity';

@Injectable()
export class CommonService<T> implements commonRepository<T> {
  constructor(private readonly logsService: LogsService) {}

  public generateLog = async ({ statusCode, request, response, webhookData, forcePriority }: IGenerateLog): Promise<void> => {
    try {
      let priority = forcePriority || ELogPriority.CRITICAL;

      if (isEmpty(forcePriority) === true) {
        if (statusCode >= HttpStatus.CONTINUE && statusCode < HttpStatus.NON_AUTHORITATIVE_INFORMATION) {
          priority = ELogPriority.LOW;
        } else if (statusCode >= HttpStatus.NON_AUTHORITATIVE_INFORMATION && statusCode < HttpStatus.AMBIGUOUS) {
          priority = ELogPriority.MEDIUM;
        } else if (statusCode >= HttpStatus.BAD_REQUEST && statusCode < HttpStatus.INTERNAL_SERVER_ERROR) {
          priority = ELogPriority.HIGH;
        }
      }

      const logData = await this.logsService.createLog({
        userId: request?.user?.data?.id || null,
        request: {
          headers: request.headers,
          body: request.body,
          query: request.query,
          params: request.params,
          method: request.method,
          url: request.url,
          cookies: request.cookies,
          baseUrl: request.baseUrl,
          hostname: request.hostname,
          httpVersion: request.httpVersion,
          httpVersionMajor: request.httpVersionMajor,
          httpVersionMinor: request.httpVersionMinor,
          protocol: request.protocol,
          originalUrl: request.originalUrl,
          accepts: request.accepts,
          ip: request.ip,
          ips: request.ips,
          app: request.app,
          accepted: request.accepted,
          closed: request.closed,
          complete: request.complete,
          errored: request.errored,
          fresh: request.fresh,
          next: request.next,
          path: request.path,
          secure: request.secure,
          destroyed: request.destroyed,
          route: request.route,
        },
        response,
        priority,
      });

      if (webhookData !== undefined && webhookData !== null) {
        await this.logsService.createWebHookLog({
          logId: logData.id,
          request: webhookData.request,
          type: webhookData.type,
          response: webhookData.response,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  intercept(context: ExecutionContext, next: CallHandler): Observable<IResponseApi<T>> {
    return next.handle().pipe(
      catchError((err) => {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        let status = 500; // Status code by default
        if (err instanceof HttpException) {
          status = err.getStatus();
        }

        let message = err.message || 'Internal Server Error'; // Message by default
        if (err.response?.message) {
          message = err.response.message;
        }

        const errorResponse: IResponseApi = {
          statusCode: status,
          message: message,
        };

        return from(
          this.generateLog({
            statusCode: status,
            request,
            response: errorResponse,
          }).then(() => {
            throw errorResponse;
          }),
        );
      }),
      mergeMap(async (items) => {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();

        let webhookData: TWebhookLeadResponse = null;

        if (request?.hasOwnProperty('webhookData') === true) {
          webhookData = request.webhookData;
        }

        await this.generateLog({
          statusCode: response.statusCode,
          request,
          response: items.data,
          webhookData,
        });

        return {
          statusCode: response.statusCode,
          reqId: request.reqId,
          message: items.message,
          data: items?.data,
        };
      }),
    );
  }
}
