import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { sendGAEvent } from '../utils/analytics.utils';

export const useSEO = () => {
  const location = useLocation();

  useEffect(() => {
    // Envoyer les événements de page view à GA
    sendGAEvent('page_view', {
      page_path: location.pathname,
      page_title: document.title
    });

    // Mettre à jour les métadonnées de la page
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'MathSolver - Résolution de problèmes mathématiques en ligne avec des solutions détaillées.'
      );
    }
  }, [location]);
};

export default useSEO;