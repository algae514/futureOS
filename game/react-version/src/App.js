import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import GameMenu from './components/GameMenu';
import QuizGame from './components/QuizGame';
import MatchGame from './components/MatchGame';
import Leaderboard from './components/Leaderboard';
import GameOverModal from './components/GameOverModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import './App.css';

const VIEWS = {
  MENU: 'menu',
  QUIZ: 'quiz',
  MATCH: 'match',
  LEADERBOARD: 'leaderboard'
};

function App() {
  const [currentView, setCurrentView] = useState(VIEWS.MENU);
  const [currentPlayer, setCurrentPlayer] = useState('Guest');
  const [leaderboard, setLeaderboard] = useLocalStorage('skillrack_leaderboard', []);
  const [gameOverData, setGameOverData] = useState(null);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      // ESC key to go back to menu
      if (event.key === 'Escape') {
        setCurrentView(VIEWS.MENU);
        setGameOverData(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const startGame = (gameType) => {
    setCurrentView(gameType);
  };

  const backToMenu = () => {
    setCurrentView(VIEWS.MENU);
    setGameOverData(null);
  };

  const showLeaderboard = () => {
    setCurrentView(VIEWS.LEADERBOARD);
    setGameOverData(null);
  };

  const saveScore = (gameType, score, additionalInfo) => {
    // Find existing player or create new entry
    const updatedLeaderboard = [...leaderboard];
    let playerData = updatedLeaderboard.find(p => p.name === currentPlayer);

    if (playerData) {
      playerData.totalScore += score;
      playerData.gamesPlayed++;
      playerData.gameHistory.push({
        game: gameType,
        score: score,
        date: new Date().toLocaleDateString()
      });

      if (score > playerData.bestScore) {
        playerData.bestScore = score;
        playerData.bestGame = gameType;
      }
    } else {
      playerData = {
        name: currentPlayer,
        totalScore: score,
        gamesPlayed: 1,
        bestScore: score,
        bestGame: gameType,
        gameHistory: [{
          game: gameType,
          score: score,
          date: new Date().toLocaleDateString()
        }]
      };
      updatedLeaderboard.push(playerData);
    }

    // Sort leaderboard by total score (descending)
    updatedLeaderboard.sort((a, b) => b.totalScore - a.totalScore);
    setLeaderboard(updatedLeaderboard);

    // Show game over modal
    setGameOverData({
      gameType,
      score,
      additionalInfo,
      playerData,
      rank: updatedLeaderboard.findIndex(p => p.name === currentPlayer) + 1
    });
  };

  const clearLeaderboard = () => {
    if (window.confirm('Are you sure you want to clear all scores? This action cannot be undone.')) {
      setLeaderboard([]);
      alert('Leaderboard cleared successfully!');
    }
  };

  const playAgain = () => {
    setGameOverData(null);
    // Game components will handle their own restart logic
  };

  return (
    <div className="App">
      <div className="container">
        <Header
          currentPlayer={currentPlayer}
          setCurrentPlayer={setCurrentPlayer}
        />

        {currentView === VIEWS.MENU && (
          <GameMenu
            onStartGame={startGame}
            onShowLeaderboard={showLeaderboard}
          />
        )}

        {currentView === VIEWS.QUIZ && (
          <QuizGame
            onBackToMenu={backToMenu}
            onGameComplete={saveScore}
          />
        )}

        {currentView === VIEWS.MATCH && (
          <MatchGame
            onBackToMenu={backToMenu}
            onGameComplete={saveScore}
          />
        )}

        {currentView === VIEWS.LEADERBOARD && (
          <Leaderboard
            leaderboard={leaderboard}
            onBackToMenu={backToMenu}
            onClearLeaderboard={clearLeaderboard}
          />
        )}

        {gameOverData && (
          <GameOverModal
            gameOverData={gameOverData}
            onPlayAgain={playAgain}
            onShowLeaderboard={showLeaderboard}
            onBackToMenu={backToMenu}
            onClose={() => setGameOverData(null)}
          />
        )}
      </div>
    </div>
  );
}

export default App;
