import { useState } from 'react';
import './App.css';
import { analyzeProduct } from './openai';

function App() {
  const [scannedData, setScannedData] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleScan = () => {
    setIsLoading(true);
    setAnalysis(null);
    setScannedData(null);

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { type: "scan" }, async (response) => {
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
    });
  };

  return (
    <div className="app">
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
                <strong>Sustainability:</strong> {analysis.sustainability.score}/10
                <p>{analysis.sustainability.summary}</p>
              </div>
              <div className="score">
                <strong>Labor Ethics:</strong> {analysis.labor_ethics.score}/10
                <p>{analysis.labor_ethics.summary}</p>
              </div>
              <div className="score">
                <strong>Animal Welfare:</strong> {analysis.animal_welfare.score}/10
                <p>{analysis.animal_welfare.summary}</p>
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
                {scannedData.reviews.map((review, index) => (
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