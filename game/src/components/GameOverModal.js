import React from 'react';

const GameOverModal = ({ 
  gameOverData, 
  onPlayAgain, 
  onShowLeaderboard, 
  onBackToMenu, 
  onClose 
}) => {
  const { gameType, score, additionalInfo, playerData, rank } = gameOverData;

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>🎉 Game Over!</h2>
        
        <div className="game-over-stats">
          <div style={{
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            padding: '20px',
            borderRadius: '10px',
            marginBottom: '20px'
          }}>
            <h3>{gameType} Complete!</h3>
            <p style={{ fontSize: '1.5rem', margin: '10px 0' }}>
              <strong>Score: {score}</strong>
            </p>
            {additionalInfo && <p>{additionalInfo}</p>}
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '15px',
            textAlign: 'center'
          }}>
            <div style={{
              background: '#f7fafc',
              padding: '15px',
              borderRadius: '8px'
            }}>
              <strong>Your Rank</strong><br />
              <span style={{ fontSize: '1.5rem', color: '#667eea' }}>
                #{rank}
              </span>
            </div>
            <div style={{
              background: '#f7fafc',
              padding: '15px',
              borderRadius: '8px'
            }}>
              <strong>Total Score</strong><br />
              <span style={{ fontSize: '1.5rem', color: '#48bb78' }}>
                {playerData ? playerData.totalScore : score}
              </span>
            </div>
            <div style={{
              background: '#f7fafc',
              padding: '15px',
              borderRadius: '8px'
            }}>
              <strong>Games Played</strong><br />
              <span style={{ fontSize: '1.5rem', color: '#ffd93d' }}>
                {playerData ? playerData.gamesPlayed : 1}
              </span>
            </div>
          </div>
        </div>
        
        <div className="modal-buttons">
          <button onClick={onPlayAgain}>Play Again</button>
          <button onClick={onShowLeaderboard}>View Leaderboard</button>
          <button onClick={onBackToMenu}>Main Menu</button>
        </div>
      </div>
    </div>
  );
};

export default GameOverModal;
