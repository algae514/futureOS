import React from 'react';

const Leaderboard = ({ leaderboard, onBackToMenu, onClearLeaderboard }) => {
  const totalPlayers = leaderboard.length;
  const totalGames = leaderboard.reduce((sum, p) => sum + p.gamesPlayed, 0);
  const highestScore = leaderboard.length > 0 ? leaderboard[0].totalScore : 0;

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h2>🏆 Leaderboard</h2>
        <div className="leaderboard-controls">
          <button onClick={onClearLeaderboard}>Clear All Scores</button>
          <button onClick={onBackToMenu}>Back to Menu</button>
        </div>
      </div>
      
      <div className="leaderboard-content">
        <div className="leaderboard-stats">
          <div className="stat-card">
            <h4>Total Players</h4>
            <span>{totalPlayers}</span>
          </div>
          <div className="stat-card">
            <h4>Games Played</h4>
            <span>{totalGames}</span>
          </div>
          <div className="stat-card">
            <h4>Highest Score</h4>
            <span>{highestScore}</span>
          </div>
        </div>
        
        <div className="leaderboard-table">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player Name</th>
                <th>Total Score</th>
                <th>Games Played</th>
                <th>Avg Score</th>
                <th>Best Game</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((player, index) => {
                const avgScore = (player.totalScore / player.gamesPlayed).toFixed(1);
                let rowClass = '';
                
                if (index === 0) rowClass = 'rank-1';
                else if (index === 1) rowClass = 'rank-2';
                else if (index === 2) rowClass = 'rank-3';
                
                return (
                  <tr key={player.name} className={rowClass}>
                    <td>{index + 1}</td>
                    <td>{player.name}</td>
                    <td>{player.totalScore}</td>
                    <td>{player.gamesPlayed}</td>
                    <td>{avgScore}</td>
                    <td>{player.bestGame} ({player.bestScore})</td>
                  </tr>
                );
              })}
              {leaderboard.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                    No scores yet. Play some games to see your results here!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
