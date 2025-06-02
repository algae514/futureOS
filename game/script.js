// Global Variables
let currentPlayer = 'Guest';
let gameState = {
    quiz: {
        timer: null,
        timeLeft: 45,
        score: 0,
        currentQuestion: 0,
        isActive: false,
        questionTimeLimit: 45,
        totalQuestions: 10,
        questions: [
            {
                question: "What is the capital of France?",
                options: ["London", "Berlin", "Paris", "Madrid"],
                correct: 2
            },
            {
                question: "Which planet is known as the Red Planet?",
                options: ["Venus", "Mars", "Jupiter", "Saturn"],
                correct: 1
            },
            {
                question: "What is 2 + 2?",
                options: ["3", "4", "5", "6"],
                correct: 1
            },
            {
                question: "Who painted the Mona Lisa?",
                options: ["Van Gogh", "Picasso", "Leonardo da Vinci", "Michelangelo"],
                correct: 2
            },
            {
                question: "What is the largest mammal in the world?",
                options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
                correct: 1
            },
            {
                question: "Which programming language is known as the 'language of the web'?",
                options: ["Python", "Java", "JavaScript", "C++"],
                correct: 2
            },
            {
                question: "What year did World War II end?",
                options: ["1944", "1945", "1946", "1947"],
                correct: 1
            },
            {
                question: "What is the chemical symbol for gold?",
                options: ["Go", "Gd", "Au", "Ag"],
                correct: 2
            },
            {
                question: "Which country has the most natural lakes?",
                options: ["USA", "Russia", "Canada", "Finland"],
                correct: 2
            },
            {
                question: "What is the speed of light in vacuum?",
                options: ["299,792,458 m/s", "300,000,000 m/s", "299,000,000 m/s", "298,792,458 m/s"],
                correct: 0
            },
            {
                question: "Which data structure uses LIFO (Last In, First Out)?",
                options: ["Queue", "Stack", "Array", "Tree"],
                correct: 1
            },
            {
                question: "What does API stand for?",
                options: ["Application Programming Interface", "Advanced Programming Interface", "Application Process Interface", "Advanced Process Interface"],
                correct: 0
            },
            {
                question: "Which HTTP status code indicates 'Not Found'?",
                options: ["200", "301", "404", "500"],
                correct: 2
            },
            {
                question: "What is the time complexity of binary search?",
                options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
                correct: 1
            },
            {
                question: "Which company developed the React framework?",
                options: ["Google", "Microsoft", "Facebook", "Apple"],
                correct: 2
            }
        ].slice(0, 10) // Limit to exactly 10 questions
    },
    match: {
        timer: null,
        timeLeft: 120,
        score: 0,
        isActive: false,
        selectedLeft: null,
        selectedRight: null,
        matches: [
            { left: "HTML", right: "Markup Language" },
            { left: "CSS", right: "Styling" },
            { left: "JavaScript", right: "Programming Language" },
            { left: "Python", right: "Scripting Language" },
            { left: "SQL", right: "Database Query" }
        ],
        matchedPairs: []
    }
};

// Local Storage key for leaderboard
const LEADERBOARD_KEY = 'skillrack_leaderboard';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadLeaderboard();
    showGameMenu();
});

// Player Management
function setPlayerName() {
    const nameInput = document.getElementById('playerName');
    const name = nameInput.value.trim();
    
    if (name && name.length > 0) {
        currentPlayer = name;
        document.getElementById('currentPlayer').textContent = `Player: ${currentPlayer}`;
        nameInput.value = '';
        
        // Add animation effect
        const playerSpan = document.getElementById('currentPlayer');
        playerSpan.classList.add('pulse');
        setTimeout(() => playerSpan.classList.remove('pulse'), 2000);
    } else {
        alert('Please enter a valid name!');
    }
}

// Navigation Functions
function showGameMenu() {
    hideAllContainers();
    document.getElementById('gameMenu').style.display = 'block';
}

function startGame(gameType) {
    hideAllContainers();
    
    if (gameType === 'quiz') {
        document.getElementById('quizGame').style.display = 'block';
        resetQuiz();
    } else if (gameType === 'match') {
        document.getElementById('matchGame').style.display = 'block';
        resetMatch();
    }
}

function backToMenu() {
    stopAllGames();
    showGameMenu();
}

function hideAllContainers() {
    const containers = ['gameMenu', 'quizGame', 'matchGame', 'leaderboard', 'gameOverModal'];
    containers.forEach(id => {
        document.getElementById(id).style.display = 'none';
    });
}

function stopAllGames() {
    stopQuiz();
    stopMatch();
}

// Quiz Game Functions
function resetQuiz() {
    gameState.quiz.timeLeft = gameState.quiz.questionTimeLimit;
    gameState.quiz.score = 0;
    gameState.quiz.currentQuestion = 0;
    gameState.quiz.isActive = false;
    
    if (gameState.quiz.timer) {
        clearInterval(gameState.quiz.timer);
        gameState.quiz.timer = null;
    }
    
    // Hide question timer info
    document.querySelector('.question-timer-info').style.display = 'none';
    
    updateQuizDisplay();
    document.getElementById('questionText').textContent = 'Click Start to begin!';
    document.getElementById('quizOptions').innerHTML = '';
    document.getElementById('quizStart').disabled = false;
    document.getElementById('quizStop').disabled = true;
    document.getElementById('quizReplay').disabled = true;
}

function startQuiz() {
    gameState.quiz.isActive = true;
    gameState.quiz.timeLeft = gameState.quiz.questionTimeLimit;
    gameState.quiz.score = 0;
    gameState.quiz.currentQuestion = 0;
    
    // Show question timer info
    document.querySelector('.question-timer-info').style.display = 'inline-block';
    
    // Shuffle questions and limit to 10
    const allQuestions = [...gameState.quiz.questions];
    gameState.quiz.questions = shuffleArray(allQuestions).slice(0, gameState.quiz.totalQuestions);
    
    document.getElementById('quizStart').disabled = true;
    document.getElementById('quizStop').disabled = false;
    document.getElementById('quizReplay').disabled = true;
    
    startQuizTimer();
    displayQuestion();
}

function stopQuiz() {
    gameState.quiz.isActive = false;
    
    if (gameState.quiz.timer) {
        clearInterval(gameState.quiz.timer);
        gameState.quiz.timer = null;
    }
    
    // Hide question timer info
    document.querySelector('.question-timer-info').style.display = 'none';
    
    document.getElementById('quizStart').disabled = false;
    document.getElementById('quizStop').disabled = true;
    document.getElementById('quizReplay').disabled = false;
    
    if (gameState.quiz.currentQuestion > 0) {
        endQuizGame();
    }
}

function replayQuiz() {
    resetQuiz();
    startQuiz();
}

function startQuizTimer() {
    gameState.quiz.timer = setInterval(() => {
        gameState.quiz.timeLeft--;
        updateQuizDisplay();
        
        if (gameState.quiz.timeLeft <= 0) {
            // Time's up for this question, move to next
            moveToNextQuestion();
        }
    }, 1000);
}

function updateQuizDisplay() {
    document.getElementById('quizTimer').textContent = gameState.quiz.timeLeft;
    document.getElementById('currentQuestionTimer').textContent = gameState.quiz.timeLeft;
    document.getElementById('quizScore').textContent = gameState.quiz.score;
    document.getElementById('currentQuestionNum').textContent = gameState.quiz.currentQuestion + 1;
    document.getElementById('totalQuestions').textContent = gameState.quiz.questions.length;
    
    const progress = ((gameState.quiz.currentQuestion) / gameState.quiz.questions.length) * 100;
    document.getElementById('quizProgress').style.width = progress + '%';
    
    // Color-code the timer based on remaining time
    const timerInfo = document.getElementById('currentQuestionTimer');
    const timerContainer = timerInfo.parentElement;
    
    if (gameState.quiz.timeLeft <= 10) {
        timerContainer.style.background = 'linear-gradient(135deg, #f56565, #e53e3e)';
    } else if (gameState.quiz.timeLeft <= 20) {
        timerContainer.style.background = 'linear-gradient(135deg, #ffd93d, #ff9f40)';
    } else {
        timerContainer.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
    }
}

function displayQuestion() {
    if (gameState.quiz.currentQuestion >= gameState.quiz.questions.length) {
        stopQuiz();
        return;
    }
    
    const question = gameState.quiz.questions[gameState.quiz.currentQuestion];
    document.getElementById('questionText').textContent = question.question;
    
    const optionsContainer = document.getElementById('quizOptions');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.textContent = option;
        optionElement.onclick = () => selectQuizOption(index);
        optionsContainer.appendChild(optionElement);
    });
    
    updateQuizDisplay();
}

function selectQuizOption(selectedIndex) {
    if (!gameState.quiz.isActive) return;
    
    const question = gameState.quiz.questions[gameState.quiz.currentQuestion];
    const options = document.querySelectorAll('#quizOptions .option');
    
    // Clear previous selections
    options.forEach(opt => opt.classList.remove('selected', 'correct', 'incorrect'));
    
    // Mark selected option
    options[selectedIndex].classList.add('selected');
    
    // Check if correct
    const isCorrect = selectedIndex === question.correct;
    
    setTimeout(() => {
        // Show correct answer
        options[question.correct].classList.add('correct');
        
        if (!isCorrect) {
            options[selectedIndex].classList.add('incorrect');
        } else {
            gameState.quiz.score += 10;
        }
        
        updateQuizDisplay();
        
        // Move to next question after delay
        setTimeout(() => {
            moveToNextQuestion();
        }, 1500);
    }, 500);
}

// Function to move to next question or end quiz
function moveToNextQuestion() {
    gameState.quiz.currentQuestion++;
    
    if (gameState.quiz.currentQuestion < gameState.quiz.questions.length && gameState.quiz.isActive) {
        // Reset timer for next question
        gameState.quiz.timeLeft = gameState.quiz.questionTimeLimit;
        displayQuestion();
    } else {
        // End of quiz
        stopQuiz();
    }
}

function endQuizGame() {
    saveScore('Quiz', gameState.quiz.score);
    showGameOverModal('Quiz', gameState.quiz.score, gameState.quiz.currentQuestion);
}

// Match Game Functions
function resetMatch() {
    gameState.match.timeLeft = 120;
    gameState.match.score = 0;
    gameState.match.isActive = false;
    gameState.match.selectedLeft = null;
    gameState.match.selectedRight = null;
    gameState.match.matchedPairs = [];
    
    if (gameState.match.timer) {
        clearInterval(gameState.match.timer);
        gameState.match.timer = null;
    }
    
    // Hide submit section
    document.getElementById('matchSubmitSection').style.display = 'none';
    
    updateMatchDisplay();
    setupMatchGame();
    
    document.getElementById('matchStart').disabled = false;
    document.getElementById('matchStop').disabled = true;
    document.getElementById('matchReplay').disabled = true;
}

function startMatch() {
    gameState.match.isActive = true;
    gameState.match.timeLeft = 120;
    gameState.match.score = 0;
    
    document.getElementById('matchStart').disabled = true;
    document.getElementById('matchStop').disabled = false;
    document.getElementById('matchReplay').disabled = true;
    
    // Show submit section
    document.getElementById('matchSubmitSection').style.display = 'block';
    document.getElementById('matchSubmitSection').classList.add('slide-in');
    
    startMatchTimer();
}

function stopMatch() {
    gameState.match.isActive = false;
    
    if (gameState.match.timer) {
        clearInterval(gameState.match.timer);
        gameState.match.timer = null;
    }
    
    document.getElementById('matchStart').disabled = false;
    document.getElementById('matchStop').disabled = true;
    document.getElementById('matchReplay').disabled = false;
    
    // Hide submit section
    document.getElementById('matchSubmitSection').style.display = 'none';
    
    endMatchGame();
}

function replayMatch() {
    resetMatch();
    startMatch();
}

function startMatchTimer() {
    gameState.match.timer = setInterval(() => {
        gameState.match.timeLeft--;
        updateMatchDisplay();
        
        if (gameState.match.timeLeft <= 0) {
            stopMatch();
        }
    }, 1000);
}

function updateMatchDisplay() {
    document.getElementById('matchTimer').textContent = gameState.match.timeLeft;
    document.getElementById('matchScore').textContent = gameState.match.score;
    updateMatchProgress();
}

// Update progress indicators for Match It game
function updateMatchProgress() {
    const matchesCompleted = gameState.match.matchedPairs.length;
    const totalMatches = gameState.match.matches.length;
    
    const totalTasks = totalMatches;
    const completedTasks = matchesCompleted;
    
    // Update counters
    document.getElementById('matchesCount').textContent = `${matchesCompleted}/${totalMatches}`;
    document.getElementById('overallCount').textContent = `${completedTasks}/${totalTasks}`;
    
    // Update progress item styling
    const matchesProgressEl = document.getElementById('matchesProgress');
    const overallProgressEl = document.getElementById('overallProgress');
    
    // Matches progress
    if (matchesCompleted === totalMatches) {
        matchesProgressEl.classList.remove('incomplete');
        matchesProgressEl.classList.add('completed');
    } else {
        matchesProgressEl.classList.remove('completed');
        matchesProgressEl.classList.add('incomplete');
    }
    
    // Overall progress
    if (completedTasks === totalTasks) {
        overallProgressEl.classList.remove('incomplete');
        overallProgressEl.classList.add('completed');
    } else {
        overallProgressEl.classList.remove('completed');
        overallProgressEl.classList.add('incomplete');
    }
}

function setupMatchGame() {
    // Shuffle matches
    const shuffledMatches = shuffleArray([...gameState.match.matches]);
    const leftItems = shuffleArray(shuffledMatches.map(m => m.left));
    const rightItems = shuffleArray(shuffledMatches.map(m => m.right));
    
    // Setup left side
    const leftContainer = document.getElementById('matchLeft');
    leftContainer.innerHTML = '';
    leftItems.forEach((item, index) => {
        const element = document.createElement('div');
        element.className = 'match-item';
        element.textContent = item;
        element.onclick = () => selectMatchItem('left', item, element);
        leftContainer.appendChild(element);
    });
    
    // Setup right side
    const rightContainer = document.getElementById('matchRight');
    rightContainer.innerHTML = '';
    rightItems.forEach((item, index) => {
        const element = document.createElement('div');
        element.className = 'match-item';
        element.textContent = item;
        element.onclick = () => selectMatchItem('right', item, element);
        rightContainer.appendChild(element);
    });
}

function selectMatchItem(side, item, element) {
    if (!gameState.match.isActive) return;
    if (element.classList.contains('matched')) return;
    
    // Clear previous selections on this side
    const sideContainer = side === 'left' ? document.getElementById('matchLeft') : document.getElementById('matchRight');
    sideContainer.querySelectorAll('.match-item').forEach(el => {
        el.classList.remove('selected');
    });
    
    // Select current item
    element.classList.add('selected');
    
    if (side === 'left') {
        gameState.match.selectedLeft = { item, element };
    } else {
        gameState.match.selectedRight = { item, element };
    }
    
    // Check for match if both sides selected
    if (gameState.match.selectedLeft && gameState.match.selectedRight) {
        checkMatch();
    }
}

function checkMatch() {
    const leftItem = gameState.match.selectedLeft.item;
    const rightItem = gameState.match.selectedRight.item;
    
    // Find if there's a match
    const match = gameState.match.matches.find(m => 
        (m.left === leftItem && m.right === rightItem) ||
        (m.right === leftItem && m.left === rightItem)
    );
    
    if (match) {
        // Correct match
        gameState.match.selectedLeft.element.classList.remove('selected');
        gameState.match.selectedRight.element.classList.remove('selected');
        gameState.match.selectedLeft.element.classList.add('matched');
        gameState.match.selectedRight.element.classList.add('matched');
        
        gameState.match.matchedPairs.push(match);
        gameState.match.score += 20;
        
        // Check if all matches are complete
        if (gameState.match.matchedPairs.length === gameState.match.matches.length) {
            // Add bonus for completing all matches
            gameState.match.score += 50;
            
            // Check if everything is complete for auto-submit
            checkAutoSubmit();
        }
    } else {
        // Wrong match
        gameState.match.selectedLeft.element.classList.add('wrong');
        gameState.match.selectedRight.element.classList.add('wrong');
        
        setTimeout(() => {
            gameState.match.selectedLeft.element.classList.remove('selected', 'wrong');
            gameState.match.selectedRight.element.classList.remove('selected', 'wrong');
        }, 1000);
    }
    
    // Reset selections
    gameState.match.selectedLeft = null;
    gameState.match.selectedRight = null;
    
    updateMatchDisplay();
}

// Auto-submit function for Match It game
function checkAutoSubmit() {
    if (!gameState.match.isActive) return;
    
    // Check if all matches are completed
    const allMatchesComplete = gameState.match.matchedPairs.length === gameState.match.matches.length;
    
    // Auto-submit if all matches are completed
    if (allMatchesComplete) {
        // Show congratulations message
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
            animation: fadeIn 0.5s ease-in-out;
        `;
        autoSubmitMsg.textContent = '🎉 Perfect! All matches completed! Auto-submitting...';
        document.body.appendChild(autoSubmitMsg);
        
        // Auto-submit after 2 seconds
        setTimeout(() => {
            document.body.removeChild(autoSubmitMsg);
            stopMatch();
        }, 2000);
    }
}

function endMatchGame() {
    // Calculate final score
    let finalScore = gameState.match.score;
    
    // Add completion bonus if all matches completed
    const totalTasks = gameState.match.matches.length;
    const completedTasks = gameState.match.matchedPairs.length;
    
    if (completedTasks === totalTasks) {
        finalScore += 100; // Perfect completion bonus
    }
    
    gameState.match.score = finalScore;
    updateMatchDisplay();
    
    const matchInfo = `${gameState.match.matchedPairs.length}/${gameState.match.matches.length} matches completed`;
    saveScore('Match It', gameState.match.score);
    showGameOverModal('Match It', gameState.match.score, matchInfo);
}

// Leaderboard Functions
function saveScore(gameType, score) {
    let leaderboard = getLeaderboard();
    
    // Find existing player or create new entry
    let playerData = leaderboard.find(p => p.name === currentPlayer);
    
    if (playerData) {
        playerData.totalScore += score;
        playerData.gamesPlayed++;
        playerData.gameHistory.push({ game: gameType, score: score, date: new Date().toLocaleDateString() });
        
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
            gameHistory: [{ game: gameType, score: score, date: new Date().toLocaleDateString() }]
        };
        leaderboard.push(playerData);
    }
    
    // Sort leaderboard by total score (descending)
    leaderboard.sort((a, b) => b.totalScore - a.totalScore);
    
    // Save to localStorage
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
}

function getLeaderboard() {
    const stored = localStorage.getItem(LEADERBOARD_KEY);
    return stored ? JSON.parse(stored) : [];
}

function loadLeaderboard() {
    // This function ensures leaderboard is loaded when app starts
    // Data is already stored in localStorage, just need to ensure it's accessible
}

function showLeaderboard() {
    hideAllContainers();
    document.getElementById('leaderboard').style.display = 'block';
    
    const leaderboard = getLeaderboard();
    
    // Update statistics
    document.getElementById('totalPlayers').textContent = leaderboard.length;
    document.getElementById('totalGames').textContent = leaderboard.reduce((sum, p) => sum + p.gamesPlayed, 0);
    document.getElementById('highestScore').textContent = leaderboard.length > 0 ? leaderboard[0].totalScore : 0;
    
    // Update leaderboard table
    const tbody = document.getElementById('leaderboardBody');
    tbody.innerHTML = '';
    
    leaderboard.forEach((player, index) => {
        const row = document.createElement('tr');
        const avgScore = (player.totalScore / player.gamesPlayed).toFixed(1);
        
        // Add special styling for top 3
        if (index === 0) row.classList.add('rank-1');
        else if (index === 1) row.classList.add('rank-2');
        else if (index === 2) row.classList.add('rank-3');
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${player.name}</td>
            <td>${player.totalScore}</td>
            <td>${player.gamesPlayed}</td>
            <td>${avgScore}</td>
            <td>${player.bestGame} (${player.bestScore})</td>
        `;
        
        tbody.appendChild(row);
    });
    
    // Add animation
    document.getElementById('leaderboard').classList.add('fade-in');
}

function clearLeaderboard() {
    if (confirm('Are you sure you want to clear all scores? This action cannot be undone.')) {
        localStorage.removeItem(LEADERBOARD_KEY);
        showLeaderboard(); // Refresh the display
        alert('Leaderboard cleared successfully!');
    }
}

// Game Over Modal Functions
function showGameOverModal(gameType, score, additionalInfo) {
    const modal = document.getElementById('gameOverModal');
    const statsDiv = document.getElementById('gameOverStats');
    
    const leaderboard = getLeaderboard();
    const playerData = leaderboard.find(p => p.name === currentPlayer);
    
    let rank = leaderboard.findIndex(p => p.name === currentPlayer) + 1;
    
    statsDiv.innerHTML = `
        <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h3>${gameType} Complete!</h3>
            <p style="font-size: 1.5rem; margin: 10px 0;"><strong>Score: ${score}</strong></p>
            <p>${additionalInfo ? additionalInfo : ''}</p>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; text-align: center;">
            <div style="background: #f7fafc; padding: 15px; border-radius: 8px;">
                <strong>Your Rank</strong><br>
                <span style="font-size: 1.5rem; color: #667eea;">#${rank}</span>
            </div>
            <div style="background: #f7fafc; padding: 15px; border-radius: 8px;">
                <strong>Total Score</strong><br>
                <span style="font-size: 1.5rem; color: #48bb78;">${playerData ? playerData.totalScore : score}</span>
            </div>
            <div style="background: #f7fafc; padding: 15px; border-radius: 8px;">
                <strong>Games Played</strong><br>
                <span style="font-size: 1.5rem; color: #ffd93d;">${playerData ? playerData.gamesPlayed : 1}</span>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
    modal.classList.add('fade-in');
}

function playAgain() {
    document.getElementById('gameOverModal').style.display = 'none';
    // Determine which game was last played and restart it
    if (document.getElementById('quizGame').style.display !== 'none') {
        replayQuiz();
    } else if (document.getElementById('matchGame').style.display !== 'none') {
        replayMatch();
    }
}

// Utility Functions
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // ESC key to go back to menu
    if (event.key === 'Escape') {
        backToMenu();
    }
    
    // Space bar to start/stop games
    if (event.key === ' ' || event.key === 'Spacebar') {
        event.preventDefault();
        
        if (document.getElementById('quizGame').style.display !== 'none') {
            if (!gameState.quiz.isActive) {
                startQuiz();
            } else {
                stopQuiz();
            }
        } else if (document.getElementById('matchGame').style.display !== 'none') {
            if (!gameState.match.isActive) {
                startMatch();
            } else {
                stopMatch();
            }
        }
    }
    
    // Number keys for quiz options (1-4)
    if (document.getElementById('quizGame').style.display !== 'none' && gameState.quiz.isActive) {
        if (event.key >= '1' && event.key <= '4') {
            const optionIndex = parseInt(event.key) - 1;
            const options = document.querySelectorAll('#quizOptions .option');
            if (options[optionIndex]) {
                selectQuizOption(optionIndex);
            }
        }
    }
});

// Prevent accidental page refresh during games
window.addEventListener('beforeunload', function(event) {
    if (gameState.quiz.isActive || gameState.match.isActive) {
        event.preventDefault();
        event.returnValue = '';
        return 'You have an active game. Are you sure you want to leave?';
    }
});

// Add some visual feedback for interactions
document.addEventListener('click', function(event) {
    // Add ripple effect to buttons
    if (event.target.tagName === 'BUTTON') {
        const button = event.target;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.6)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s linear';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.width = size + 'px';
        ripple.style.height = size + 'px';
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
});

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

console.log('🎮 SkillRack Gaming Platform Loaded Successfully!');
console.log('💡 Tips:');
console.log('   - Press ESC to return to main menu');
console.log('   - Press SPACE to start/stop games');
console.log('   - Use number keys 1-4 for quiz answers');
console.log('   - Enter your name for personalized leaderboard tracking');
console.log('');
console.log('🎯 Game Specifications:');
console.log('   - Quiz: 10 questions, 45 seconds per question');
console.log('   - Match It: 5 matches only, 120 seconds total');
