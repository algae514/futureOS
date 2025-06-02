import React from 'react';

const GameMenu = ({ onStartGame, onShowLeaderboard }) => {
  return (
    <div className="game-selection">
      <h2>Choose Your Game</h2>
      <div className="game-cards">
        <div className="game-card" onClick={() => onStartGame('quiz')}>
          <div className="game-icon">🧠</div>
          <h3>Quiz Game</h3>
          <p>Choose the correct answer from multiple choices</p>
          <span className="game-timer">⏱️ 45 seconds per question</span>
        </div>
        <div className="game-card" onClick={() => onStartGame('match')}>
          <div className="game-icon">🔗</div>
          <h3>Match It</h3>
          <p>Match the left column items with the right column</p>
          <span className="game-timer">⏱️ 120 seconds</span>
        </div>
      </div>
      <button className="leaderboard-btn" onClick={onShowLeaderboard}>
        🏆 View Leaderboard
      </button>
    </div>
  );
};

export default GameMenu;
