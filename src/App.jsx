import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/Layout';
const Home = lazy(() => import('./pages/Home'));
const NewBatch = lazy(() => import('./pages/NewBatch'));
const BatchDetails = lazy(() => import('./pages/BatchDetails'));
const Bottling = lazy(() => import('./pages/Bottling'));
const Recipes = lazy(() => import('./pages/Recipes'));
const Settings = lazy(() => import('./pages/Settings'));

const LoadingFallback = () => (
  <div className="flex h-[50vh] w-full items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
  </div>
);

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={
              <Suspense fallback={<LoadingFallback />}>
                <Home />
              </Suspense>
            } />
            <Route path="new-batch" element={
              <Suspense fallback={<LoadingFallback />}>
                <NewBatch />
              </Suspense>
            } />
            <Route path="batch/:id" element={
              <Suspense fallback={<LoadingFallback />}>
                <BatchDetails />
              </Suspense>
            } />
            <Route path="batch/:id/bottling" element={
              <Suspense fallback={<LoadingFallback />}>
                <Bottling />
              </Suspense>
            } />
            <Route path="recipes" element={
              <Suspense fallback={<LoadingFallback />}>
                <Recipes />
              </Suspense>
            } />
            <Route path="settings" element={
              <Suspense fallback={<LoadingFallback />}>
                <Settings />
              </Suspense>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
