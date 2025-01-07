import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
    </div>
  );
};

export default LoadingSpinner;