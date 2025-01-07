import React from 'react';
import { useLocation } from 'react-router-dom';
import StructuredData from './StructuredData';

const BreadcrumbSchema: React.FC = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  const breadcrumbList = {
    '@type': 'BreadcrumbList',
    itemListElement: pathSegments.map((segment, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@id': `https://mathsolver.fr/${pathSegments.slice(0, index + 1).join('/')}`,
        name: segment.charAt(0).toUpperCase() + segment.slice(1)
      }
    }))
  };

  return <StructuredData type="BreadcrumbList" data={breadcrumbList} />;
};

export default BreadcrumbSchema;