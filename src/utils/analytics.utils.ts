import { SEO_CONFIG } from '../config/seo.config';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const initAnalytics = () => {
  // Google Analytics
  const gaScript = document.createElement('script');
  gaScript.async = true;
  gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${SEO_CONFIG.analytics.googleAnalyticsId}`;
  document.head.appendChild(gaScript);

  // Google Ads
  const gadsScript = document.createElement('script');
  gadsScript.async = true;
  gadsScript.src = "https://www.googletagmanager.com/gtag/js?id=AW-10826322526";
  document.head.appendChild(gadsScript);

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }
  gtag('js', new Date());
  
  // Configuration Google Analytics
  gtag('config', SEO_CONFIG.analytics.googleAnalyticsId, {
    send_page_view: false
  });
  
  // Configuration Google Ads
  gtag('config', 'AW-10826322526');
};

export const trackPageView = (path: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: document.title,
    page_location: window.location.href
  });

  // Conversion pour les vues de page
  window.gtag('event', 'conversion', {
    'send_to': 'AW-10826322526/2rpuCOLT_IIaEN6ksqoo',
    'value': 1.0,
    'currency': 'EUR'
  });
};

export const trackEvent = (category: string, action: string, label?: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label
  });
};
