import React from 'react';
import TrustScore from './TrustScore';

const BrandSummary = ({ brandName, analysis, isLoading }) => {
  if (isLoading) {
    return (
      <div className="brand-summary loading">
        <div className="loading-spinner"></div>
        <p>Analyzing {brandName}...</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="brand-summary error">
        <p>Unable to analyze this brand. Please try again.</p>
      </div>
    );
  }

  const categories = [
    { key: 'environmental', label: 'Environmental Impact' },
    { key: 'labor', label: 'Labor Practices' },
    { key: 'animalWelfare', label: 'Animal Welfare' },
    { key: 'transparency', label: 'Transparency' }
  ];

  return (
    <div className="brand-summary">
      <div className="brand-header">
        <h3>{brandName}</h3>
        <p className="summary-text">{analysis.summary}</p>
      </div>
      
      <div className="trust-scores">
        {categories.map(category => (
          <TrustScore
            key={category.key}
            category={category.label}
            score={analysis.scores[category.key]}
            details={analysis.details[category.key]}
          />
        ))}
      </div>
    </div>
  );
};

export default BrandSummary;
