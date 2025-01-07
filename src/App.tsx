import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Pricing from './pages/Pricing';
import LegalMentions from './pages/legal/LegalMentions';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import Terms from './pages/legal/Terms';
import CookiesPolicy from './pages/legal/CookiesPolicy';
import FAQ from './pages/help/FAQ';
import Contact from './pages/help/Contact';
import About from './pages/About';
import ProtectedRoute from './components/ProtectedRoute';
import StructuredData from './components/StructuredData';
import BreadcrumbSchema from './components/BreadcrumbSchema';
import LocalBusiness from './components/LocalBusiness';
import { setupPerformanceOptimizations } from './utils/performance.utils';
import SEOProvider from './components/SEOProvider';

const App: React.FC = () => {
  useEffect(() => {
    const { lazyLoadImages, preloadCriticalAssets } = setupPerformanceOptimizations();
    
    preloadCriticalAssets([
      '/fonts/inter-var.woff2',
      '/css/critical.css'
    ]);

    lazyLoadImages();
  }, []);

  return (
    <HelmetProvider>
      <Router>
        <SEOProvider>
          <div className="min-h-screen flex flex-col">
            <LocalBusiness />
            <BreadcrumbSchema />
            <Navbar />
            <main className="flex-grow">
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/legal/mentions" element={<LegalMentions />} />
                  <Route path="/legal/privacy" element={<PrivacyPolicy />} />
                  <Route path="/legal/terms" element={<Terms />} />
                  <Route path="/legal/cookies" element={<CookiesPolicy />} />
                  <Route path="/help/faq" element={<FAQ />} />
                  <Route path="/help/contact" element={<Contact />} />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </Suspense>
            </main>
            <Footer />
            <Toaster position="top-right" />
          </div>
        </SEOProvider>
      </Router>
    </HelmetProvider>
  );
};

export default App;