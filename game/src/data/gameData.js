export const quizQuestions = [
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
];

export const matchPairs = [
  { left: "HTML", right: "Markup Language" },
  { left: "CSS", right: "Styling" },
  { left: "JavaScript", right: "Programming Language" },
  { left: "Python", right: "Scripting Language" },
  { left: "SQL", right: "Database Query" }
];

export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
