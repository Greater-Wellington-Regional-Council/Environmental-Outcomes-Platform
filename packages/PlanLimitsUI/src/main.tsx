import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { atomsWithQuery, queryClientAtom } from 'jotai-tanstack-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import App from './App';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider } from 'jotai';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider initialValues={[[queryClientAtom, queryClient]]}>
        <App />
      </Provider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
