export class BrandDetector {
  static detect(url, pageContent) {
    const brandPatterns = {
      amazon: /amazon\.(com|co\.uk|de|fr|it|es|ca|in)/i,
      nike: /nike\.com/i,
      adidas: /adidas\.(com|co\.uk|de|fr)/i,
      zara: /zara\.com/i,
      hm: /hm\.com/i,
      uniqlo: /uniqlo\.com/i,
      patagonia: /patagonia\.com/i
    };

    // Check URL first
    for (const [brand, pattern] of Object.entries(brandPatterns)) {
      if (pattern.test(url)) {
        return this.extractBrandFromPage(brand, pageContent);
      }
    }

    // Extract from page content
    return this.extractBrandFromContent(pageContent);
  }

  static extractBrandFromPage(siteBrand, content) {
    if (siteBrand === 'amazon') {
      // Extract actual product brand from Amazon page
      const brandSelectors = [
        '#bylineInfo',
        '.a-link-normal[data-attribute*="brand"]',
        '.po-brand .po-break-word'
      ];
      
      for (const selector of brandSelectors) {
        const element = document.querySelector(selector);
        if (element) {
          return element.textContent.trim();
        }
      }
    }

    return siteBrand;
  }

  static extractBrandFromContent(content) {
    // AI-based brand extraction patterns
    const brandIndicators = [
      /brand[:\s]+([A-Za-z\s]+)/i,
      /manufacturer[:\s]+([A-Za-z\s]+)/i,
      /made\sby[:\s]+([A-Za-z\s]+)/i
    ];

    for (const pattern of brandIndicators) {
      const match = content.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    return null;
  }
}
