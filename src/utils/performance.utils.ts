export const setupPerformanceOptimizations = () => {
  // Lazy loading des images
  const lazyLoadImages = () => {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || '';
          img.removeAttribute('data-src');
        }
      });
    });
    images.forEach(img => imageObserver.observe(img));
  };

  // Préchargement des ressources critiques
  const preloadCriticalAssets = (assets: string[]) => {
    assets.forEach(asset => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = asset;
      link.as = asset.endsWith('.js') ? 'script' : 'style';
      document.head.appendChild(link);
    });
  };

  return {
    lazyLoadImages,
    preloadCriticalAssets
  };
};