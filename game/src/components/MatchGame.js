import React, { useState, useEffect } from 'react';
import { matchPairs, shuffleArray } from '../data/gameData';

const MatchGame = ({ onBackToMenu, onGameComplete }) => {
  const [timeLeft, setTimeLeft] = useState(120);
  const [score, setScore] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [leftItems, setLeftItems] = useState([]);
  const [rightItems, setRightItems] = useState([]);
  const [wrongMatch, setWrongMatch] = useState(null);

  const GAME_TIME_LIMIT = 120;

  // Initialize match items
  useEffect(() => {
    setupMatchGame();
  }, []);

  // Timer logic
  useEffect(() => {
    let timer;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      stopMatch();
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Space bar to start/stop
      if (event.key === ' ' || event.key === 'Spacebar') {
        event.preventDefault();
        if (!isActive) {
          startMatch();
        } else {
          stopMatch();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isActive]);

  // Check for match when both items are selected
  useEffect(() => {
    if (selectedLeft && selectedRight) {
      checkMatch();
    }
  }, [selectedLeft, selectedRight]);

  // Auto-submit when all matches are complete
  useEffect(() => {
    if (matchedPairs.length === matchPairs.length && isActive) {
      setTimeout(() => {
        const autoSubmitMsg = document.createElement('div');
        autoSubmitMsg.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: linear-gradient(135deg, #48bb78, #38a169);
          color: white;
          padding: 20px 30px;
          border-radius: 10px;
          font-size: 1.2rem;
          font-weight: bold;
          z-index: 1001;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        `;
        autoSubmitMsg.textContent = '🎉 Perfect! All matches completed! Auto-submitting...';
        document.body.appendChild(autoSubmitMsg);
        
        setTimeout(() => {
          document.body.removeChild(autoSubmitMsg);
          stopMatch();
        }, 2000);
      }, 500);
    }
  }, [matchedPairs.length, isActive]);

  const setupMatchGame = () => {
    const shuffledLeft = shuffleArray(matchPairs.map(m => m.left));
    const shuffledRight = shuffleArray(matchPairs.map(m => m.right));
    setLeftItems(shuffledLeft);
    setRightItems(shuffledRight);
  };

  const resetMatch = () => {
    setTimeLeft(GAME_TIME_LIMIT);
    setScore(0);
    setIsActive(false);
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatchedPairs([]);
    setWrongMatch(null);
    setupMatchGame();
  };

  const startMatch = () => {
    setIsActive(true);
    setTimeLeft(GAME_TIME_LIMIT);
    setScore(0);
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatchedPairs([]);
    setWrongMatch(null);
  };

  const stopMatch = () => {
    setIsActive(false);
    endMatchGame();
  };

  const selectMatchItem = (side, item) => {
    if (!isActive) return;
    if (matchedPairs.some(pair => pair.left === item || pair.right === item)) return;
    
    if (side === 'left') {
      setSelectedLeft(selectedLeft === item ? null : item);
    } else {
      setSelectedRight(selectedRight === item ? null : item);
    }
  };

  const checkMatch = () => {
    // Find if there's a match
    const match = matchPairs.find(m => 
      (m.left === selectedLeft && m.right === selectedRight) ||
      (m.right === selectedLeft && m.left === selectedRight)
    );

    if (match) {
      // Correct match
      setMatchedPairs(prev => [...prev, match]);
      setScore(prev => prev + 20);
      
      // Check if all matches are complete
      if (matchedPairs.length + 1 === matchPairs.length) {
        // Add bonus for completing all matches
        setScore(prev => prev + 50);
      }
    } else {
      // Wrong match
      setWrongMatch({ left: selectedLeft, right: selectedRight });
      setTimeout(() => {
        setWrongMatch(null);
      }, 1000);
    }

    // Reset selections
    setSelectedLeft(null);
    setSelectedRight(null);
  };

  const endMatchGame = () => {
    // Calculate final score
    let finalScore = score;
    
    // Add completion bonus if all matches completed
    if (matchedPairs.length === matchPairs.length) {
      finalScore += 100; // Perfect completion bonus
    }
    
    const matchInfo = `${matchedPairs.length}/${matchPairs.length} matches completed`;
    onGameComplete('Match It', finalScore, matchInfo);
  };

  const getItemClassName = (item, side) => {
    let className = 'match-item';
    
    // Check if matched
    if (matchedPairs.some(pair => pair.left === item || pair.right === item)) {
      className += ' matched';
    }
    // Check if selected
    else if ((side === 'left' && selectedLeft === item) || (side === 'right' && selectedRight === item)) {
      className += ' selected';
    }
    // Check if wrong match
    else if (wrongMatch && (wrongMatch.left === item || wrongMatch.right === item)) {
      className += ' wrong';
    }
    
    return className;
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>🔗 Match It Game</h2>
        <div className="game-controls">
          <div className="timer-display">
            Time: <span>{timeLeft}</span>s
          </div>
          <div className="score-display">
            Score: <span>{score}</span>
          </div>
        </div>
        <div className="control-buttons">
          <button onClick={startMatch} disabled={isActive}>
            Start
          </button>
          <button onClick={stopMatch} disabled={!isActive}>
            Stop
          </button>
          <button onClick={resetMatch} disabled={isActive}>
            Replay
          </button>
          <button onClick={onBackToMenu}>Back to Menu</button>
        </div>
      </div>
      
      <div className="game-content">
        <div className="progress-indicator">
          <div className={`progress-item ${matchedPairs.length === matchPairs.length ? 'completed' : 'incomplete'}`}>
            <span className="progress-icon">🔗</span>
            <span>Matches: {matchedPairs.length}/{matchPairs.length}</span>
          </div>
          <div className={`progress-item ${matchedPairs.length === matchPairs.length ? 'completed' : 'incomplete'}`}>
            <span className="progress-icon">🎯</span>
            <span>Overall: {matchedPairs.length}/{matchPairs.length}</span>
          </div>
        </div>
        
        <div className="match-section">
          <h3>Match the Following:</h3>
          <div className="match-container">
            <div className="match-left">
              {leftItems.map((item, index) => (
                <div
                  key={index}
                  className={getItemClassName(item, 'left')}
                  onClick={() => selectMatchItem('left', item)}
                >
                  {item}
                </div>
              ))}
            </div>
            <div className="match-right">
              {rightItems.map((item, index) => (
                <div
                  key={index}
                  className={getItemClassName(item, 'right')}
                  onClick={() => selectMatchItem('right', item)}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {isActive && (
          <div className="submit-section">
            <button className="submit-btn" onClick={stopMatch}>
              🏁 Submit Game
            </button>
            <p className="submit-hint">Complete all matches for auto-submit!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchGame;
