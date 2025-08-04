import { useState, useEffect, useRef } from 'react'
import Dashboard from './components/Dashboard'
import Header from './components/Header'
import Settings from './components/Settings'
import './App.css'

function App() {
  const [view, setView] = useState('dashboard')
  const [darkMode, setDarkMode] = useState(false)
  const popupRef = useRef(null)

  // Keep popup open logic
  useEffect(() => {
    const handleWindowBlur = () => {
      // Only for extension environment
      if (typeof chrome !== 'undefined' && chrome.runtime?.id) {
        window.focus() // Keep the window focused
      }
    }

    window.addEventListener('blur', handleWindowBlur)
    return () => window.removeEventListener('blur', handleWindowBlur)
  }, [])

  // Dark mode effect
  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : 'light-mode'
  }, [darkMode])

  // Click-outside handler for extension
  useEffect(() => {
    if (!popupRef.current || typeof chrome === 'undefined') return

    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        // Prevent closing by focusing back
        popupRef.current.focus()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  //The extra addon effect
  useEffect(() => {
    // Connect to background script
    const port = chrome.runtime?.connect({ name: "popup" });
    
    // Keepalive heartbeat
    const interval = setInterval(() => {
      port?.postMessage({ type: "heartbeat" });
    }, 1000);
  
    return () => {
      clearInterval(interval);
      port?.disconnect();
    };
  }, [])

  useEffect(() => {
    console.log('Popup mounted');
    return () => console.log('Popup unmounted');
  }, [])

  // Determine environment class
  const environmentClass = (typeof chrome !== 'undefined' && chrome.runtime?.id) ? 'extension-mode' : 'dev-mode'

  return (
    <div 
      className={`app ${environmentClass} ${darkMode ? 'dark' : 'light'}`} 
      ref={popupRef}
      tabIndex="0" // Make div focusable
      onBlur={() => {
        if (typeof chrome !== 'undefined' && popupRef.current) {
          popupRef.current.focus()
        }
      }}
    >
      <Header 
        onViewChange={setView} 
        darkMode={darkMode} 
        toggleDarkMode={() => setDarkMode(!darkMode)}
      />
      <main>
        <Dashboard />
      </main>
    </div>
  )
}

export default App