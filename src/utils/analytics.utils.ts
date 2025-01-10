import { SEO_CONFIG } from '../config/seo.config';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const initAnalytics = () => {
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${SEO_CONFIG.analytics.googleAnalyticsId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }
  gtag('js', new Date());
  gtag('config', SEO_CONFIG.analytics.googleAnalyticsId, {
    send_page_view: false // Désactivé car nous gérons les pages vues manuellement
  });
};

export const trackPageView = (path: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: document.title,
    page_location: window.location.href
  });
};

export const trackEvent = (category: string, action: string, label?: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label
  });
};
