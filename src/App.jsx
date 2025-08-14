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
          {!analysis && <p>Scan the page for products</p>}
          {!analysis && (
            <button className="scan-button" onClick={handleScan} disabled={isLoading}>
              {isLoading ? 'Analyzing...' : 'Scan Page'}
            </button>
          )}
          {isLoading && <div className="loader"></div>}
          {analysis && !analysis.error && (
            <div className="results">
              <h3 className="results-title">📊 Analysis Results</h3>
              
              {/* Quick Overview Scores */}
              <div className="scores-overview">
                <div className="score-card">
                  <div className="score-badge">{analysis.productquality.score}/10</div>
                  <div className="score-label">Product Quality</div>
                </div>
                <div className="score-card">
                  <div className="score-badge">{analysis.valueformoney.score}/10</div>
                  <div className="score-label">Value for Money</div>
                </div>
                <div className="score-card">
                  <div className="score-badge">{analysis.customersatisfaction.score}/10</div>
                  <div className="score-label">Customer Satisfaction</div>
                </div>
                <div className="score-card">
                  <div className="score-badge">{analysis.easeofuse.score}/10</div>
                  <div className="score-label">Ease of Use</div>
                </div>
                <div className="score-card">
                  <div className="score-badge">{analysis.deliveryandpackaging.score}/10</div>
                  <div className="score-label">Delivery & Packaging</div>
                </div>
              </div>

              {/* Detailed Analysis */}
              <div className="detailed-analysis">
                <h4 className="section-title">📋 Detailed Analysis</h4>
                
                <div className="analysis-item">
                  <div className="analysis-header">
                    <span className="analysis-title">🏆 Product Quality</span>
                    <span className={`score-highlight ${analysis.productquality.score >= 7 ? 'good' : analysis.productquality.score >= 5 ? 'average' : 'poor'}`}>
                      {analysis.productquality.score}/10
                    </span>
                  </div>
                  <p className="analysis-summary">{analysis.productquality.summary}</p>
                </div>

                <div className="analysis-item">
                  <div className="analysis-header">
                    <span className="analysis-title">💰 Value for Money</span>
                    <span className={`score-highlight ${analysis.valueformoney.score >= 7 ? 'good' : analysis.valueformoney.score >= 5 ? 'average' : 'poor'}`}>
                      {analysis.valueformoney.score}/10
                    </span>
                  </div>
                  <p className="analysis-summary">{analysis.valueformoney.summary}</p>
                </div>

                <div className="analysis-item">
                  <div className="analysis-header">
                    <span className="analysis-title">😊 Customer Satisfaction</span>
                    <span className={`score-highlight ${analysis.customersatisfaction.score >= 7 ? 'good' : analysis.customersatisfaction.score >= 5 ? 'average' : 'poor'}`}>
                      {analysis.customersatisfaction.score}/10
                    </span>
                  </div>
                  <p className="analysis-summary">{analysis.customersatisfaction.summary}</p>
                </div>

                <div className="analysis-item">
                  <div className="analysis-header">
                    <span className="analysis-title">⚡ Ease of Use</span>
                    <span className={`score-highlight ${analysis.easeofuse.score >= 7 ? 'good' : analysis.easeofuse.score >= 5 ? 'average' : 'poor'}`}>
                      {analysis.easeofuse.score}/10
                    </span>
                  </div>
                  <p className="analysis-summary">{analysis.easeofuse.summary}</p>
                </div>

                <div className="analysis-item">
                  <div className="analysis-header">
                    <span className="analysis-title">📦 Delivery & Packaging</span>
                    <span className={`score-highlight ${analysis.deliveryandpackaging.score >= 7 ? 'good' : analysis.deliveryandpackaging.score >= 5 ? 'average' : 'poor'}`}>
                      {analysis.deliveryandpackaging.score}/10
                    </span>
                  </div>
                  <p className="analysis-summary">{analysis.deliveryandpackaging.summary}</p>
                </div>
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
              <h4 className="section-title">🔍 Scanned Product Data</h4>
              <div className="product-info">
                <div className="info-item">
                  <span className="info-label">🏢 Brand:</span>
                  <span className="info-value">{scannedData.brand}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">📦 Product:</span>
                  <span className="info-value">{scannedData.productTitle}</span>
                </div>
              </div>
              {scannedData.reviews && scannedData.reviews.length > 0 && (
                <div className="reviews-section">
                  <h5 className="reviews-title">💬 Sample Reviews</h5>
                  <div className="reviews-list">
                    {scannedData.reviews.map((review, index) => (
                      <div key={index} className="review-item">
                        <span className="review-number">{index + 1}</span>
                        <span className="review-text">{review}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;

// ADDED HEADER AND BORDER< BUT BUGGY. FIX IT