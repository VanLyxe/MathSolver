import React from 'react';
import { useSEOTracking } from '../hooks/useSEOTracking';

interface SEOProviderProps {
  children: React.ReactNode;
}

const SEOProvider: React.FC<SEOProviderProps> = ({ children }) => {
  useSEOTracking();
  return <>{children}</>;
};

export default SEOProvider;