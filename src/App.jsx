import { useState } from 'react';
import './App.css';

function App() {
  const [scannedData, setScannedData] = useState(null);

  const handleScan = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { type: "scan" }, (response) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
          setScannedData({ brand: 'Error', productTitle: 'Could not connect to the page. Please refresh the page and try again.' });
        } else {
          setScannedData(response);
        }
      });
    });
  };

  return (
    <div className="app">
      <main>
        <div className="container">
          <p>Scan the page for products</p>
          <button className="scan-button" onClick={handleScan}>
            Scan Page
          </button>
          {scannedData && (
            <div className="results">
              <h3>Scanned Data:</h3>
              <p><strong>Brand:</strong> {scannedData.brand}</p>
              <p><strong>Title:</strong> {scannedData.productTitle}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;