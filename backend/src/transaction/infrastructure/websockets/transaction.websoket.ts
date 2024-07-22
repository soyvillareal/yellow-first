import { Server, Socket } from 'socket.io';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

import { websocketRepository } from 'src/transaction/domain/repository/transaction.repository';
import { INotifyTransactionUpdate } from 'src/transaction/domain/entities/transaction.entity';
import { CommonUseCase } from 'src/common/application/common.usecase';
import { ConfigService } from '@nestjs/config';
import { TSession } from 'src/session/domain/entities/session.entity';
import { JwtService } from '@nestjs/jwt';
import { SessionService } from 'src/session/infrastructure/services/session.service';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN,
  },
})
export class TransactionsWebsockets implements websocketRepository {
  // WARNING: This is a simple implementation of a Map, but it's not the best way to store data in memory.
  private clients = new Map<string, Array<string>>();

  private readonly commonUseCase: CommonUseCase;

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly sessionService: SessionService,
    private readonly configService: ConfigService,
  ) {
    this.commonUseCase = new CommonUseCase(this.configService);
  }

  async handleConnection(client: Socket) {
    const req = client.handshake?.headers?.authorization;
    const token = this.commonUseCase.extractJWTToken(req);

    if (!token) {
      client.disconnect(true);
    }

    try {
      const payload = await this.jwtService.verifyAsync<TSession>(token, {
        secret: this.configService.get<string>('config.secret_key', {
          infer: true,
        }),
      });

      if (payload?.data !== undefined) {
        if (payload?.data?.id === undefined) {
          client.disconnect(true);
        }

        const foundUser = await this.sessionService.userExistsById(payload.data.id);

        if (foundUser === null) {
          client.disconnect(true);
        }

        if (foundUser === false) {
          client.disconnect(true);
        }
      }

      client.data.user = payload;
      if (payload.data.id) {
        const newClients: string[] = this.clients.get(payload.data.id) || [client.id];
        if (this.clients.has(payload.data.id) === true) {
          newClients.push(client.id);
        }
        this.clients.set(payload.data.id, newClients);
      }
    } catch (error) {
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data?.user?.data?.id;
    const clientId = client.id;
    if (this.clients.has(userId) === true) {
      const clients = this.clients.get(userId);
      if (clients) {
        const newClients = clients.filter((c) => c !== clientId);
        if (newClients.length === 0) {
          this.clients.delete(userId);
        } else {
          this.clients.set(userId, newClients);
        }
      }
    }
  }

  notifyTransactionUpdate(userId: string, data: INotifyTransactionUpdate) {
    const clients = this.clients.get(userId);
    if (clients.length > 0) {
      for (let i = 0; i < clients.length; i++) {
        const client = clients[i];
        this.server.to(client).emit('transactionUpdate', data);
      }
    }
  }
}
