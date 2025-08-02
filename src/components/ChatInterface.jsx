import React, { useState } from 'react';

const ChatInterface = ({ onAskQuestion, brandName }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const suggestedQuestions = [
    'Is this brand cruelty-free?',
    'Does it use child labor?',
    'How sustainable are their materials?',
    'What certifications does this brand have?'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    try {
      const response = await onAskQuestion(question);
      setAnswer(response);
    } catch (error) {
      setAnswer('Sorry, I couldn\'t answer that question. Please try again.');
    }
    setIsLoading(false);
  };

  const handleSuggestedQuestion = (suggestedQ) => {
    setQuestion(suggestedQ);
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <h4>Ask about {brandName}</h4>
      </div>

      <div className="suggested-questions">
        {suggestedQuestions.map((q, index) => (
          <button
            key={index}
            className="suggested-question"
            onClick={() => handleSuggestedQuestion(q)}
          >
            {q}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="question-form">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about this brand..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !question.trim()}>
          {isLoading ? '...' : 'Ask'}
        </button>
      </form>

      {answer && (
        <div className="answer-container">
          <div className="answer">{answer}</div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
