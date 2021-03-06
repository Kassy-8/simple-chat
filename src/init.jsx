// @ts-check

import React from 'react';
import { Provider } from 'react-redux';
import i18n from 'i18next';
import { initReactI18next, I18nextProvider } from 'react-i18next';
import {
  Provider as RollbarProvider,
  ErrorBoundary,
  LEVEL_WARN,
} from '@rollbar/react';
import { io } from 'socket.io-client';
import '../assets/application.scss';

import initSocketAPI from './initSocketAPI';
import store from './store';
import App from './App.jsx';
import ErrorBoundaryPage from './pages/ErrorBoundaryPage.jsx';
import webSocketContext from './contexts/webSocketContext.js';
import translation from './assets/locale/ruLocale.js';

const init = async (socket = io()) => {
  const socketAPI = initSocketAPI(socket, store);

  const i18nInstance = i18n.createInstance();
  await i18nInstance.use(initReactI18next).init({
    lng: 'ru',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      ru: translation,
    },
  });

  const rollbarConfig = {
    accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
    enabled: process.env.NODE_ENV === 'production',
    environment: 'production',
    captureUncaught: true,
    captureUnhandledRejections: true,
  };

  return (
    <I18nextProvider i18n={i18nInstance}>
      <RollbarProvider config={rollbarConfig}>
        <ErrorBoundary level={LEVEL_WARN} fallbackUI={ErrorBoundaryPage}>
          <webSocketContext.Provider value={socketAPI}>
            <Provider store={store}>
              <App />
            </Provider>
          </webSocketContext.Provider>
        </ErrorBoundary>
      </RollbarProvider>
    </I18nextProvider>
  );
};

export default init;
