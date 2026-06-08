/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { BlogPost } from './pages/BlogPost';
import { Features } from './pages/Features';
import { StyleGuide } from './pages/StyleGuide';
import { Tags } from './pages/Tags';
import { Authors } from './pages/Authors';
import { ApiStatus } from './pages/ApiStatus';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';

function AnimatedRoutes() {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/post/:slug" element={<BlogPost />} />
        <Route path="/features" element={<Features />} />
        <Route path="/style-guide" element={<StyleGuide />} />
        <Route path="/tags" element={<Tags />} />
        <Route path="/authors" element={<Authors />} />
        <Route path="/api" element={<ApiStatus />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Layout>
          <AnimatedRoutes />
        </Layout>
        <Toaster theme="dark" position="top-right" />
      </BrowserRouter>
    </HelmetProvider>
  );
}
