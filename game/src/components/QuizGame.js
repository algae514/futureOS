import React, { useState, useEffect, useCallback } from 'react';
import { quizQuestions, shuffleArray } from '../data/gameData';

const QuizGame = ({ onBackToMenu, onGameComplete }) => {
  const [timeLeft, setTimeLeft] = useState(45);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const QUESTION_TIME_LIMIT = 45;
  const TOTAL_QUESTIONS = 10;

  // Initialize questions
  useEffect(() => {
    const shuffledQuestions = shuffleArray([...quizQuestions]).slice(0, TOTAL_QUESTIONS);
    setQuestions(shuffledQuestions);
  }, []);

  // Timer logic
  useEffect(() => {
    let timer;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      moveToNextQuestion();
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isActive) return;
      
      // Number keys for quiz options (1-4)
      if (event.key >= '1' && event.key <= '4') {
        const optionIndex = parseInt(event.key) - 1;
        if (questions[currentQuestion] && questions[currentQuestion].options[optionIndex]) {
          selectOption(optionIndex);
        }
      }
      
      // Space bar to start/stop
      if (event.key === ' ' || event.key === 'Spacebar') {
        event.preventDefault();
        if (!isActive) {
          startQuiz();
        } else {
          stopQuiz();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isActive, currentQuestion, questions]);

  const resetQuiz = () => {
    setTimeLeft(QUESTION_TIME_LIMIT);
    setScore(0);
    setCurrentQuestion(0);
    setIsActive(false);
    setSelectedAnswer(null);
    setShowAnswer(false);
    const shuffledQuestions = shuffleArray([...quizQuestions]).slice(0, TOTAL_QUESTIONS);
    setQuestions(shuffledQuestions);
  };

  const startQuiz = () => {
    setIsActive(true);
    setTimeLeft(QUESTION_TIME_LIMIT);
    setScore(0);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowAnswer(false);
  };

  const stopQuiz = () => {
    setIsActive(false);
    if (currentQuestion > 0) {
      endQuizGame();
    }
  };

  const selectOption = useCallback((selectedIndex) => {
    if (!isActive || showAnswer) return;
    
    const question = questions[currentQuestion];
    setSelectedAnswer(selectedIndex);
    setShowAnswer(true);
    
    // Check if correct
    const isCorrect = selectedIndex === question.correct;
    if (isCorrect) {
      setScore(prev => prev + 10);
    }
    
    // Move to next question after delay
    setTimeout(() => {
      moveToNextQuestion();
    }, 1500);
  }, [isActive, showAnswer, questions, currentQuestion]);

  const moveToNextQuestion = () => {
    const nextQuestion = currentQuestion + 1;
    
    if (nextQuestion < questions.length && isActive) {
      setCurrentQuestion(nextQuestion);
      setTimeLeft(QUESTION_TIME_LIMIT);
      setSelectedAnswer(null);
      setShowAnswer(false);
    } else {
      endQuizGame();
    }
  };

  const endQuizGame = () => {
    setIsActive(false);
    onGameComplete('Quiz', score, `${currentQuestion}/${questions.length} questions answered`);
  };

  const getTimerColor = () => {
    if (timeLeft <= 10) return 'timer-danger';
    if (timeLeft <= 20) return 'timer-warning';
    return 'timer-normal';
  };

  const progress = questions.length > 0 ? (currentQuestion / questions.length) * 100 : 0;

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>🧠 Quiz Game</h2>
        <div className="game-controls">
          <div className="timer-display">
            Time: <span id="quizTimer">{timeLeft}</span>s
          </div>
          <div className="score-display">
            Score: <span>{score}</span>
          </div>
        </div>
        <div className="control-buttons">
          <button onClick={startQuiz} disabled={isActive}>
            Start
          </button>
          <button onClick={stopQuiz} disabled={!isActive}>
            Stop
          </button>
          <button onClick={resetQuiz} disabled={isActive}>
            Replay
          </button>
          <button onClick={onBackToMenu}>Back to Menu</button>
        </div>
      </div>
      
      <div className="game-content">
        {isActive && (
          <div className={`question-timer-info ${getTimerColor()}`}>
            🕐 <span>{timeLeft}</span>s remaining for this question
          </div>
        )}
        
        <div className="question-container">
          <h3>
            {isActive && questions[currentQuestion] 
              ? questions[currentQuestion].question 
              : 'Click Start to begin!'
            }
          </h3>
          
          {isActive && questions[currentQuestion] && (
            <div className="options-container">
              {questions[currentQuestion].options.map((option, index) => {
                let className = 'option';
                
                if (showAnswer) {
                  if (index === questions[currentQuestion].correct) {
                    className += ' correct';
                  } else if (index === selectedAnswer && index !== questions[currentQuestion].correct) {
                    className += ' incorrect';
                  }
                } else if (selectedAnswer === index) {
                  className += ' selected';
                }
                
                return (
                  <div
                    key={index}
                    className={className}
                    onClick={() => selectOption(index)}
                  >
                    {option}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        
        <div className="question-counter">
          Question <span>{currentQuestion + 1}</span> of <span>{questions.length}</span>
        </div>
      </div>
    </div>
  );
};

export default QuizGame;
