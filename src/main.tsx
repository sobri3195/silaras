import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from '@/app/router';
import { queryClient } from '@/lib/query-client';
import { reportEngineStorage } from '@/services/report-engine-storage';
import '@/styles/globals.css';

reportEngineStorage.init();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
