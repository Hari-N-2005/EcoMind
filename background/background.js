// Background script for handling extension lifecycle
chrome.runtime.onInstalled.addListener(() => {
  console.log('AI Shopping Companion installed');
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyzeProduct') {
    // Handle product analysis requests
    handleProductAnalysis(request.data)
      .then(response => sendResponse({ success: true, data: response }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    
    return true; // Will respond asynchronously
  }
});

async function handleProductAnalysis(productData) {
  // This could handle caching, rate limiting, etc.
  const result = await chrome.storage.local.get([`analysis_${productData.brand}`]);
  
  if (result[`analysis_${productData.brand}`]) {
    const cachedData = result[`analysis_${productData.brand}`];
    const isRecent = Date.now() - cachedData.timestamp < 24 * 60 * 60 * 1000; // 24 hours
    
    if (isRecent) {
      return cachedData.analysis;
    }
  }
  
  return null; // No cached data or data is stale
}
