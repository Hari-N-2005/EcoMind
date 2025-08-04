console.log("Content script loaded.");

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

    console.log("Found brand:", brand);
    console.log("Found title:", productTitle);

    sendResponse({ brand, productTitle });
  }
});
