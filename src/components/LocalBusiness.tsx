import React from 'react';
import StructuredData from './StructuredData';

const LocalBusiness: React.FC = () => {
  const businessData = {
    '@type': 'EducationalOrganization',
    name: 'MathSolver',
    description: 'Service de résolution de problèmes mathématiques en ligne',
    url: 'https://math-solver.xyz',
    telephone: '+33123456789',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '12 Rue du Nord',
      addressLocality: 'Colmar',
      postalCode: '68000',
      addressCountry: 'FR'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '48.0799182',
      longitude: '7.3620216'
    }
  };

  return <StructuredData type="Organization" data={businessData} />;
};

export default LocalBusiness;
