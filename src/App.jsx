// src/App.jsx
import React, { useState, useEffect } from 'react';
import BrandSummary from './components/BrandSummary';
import ChatInterface from './components/ChatInterface';
import { ContentExtractor } from './utils/contentExtractor';
import { OpenAIClient } from './utils/openaiClient';

import ApiKeyPrompt from './components/ApiKeyPrompt';

const App = ({ getProductInfo }) => {
  const [productInfo, setProductInfo] = useState(null);
  const [brandAnalysis, setBrandAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openaiClient, setOpenaiClient] = useState(null);
  const [isApiKeyMissing, setIsApiKeyMissing] = useState(false);

  const initializeApp = async () => {
    setIsLoading(true);
    const result = await chrome.storage.sync.get(['openaiApiKey']);
    if (result.openaiApiKey) {
      setIsApiKeyMissing(false);
      setOpenaiClient(new OpenAIClient(result.openaiApiKey));
      getProductInfo((productData) => {
        if (productData.error) {
          setError(productData.error);
        } else {
          setProductInfo(productData);
        }
        setIsLoading(false);
      });
    } else {
      setIsApiKeyMissing(true);
      setIsLoading(false);
    }
  };

  const handleApiKeySubmit = async (apiKey) => {
    await chrome.storage.sync.set({ openaiApiKey: apiKey });
    await initializeApp();
  };

  if (isLoading) {
    return (
      <div className="app loading">
        <p>Loading...</p>
      </div>
    );
  }

  if (isApiKeyMissing) {
    return <ApiKeyPrompt onApiKeySubmit={handleApiKeySubmit} />;
  }

  if (error) {
    return (
      <div className="app error">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!productInfo) {
    return (
      <div className="app loading">
        <p>Waiting for product information...</p>
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
