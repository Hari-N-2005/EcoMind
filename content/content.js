import { ContentExtractor } from '../src/utils/contentExtractor';

// Make the ContentExtractor available in the page context
window.extractProductInfo = function() {
  // Since this function is executed in the page's context,
  // we cannot directly use the imported ContentExtractor.
  // Instead, we need to redefine or inject the logic.
  // For simplicity, we will redefine the necessary parts here.

  // This is a simplified version for injection.
  const getProductTitle = () => {
    const selectors = ['h1', '#productTitle', '.product-title'];
    for (const selector of selectors) {
      const el = document.querySelector(selector);
      if (el) return el.innerText.trim();
    }
    return '';
  };

  const getBrand = () => {
    // A more robust brand detection can be implemented here
    const host = window.location.hostname;
    if (host.includes('amazon')) {
      const brandEl = document.querySelector('#bylineInfo');
      if (brandEl) return brandEl.innerText.replace('Visit the', '').replace('Store', '').trim();
    }
    // Fallback for other sites
    const brandMeta = document.querySelector('meta[property="og:brand"]');
    if (brandMeta) return brandMeta.content;

    return 'Unknown Brand';
  };

  return {
    title: getProductTitle(),
    brand: getBrand(),
    url: window.location.href,
  };
};

// The content script itself doesn't need to listen to messages
// if its only job is to inject a function. The popup will execute it.
console.log('EcoMind content script loaded.');
