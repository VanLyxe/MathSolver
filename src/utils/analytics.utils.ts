import { SEO_CONFIG } from '../config/seo.config';

export const initAnalytics = () => {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }
  gtag('js', new Date());
  gtag('config', SEO_CONFIG.analytics.googleAnalyticsId);
};

export const trackPageView = (path: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: document.title
  });
};

export const trackEvent = (category: string, action: string, label?: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label
  });
};