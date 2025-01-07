import React from 'react';
import StructuredData from './StructuredData';

const LocalBusiness: React.FC = () => {
  const businessData = {
    '@type': 'EducationalOrganization',
    name: 'MathSolver',
    description: 'Service de résolution de problèmes mathématiques en ligne',
    url: 'https://mathsolver.fr',
    telephone: '+33123456789',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Rue des Mathématiques',
      addressLocality: 'Paris',
      postalCode: '75000',
      addressCountry: 'FR'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '48.8566',
      longitude: '2.3522'
    }
  };

  return <StructuredData type="Organization" data={businessData} />;
};

export default LocalBusiness;