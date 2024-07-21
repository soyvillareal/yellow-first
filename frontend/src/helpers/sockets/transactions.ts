import io from 'socket.io-client';

import env from '@helpers/env';
import { getJWT } from '@helpers/constants';

import { ISubscribeToTransactionUpdates } from './sockets.types';

const socket = io(env.VITE_APP_BASE_SOCKET_URL, {
  extraHeaders: {
    Authorization: `Bearer ${getJWT()}`,
  },
});

export const subscribeToTransactionUpdates = (
  callback: (data: ISubscribeToTransactionUpdates) => void,
) => {
  socket.on('transactionUpdate', (data) => {
    callback(data);
  });
};
