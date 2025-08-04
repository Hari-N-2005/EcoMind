console.log("Content script loaded.");

const extractReviews = () => {
  const reviewElements = document.querySelectorAll('[data-hook="review-body"], .review-text, .review-content, .customer-review');
  const reviews = [];
  reviewElements.forEach(el => {
    if (reviews.length < 5) {
      reviews.push(el.innerText);
    }
  });
  return reviews;
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "scan") {
    console.log("Scanning page for product information...");

    const productTitle = document.title;
    let brand = '';

    // A simple way to find a brand name - this will need to be improved
    const brandElement = document.querySelector('[class*="brand"], [id*="brand"]');
    if (brandElement) {
      brand = brandElement.innerText;
    } else {
      // Fallback to hostname
      brand = window.location.hostname;
    }

    const reviews = extractReviews();

    console.log("Found brand:", brand);
    console.log("Found title:", productTitle);
    console.log("Found reviews:", reviews);

    sendResponse({ brand, productTitle, reviews });
  }
});
