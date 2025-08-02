export class ContentExtractor {
  static extractProductInfo() {
    const productData = {
      title: this.getProductTitle(),
      brand: this.getBrand(),
      price: this.getPrice(),
      description: this.getDescription(),
      images: this.getProductImages(),
      url: window.location.href
    };

    return productData;
  }

  static getProductTitle() {
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
  }

  static getBrand() {
    return BrandDetector.detect(window.location.href, document.body.textContent);
  }

  static getPrice() {
    const priceSelectors = [
      '.a-price-whole',
      '.price',
      '.product-price',
      '[data-testid="price"]'
    ];

    for (const selector of priceSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        return element.textContent.trim();
      }
    }
    return null;
  }

  static getDescription() {
    const descSelectors = [
      '#feature-bullets ul',
      '.product-description',
      '.pdp-product-description'
    ];

    for (const selector of descSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        return element.textContent.trim().substring(0, 500);
      }
    }
    return null;
  }

  static getProductImages() {
    const images = [];
    const imgElements = document.querySelectorAll('img[src*="product"], img[alt*="product"]');
    
    imgElements.forEach(img => {
      if (img.src && !img.src.includes('data:')) {
        images.push(img.src);
      }
    });

    return images.slice(0, 3); // Limit to 3 images
  }
}
