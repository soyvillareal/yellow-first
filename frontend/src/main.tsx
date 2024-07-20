import { StrictMode as ReactStrictMode } from 'react';
import { Provider } from 'react-redux';
import * as ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter } from 'react-router-dom';

import { setupStore } from '@helpers/store';
import App from 'App';

import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ReactStrictMode>
    <Provider store={setupStore()}>
      <BrowserRouter>
        <Toaster position="top-right" reverseOrder={false} />
        <App />
      </BrowserRouter>
    </Provider>
  </ReactStrictMode>,
);
