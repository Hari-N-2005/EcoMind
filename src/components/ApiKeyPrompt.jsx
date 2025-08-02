import React, { useState } from 'react';

const ApiKeyPrompt = ({ onApiKeySubmit }) => {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onApiKeySubmit(apiKey);
    }
  };

  return (
    <div className="api-key-prompt">
      <h3>Enter your OpenAI API Key</h3>
      <p>
        To analyze products, EcoMind needs an OpenAI API key. You can get one from the{' '}
        <a href="https://platform.openai.com/account/api-keys" target="_blank" rel="noopener noreferrer">
          OpenAI website
        </a>
        .
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="sk-..."
          required
        />
        <button type="submit">Save Key</button>
      </form>
    </div>
  );
};

export default ApiKeyPrompt;
