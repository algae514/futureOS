import React, { useState } from 'react';

const Header = ({ currentPlayer, setCurrentPlayer }) => {
  const [nameInput, setNameInput] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSetPlayerName = () => {
    const name = nameInput.trim();
    
    if (name && name.length > 0) {
      setCurrentPlayer(name);
      setNameInput('');
      
      // Add animation effect
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 2000);
    } else {
      alert('Please enter a valid name!');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSetPlayerName();
    }
  };

  return (
    <header className="header">
      <h1>🎮 SkillRack Gaming Platform</h1>
      <div className="user-info">
        <input
          type="text"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter your name"
          maxLength="20"
        />
        <button onClick={handleSetPlayerName}>Set Name</button>
        <span 
          className={`current-player ${isAnimating ? 'pulse' : ''}`}
        >
          Player: {currentPlayer}
        </span>
      </div>
    </header>
  );
};

export default Header;
