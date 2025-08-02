// Inject the content extraction functionality into the page
(function() {
  // Import the ContentExtractor
  window.extractProductInfo = function() {
    // Simplified version of ContentExtractor for content script
    const getProductTitle = () => {
      const titleSelectors = [
        'h1[data-automation-id="product-title"]',
        '#productTitle',
        '.product-title',
        'h1',
        '.pdp-product-name'
      ];

      for (const selector of titleSelectors) {
        const element = document.querySelector(selector);
        if (element) {
          return element.textContent.trim();
        }
      }
      return document.title;
    };

    const getBrand = () => {
      // Simplified brand detection
      const url = window.location.href;
      if (url.includes('amazon.')) {
        const brandElement = document.querySelector('#bylineInfo, .a-link-normal[data-attribute*="brand"]');
        return brandElement ? brandElement.textContent.trim() : 'Unknown Brand';
      }
      
      if (url.includes('nike.com')) return 'Nike';
      if (url.includes('adidas.')) return 'Adidas';
      if (url.includes('zara.com')) return 'Zara';
      
      return 'Unknown Brand';
    };

    return {
      title: getProductTitle(),
      brand: getBrand(),
      url: window.location.href,
      timestamp: new Date().toISOString()
    };
  };
})();

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractProductInfo') {
    const productInfo = window.extractProductInfo();
    sendResponse(productInfo);
  }
});
