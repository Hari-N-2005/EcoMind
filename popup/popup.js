import React from 'react';
import { createRoot } from 'react-dom/client';
import Popup from '../src/components/Popup';

// This function will be responsible for communicating with the content script
function getProductInfoFromContentScript(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    if (activeTab) {
      chrome.scripting.executeScript(
        {
          target: { tabId: activeTab.id },
          function: () => {
            // This function is executed in the context of the web page
            if (window.extractProductInfo) {
              return window.extractProductInfo();
            }
          },
        },
        (results) => {
          if (chrome.runtime.lastError) {
            console.error('Error executing script:', chrome.runtime.lastError);
            callback({ error: 'Could not access page content.' });
          } else if (results && results[0] && results[0].result) {
            callback(results[0].result);
          } else {
            callback({ error: 'Could not extract product info.' });
          }
        }
      );
    } else {
      callback({ error: 'No active tab found.' });
    }
  });
}

// Pass the function to the Popup component
window.getProductInfo = getProductInfoFromContentScript;

// Render the React app
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Popup />);
