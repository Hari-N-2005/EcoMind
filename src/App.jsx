import { useState } from 'react';
import './App.css';
import { analyzeProduct } from './gemini';
import logo from '/icons/icon16.png';

function Header() {
  return (
    <header className="header-bar">
      <img src={logo} alt="EcoMind Logo" className="header-logo" />
      <span className="header-title">EcoMind</span>
    </header>
  );
}

function App() {
  const [scannedData, setScannedData] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleScan = () => {
    setIsLoading(true);
    setAnalysis(null);
    setScannedData(null);

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id;
      chrome.scripting.executeScript(
        {
          target: { tabId: tabId },
          files: ['content.js'],
        },
        () => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
            setScannedData({ brand: 'Error', productTitle: 'Could not inject script. Please refresh the page and try again.' });
            setIsLoading(false);
            return;
          }
          chrome.tabs.sendMessage(tabId, { type: "scan" }, async (response) => {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError.message);
              setScannedData({ brand: 'Error', productTitle: 'Could not connect to the page. Please refresh the page and try again.' });
              setIsLoading(false);
            } else {
              setScannedData(response);
              const result = await analyzeProduct(response);
              setAnalysis(result);
              setIsLoading(false);
            }
          });
        }
      );
    });
  };

  return (
    <div className="app">
      <Header />
      <main>
        <div className="container">
          <p>Scan the page for products</p>
          <button className="scan-button" onClick={handleScan} disabled={isLoading}>
            {isLoading ? 'Analyzing...' : 'Scan Page'}
          </button>
          {isLoading && <div className="loader"></div>}
          {analysis && !analysis.error && (
            <div className="results">
              <h3>Analysis Results:</h3>
              <div className="score">
                <strong>Product Quality:</strong> {analysis.productquality.score}/10
                <p>{analysis.productquality.summary}</p>
              </div>
              <div className="score">
                <strong>Value for Money:</strong> {analysis.valueformoney.score}/10
                <p>{analysis.valueformoney.summary}</p>
              </div>
              <div className="score">
                <strong>Customer Satisfaction:</strong> {analysis.customersatisfaction.score}/10
                <p>{analysis.customersatisfaction.summary}</p>
              </div>
              <div className="score">
                <strong>Ease of Use:</strong> {analysis.easeofuse.score}/10
                <p>{analysis.easeofuse.summary}</p>
              </div>
              <div className="score">
                <strong>Delivery and Packaging:</strong> {analysis.deliveryandpackaging.score}/10
                <p>{analysis.deliveryandpackaging.summary}</p>
              </div>
            </div>
          )}
          {analysis && analysis.error && (
            <div className="error">
              <p>{analysis.error}</p>
            </div>
          )}
          {scannedData && !isLoading && (
            <div className="scanned-data">
              <h4>Scanned Data:</h4>
              <p><strong>Brand:</strong> {scannedData.brand}</p>
              <p><strong>Title:</strong> {scannedData.productTitle}</p>
              <h5>Reviews:</h5>
              <ul>
                {scannedData.reviews && scannedData.reviews.map((review, index) => (
                  <li key={index}>{review}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;

// ADDED HEADER AND BORDER< BUT BUGGY. FIX IT