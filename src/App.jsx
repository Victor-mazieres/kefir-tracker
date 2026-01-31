import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import NewBatch from './pages/NewBatch';
import BatchDetails from './pages/BatchDetails';
import Recipes from './pages/Recipes';
import Settings from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="new-batch" element={<NewBatch />} />
          <Route path="batch/:id" element={<BatchDetails />} />
          <Route path="recipes" element={<Recipes />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
