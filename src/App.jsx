// src/App.jsx
import React, { useState, useEffect } from 'react';
import BrandSummary from './components/BrandSummary';
import ChatInterface from './components/ChatInterface';
import { ContentExtractor } from './utils/contentExtractor';
import { OpenAIClient } from './utils/openaiClient';

const App = () => {
  const [productInfo, setProductInfo] = useState(null);
  const [brandAnalysis, setBrandAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [openaiClient, setOpenaiClient] = useState(null);

  useEffect(() => {
    initializeApp();
    // eslint-disable-next-line
  }, []);

  const initializeApp = async () => {
    // Get API key from Chrome storage
    const result = await chrome.storage.sync.get(['openaiApiKey']);
    if (result.openaiApiKey) {
      setOpenaiClient(new OpenAIClient(result.openaiApiKey));
      analyzeCurrentPage();
    } else {
      promptForApiKey();
    }
  };

  const promptForApiKey = () => {
    const apiKey = prompt('Please enter your OpenAI API key:');
    if (apiKey) {
      chrome.storage.sync.set({ openaiApiKey: apiKey });
      setOpenaiClient(new OpenAIClient(apiKey));
      analyzeCurrentPage();
    }
  };

  const analyzeCurrentPage = async () => {
    setIsLoading(true);

    try {
      // Get current tab info
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      // Inject content script to extract product info
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: () => {
          // This is executed in the context of the page
          return window.extractProductInfo();
        }
      });

      const productData = results[0].result;
      setProductInfo(productData);

      if (productData.brand && openaiClient) {
        const analysis = await openaiClient.analyzeBrand(productData.brand, productData);
        setBrandAnalysis(analysis);
      }
    } catch (error) {
      console.error('Error analyzing page:', error);
    }

    setIsLoading(false);
  };

  const handleAskQuestion = async (question) => {
    if (!openaiClient || !brandAnalysis) return;
    return await openaiClient.answerQuestion(question, productInfo.brand, brandAnalysis);
  };

  if (!productInfo) {
    return (
      <div className="app loading">
        <div className="loading-message">
          <h2 style={{ color: 'green' }}>EcoMind Popup Loaded!</h2>
          <p>Analyzing current page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="app-header">
        <h2>EcoMind – AI Shopping Companion</h2>
        <p className="product-title">{productInfo.title}</p>
      </div>

      <BrandSummary
        brandName={productInfo.brand}
        analysis={brandAnalysis}
        isLoading={isLoading}
      />

      {brandAnalysis && (
        <ChatInterface
          onAskQuestion={handleAskQuestion}
          brandName={productInfo.brand}
        />
      )}
    </div>
  );
};

export default App;

// ---- Mount the App to the DOM ----
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
