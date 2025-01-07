export const generateCanonicalUrl = (path: string): string => {
  const baseUrl = 'https://mathsolver.fr';
  return `${baseUrl}${path}`;
};

export const generateMetaTitle = (title: string): string => {
  const siteName = 'MathSolver';
  return `${title} | ${siteName}`;
};

export const generateMetaDescription = (description: string): string => {
  // Limiter la description à 155-160 caractères pour Google
  return description.length > 155 ? description.substring(0, 155) + '...' : description;
};

export const generateKeywords = (keywords: string[]): string => {
  return keywords.join(', ').toLowerCase();
};