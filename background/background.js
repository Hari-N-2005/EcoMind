import { OpenAIClient } from '../src/utils/openaiClient';

chrome.runtime.onInstalled.addListener(() => {
  console.log('AI Shopping Companion installed');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyzeProduct') {
    handleProductAnalysis(request.data)
      .then(response => sendResponse({ success: true, data: response }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Indicates asynchronous response
  }
});

async function handleProductAnalysis(productData) {
  const cacheKey = `analysis_${productData.brand}`;
  const result = await chrome.storage.local.get([cacheKey]);

  if (result[cacheKey]) {
    const cachedData = result[cacheKey];
    const isRecent = (Date.now() - cachedData.timestamp) < 24 * 60 * 60 * 1000; // 24 hours
    if (isRecent) {
      console.log('Returning cached analysis for', productData.brand);
      return cachedData.analysis;
    }
  }

  console.log('Fetching new analysis for', productData.brand);
  const { openaiApiKey } = await chrome.storage.sync.get(['openaiApiKey']);
  if (!openaiApiKey) {
    throw new Error('OpenAI API key not found.');
  }

  const openaiClient = new OpenAIClient(openaiApiKey);
  const analysis = await openaiClient.analyzeBrand(productData.brand, productData);

  // Cache the new analysis
  await chrome.storage.local.set({
    [cacheKey]: {
      analysis,
      timestamp: Date.now(),
    },
  });

  return analysis;
}
