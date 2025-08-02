import React from 'react';

const TrustScore = ({ category, score, details }) => {
  const getScoreColor = (score) => {
    if (score >= 8) return '#4CAF50'; // Green
    if (score >= 6) return '#FF9800'; // Orange
    if (score >= 4) return '#FF5722'; // Red-Orange
    return '#F44336'; // Red
  };

  const getScoreGrade = (score) => {
    if (score >= 9) return 'A+';
    if (score >= 8) return 'A';
    if (score >= 7) return 'B+';
    if (score >= 6) return 'B';
    if (score >= 5) return 'C+';
    if (score >= 4) return 'C';
    if (score >= 3) return 'D+';
    if (score >= 2) return 'D';
    return 'F';
  };

  return (
    <div className="trust-score">
      <div className="score-header">
        <h4>{category}</h4>
        <div 
          className="score-badge"
          style={{ backgroundColor: getScoreColor(score) }}
        >
          {getScoreGrade(score)}
        </div>
      </div>
      <div className="score-bar">
        <div 
          className="score-fill"
          style={{ 
            width: `${score * 10}%`,
            backgroundColor: getScoreColor(score)
          }}
        />
      </div>
      <p className="score-details">{details}</p>
    </div>
  );
};

export default TrustScore;
