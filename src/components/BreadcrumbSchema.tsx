import React from 'react';
import { useLocation } from 'react-router-dom';
import StructuredData from './StructuredData';

const BreadcrumbSchema: React.FC = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  const breadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Accueil',
        item: 'https://math-solver.xyz/'
      },
      ...pathSegments.map((segment, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: formatSegmentName(segment),
        item: `https://math-solver.xyz/${pathSegments.slice(0, index + 1).join('/')}`
      }))
    ]
  };

  return <StructuredData type="BreadcrumbList" data={breadcrumbList} />;
};

// Fonction pour formater les noms des segments
const formatSegmentName = (segment: string): string => {
  const names: { [key: string]: string } = {
    'pricing': 'Tarifs',
    'about': 'À propos',
    'help': 'Aide',
    'faq': 'FAQ',
    'contact': 'Contact',
    'legal': 'Mentions légales',
    'privacy': 'Confidentialité',
    'terms': 'CGU',
    'terms-of-sale': 'CGV',
    'cookies': 'Cookies',
    'auth': 'Connexion',
    'profile': 'Profil',
    'dashboard': 'Tableau de bord'
  };

  return names[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
};

export default BreadcrumbSchema;
