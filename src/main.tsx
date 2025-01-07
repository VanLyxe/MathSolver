import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element');
}

const root = createRoot(rootElement);

// Ajout d'un error boundary global
const ErrorFallback = ({ error }: { error: Error }) => {
  console.error('Application error:', error);
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Une erreur est survenue
        </h2>
        <p className="text-gray-600 mb-4">
          L'application a rencontré une erreur inattendue. Veuillez rafraîchir la page.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Rafraîchir la page
        </button>
      </div>
    </div>
  );
};

try {
  root.render(
    <StrictMode>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <App />
      </ErrorBoundary>
    </StrictMode>
  );
} catch (error) {
  console.error('Render error:', error);
  root.render(<ErrorFallback error={error as Error} />);
}