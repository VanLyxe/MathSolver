import { SEO_CONFIG } from '../config/seo.config';

export const generateTitle = (pageTitle: string): string => 
  `${pageTitle} | ${SEO_CONFIG.siteName}`;

export const generateCanonicalUrl = (path: string): string => 
  `${SEO_CONFIG.baseUrl}${path}`;

export const generateMetaDescription = (description: string): string => 
  description.length > 155 ? `${description.substring(0, 155)}...` : description;

export const generateStructuredData = (type: string, data: Record<string, any>) => ({
  '@context': 'https://schema.org',
  '@type': type,
  ...data
});