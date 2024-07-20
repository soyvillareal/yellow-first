import { StrictMode as ReactStrictMode } from 'react';
import { Provider } from 'react-redux';
import * as ReactDOM from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter } from 'react-router-dom';

import { setupStore } from '@helpers/store';
import i18n from '@helpers/i18n';
import App from 'App';

import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ReactStrictMode>
    <Provider store={setupStore()}>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <Toaster position="top-right" reverseOrder={false} />
          <App />
        </BrowserRouter>
      </I18nextProvider>
    </Provider>
  </ReactStrictMode>,
);
