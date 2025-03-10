"use client";
import { useState, useEffect } from "react";
import { Pie, Bar, Radar, Line } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, RadialLinearScale } from "chart.js"; // Chart.js components
import Image from 'next/image';

import Question from "./components/Question";
import { questions, literacyFeedback } from "./data";
import { FaPiggyBank, FaMapMarkerAlt, FaChartLine, FaUniversity, FaArrowRight, FaAward, FaMedal, FaTrophy, FaRegStar } from "react-icons/fa";
import { MdTrendingUp } from "react-icons/md";
import dynamic from 'next/dynamic';
import { BsLightningCharge, BsBarChartLine, BsCurrencyDollar, BsBookmark } from 'react-icons/bs';

const DownloadPDFButton = dynamic(() => import('./components/DownloadPDFButton'), {
  ssr: false,
});

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, RadialLinearScale);

type GameResult = {
  score: number;
  totalQuestions: number;
  date: string;
  country: string;
};

const GamePage: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [isIntroVisible, setIsIntroVisible] = useState(true);
  const [country, setCountry] = useState("");
  const [literacyLevel, setLiteracyLevel] = useState(literacyFeedback.low);
  const [literacyScore, setLiteracyScore] = useState("0.00");
  const [currentPage, setCurrentPage] = useState(0);
  const suggestionsPerPage = 3;
  const [questionAnswers, setQuestionAnswers] = useState<boolean[]>([]);
  const [learningStreak] = useState(0);
  const [historicalScores, setHistoricalScores] = useState<GameResult[]>([]);

  const startGame = () => {
    if (country.trim() !== "") {
      setIsIntroVisible(false);
    } else {
      alert("Please enter your country to start.");
    }
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) setScore((prevScore) => prevScore + 1);
    setQuestionAnswers(prev => [...prev, isCorrect]);

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setIsGameFinished(true);
    }
  };

  const goBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setScore((prevScore) => (prevScore > 0 ? prevScore - 1 : 0));
    }
  };

  const retryGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setIsGameFinished(false);
    setIsIntroVisible(true);
    setCountry("");
    setCurrentPage(0);
    setQuestionAnswers([]);
  };

  const nextPage = () => {
    if ((currentPage + 1) * suggestionsPerPage < literacyLevel.suggestions.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    const literacyScoreDecimal = (score / questions.length).toFixed(2);
    setLiteracyScore(literacyScoreDecimal);

    const literacyLevel =
      score / questions.length <= 0.25
        ? literacyFeedback.low
        : score / questions.length <= 0.5
        ? literacyFeedback.basic
        : score / questions.length <= 0.75
        ? literacyFeedback.moderate
        : literacyFeedback.high;

    setLiteracyLevel(literacyLevel);
  }, [score]); // Removed questions.length as it's constant

  useEffect(() => {
    // Load historical scores from localStorage when component mounts
    const savedScores = localStorage.getItem('financialLiteracyScores');
    if (savedScores) {
      setHistoricalScores(JSON.parse(savedScores));
    }
  }, []);

  useEffect(() => {
    // Save score when game is finished
    if (isGameFinished) {
      const newScore: GameResult = {
        score: score,
        totalQuestions: questions.length,
        date: new Date().toISOString(),
        country: country
      };
      
      const savedScores = localStorage.getItem('financialLiteracyScores');
      let updatedScores: GameResult[] = [];
      
      if (savedScores) {
        updatedScores = JSON.parse(savedScores);
      }
      
      updatedScores.push(newScore);
      localStorage.setItem('financialLiteracyScores', JSON.stringify(updatedScores));
      setHistoricalScores(updatedScores);
    }
  }, [isGameFinished, score, country]); // Added missing dependencies

  const getCurrentPageSuggestions = (): string[] => {
    const startIndex = currentPage * suggestionsPerPage;
    return literacyLevel.suggestions.slice(startIndex, startIndex + suggestionsPerPage);
  };

  const totalPages: number = Math.ceil(literacyLevel.suggestions.length / suggestionsPerPage);

  const pieChartData = {
    labels: ["Correct Answers", "Incorrect Answers"],
    datasets: [
      {
        data: [score, questions.length - score],
        backgroundColor: ["#4CAF50", "#F44336"], // Green for correct, Red for incorrect
        hoverBackgroundColor: ["#66BB6A", "#E57373"],
      },
    ],
  };

  const barChartData = {
    labels: ['Total Score', 'Correct', 'Incorrect'],
    datasets: [
      {
        label: 'Performance Metrics',
        data: [
          parseFloat(literacyScore) * 100,
          (score / questions.length) * 100,
          ((questions.length - score) / questions.length) * 100
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(76, 175, 80, 0.6)',
          'rgba(244, 67, 54, 0.6)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(76, 175, 80, 1)',
          'rgba(244, 67, 54, 1)'
        ],
        borderWidth: 1,
      }
    ]
  };

  const barChartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(tickValue: number | string) {
            return `${tickValue}%`;
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context: { parsed: { y: number } }): string {
            return `${context.parsed.y.toFixed(1)}%`;
          }
        }
      }
    }
  };

  const radarChartData = {
    labels: questions.map((_, idx) => `Q${idx + 1}`),
    datasets: [
      {
        label: 'Your Performance',
        data: questionAnswers.map(correct => correct ? 100 : 0),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
      }
    ]
  };

  const radarChartOptions = {
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20
        }
      }
    }
  };

  // Add answer breakdown visualization data
  const answerBreakdownData = {
    labels: questions.map((_, idx) => `Q${idx + 1}`),
    datasets: [
      {
        data: questionAnswers.map((correct: boolean) => correct ? 1 : 0),
        backgroundColor: questionAnswers.map((correct: boolean) => 
          correct ? 'rgba(76, 175, 80, 0.8)' : 'rgba(244, 67, 54, 0.8)'
        ),
        borderColor: questionAnswers.map((correct: boolean) => 
          correct ? 'rgba(76, 175, 80, 1)' : 'rgba(244, 67, 54, 1)'
        ),
        borderWidth: 1,
        label: 'Answers',
      }
    ]
  };

  const historicalScoresChartData = {
    labels: historicalScores.map((result, index) => `Attempt ${index + 1}`),
    datasets: [
      {
        label: 'Score History',
        data: historicalScores.map(result => (result.score / result.totalQuestions) * 100),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      }
    ]
  };

  const historicalScoresOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(tickValue: string | number, index: number, ticks: any): string {
            return tickValue + '%';
          }
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context: { parsed: { y: number }, dataIndex: number }): string[] {
            const score = context.parsed.y;
            const result = historicalScores[context.dataIndex];
            return [
              `Score: ${score.toFixed(1)}%`,
              `Date: ${new Date(result.date).toLocaleDateString()}`,
              `Country: ${result.country}`
            ];
          }
        }
      }
    }
  };

  const getEmotionImage = (score: number, totalQuestions: number): string => {
    const percentage = (score / totalQuestions) * 100;
    if (percentage >= 75) {
      return "/emotions/excited.png";
    } else if (percentage >= 50) {
      return "/emotions/happy.png";
    } else if (percentage >= 25) {
      return "/emotions/neutral.png";
    } else {
      return "/emotions/sad.png";
    }
  };

  const getBadgeInfo = (score: number, totalQuestions: number): {
    icon: JSX.Element;
    text: string;
    color: string;
  } => {
    const percentage = (score / totalQuestions) * 100;
    if (percentage >= 90) {
      return {
        icon: <FaTrophy className="w-12 h-12 text-yellow-500" />,
        text: "Financial Expert",
        color: "bg-yellow-100 border-yellow-500"
      };
    } else if (percentage >= 75) {
      return {
        icon: <FaMedal className="w-12 h-12 text-blue-500" />,
        text: "Financial Savvy",
        color: "bg-blue-100 border-blue-500"
      };
    } else if (percentage >= 50) {
      return {
        icon: <FaAward className="w-12 h-12 text-green-500" />,
        text: "Financial Learner",
        color: "bg-green-100 border-green-500"
      };
    } else {
      return {
        icon: <FaRegStar className="w-12 h-12 text-gray-500" />,
        text: "Financial Beginner",
        color: "bg-gray-100 border-gray-500"
      };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {isIntroVisible ? (
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
          {/* Market Overview Section */}
          <div className="grid grid-cols-3 gap-2 sm:gap-6 mb-6 sm:mb-8">
            {/* Card 1 */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl p-2 sm:p-6 text-white">
              <div className="flex items-center justify-between mb-1 sm:mb-4">
                <h3 className="text-xs sm:text-lg font-semibold">Financial Literacy</h3>
                <BsBarChartLine className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <p className="text-sm sm:text-3xl font-bold">Global Score</p>
              <p className="text-[10px] sm:text-sm opacity-80">Learn and improve your score</p>
            </div>
            {/* Card 2 */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg sm:rounded-xl p-2 sm:p-6 text-white">
              <div className="flex items-center justify-between mb-1 sm:mb-4">
                <h3 className="text-xs sm:text-lg font-semibold">Learning Streak</h3>
                <BsLightningCharge className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <p className="text-sm sm:text-3xl font-bold">{learningStreak} Days</p>
              <p className="text-[10px] sm:text-sm opacity-80">Keep learning to earn rewards</p>
            </div>
            {/* Card 3 */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg sm:rounded-xl p-2 sm:p-6 text-white">
              <div className="flex items-center justify-between mb-1 sm:mb-4">
                <h3 className="text-xs sm:text-lg font-semibold">Knowledge Base</h3>
                <BsCurrencyDollar className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <p className="text-sm sm:text-3xl font-bold">{questions.length} Topics</p>
              <p className="text-[10px] sm:text-sm opacity-80">Comprehensive financial education</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-8">
            <div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-6">
              <div className="inline-block p-3 bg-blue-50 rounded-full">
                <MdTrendingUp className="w-8 h-8 sm:w-12 sm:h-12 text-blue-600" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 px-4">
                Master Your Financial Future
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 px-4">
                Join millions learning about investments, cryptocurrency, and personal finance
              </p>

              {/* Features Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 sm:mt-12 px-2 sm:px-0">
                <FeatureCard
                  icon={<FaPiggyBank />}
                  title="Save Smarter"
                  description="Learn effective saving strategies"
                />
                <FeatureCard
                  icon={<FaChartLine />}
                  title="Invest Wisely"
                  description="Understand market dynamics"
                />
                <FeatureCard
                  icon={<FaUniversity />}
                  title="Build Wealth"
                  description="Long-term wealth creation"
                />
                <FeatureCard
                  icon={<BsBookmark />}
                  title="Track Progress"
                  description="Monitor your learning journey"
                />
              </div>

              {/* Country Input */}
              <div className="mt-8 sm:mt-12 px-4">
                <div className="relative max-w-md mx-auto">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <FaMapMarkerAlt className="text-gray-400 w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Enter your country"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-400 transition-all duration-300 text-base sm:text-lg"
                  />
                </div>
                <button
                  onClick={startGame}
                  className="mt-4 sm:mt-6 w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base sm:text-lg font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300"
                >
                  Start Your Journey <FaArrowRight className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : !isGameFinished ? (
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
          {/* Progress Overview */}
          <div className="grid grid-cols-3 gap-2 sm:gap-6 mb-6 sm:mb-8">
            {/* Card 1 */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl p-2 sm:p-6 text-white">
              <div className="flex items-center justify-between mb-1 sm:mb-4">
                <h3 className="text-xs sm:text-lg font-semibold">Current Progress</h3>
                <BsBarChartLine className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <p className="text-sm sm:text-3xl font-bold">{((currentQuestion + 1) / questions.length * 100).toFixed(0)}%</p>
              <p className="text-[10px] sm:text-sm opacity-80">Question {currentQuestion + 1} of {questions.length}</p>
            </div>
            {/* Card 2 */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg sm:rounded-xl p-2 sm:p-6 text-white">
              <div className="flex items-center justify-between mb-1 sm:mb-4">
                <h3 className="text-xs sm:text-lg font-semibold">Current Score</h3>
                <BsLightningCharge className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <p className="text-sm sm:text-3xl font-bold">{score}</p>
              <p className="text-[10px] sm:text-sm opacity-80">Correct Answers</p>
            </div>
            {/* Card 3 */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg sm:rounded-xl p-2 sm:p-6 text-white">
              <div className="flex items-center justify-between mb-1 sm:mb-4">
                <h3 className="text-xs sm:text-lg font-semibold">Accuracy</h3>
                <BsCurrencyDollar className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <p className="text-sm sm:text-3xl font-bold">{currentQuestion > 0 ? ((score / currentQuestion) * 100).toFixed(0) : 0}%</p>
              <p className="text-[10px] sm:text-sm opacity-80">Overall Performance</p>
            </div>
          </div>
          
          {/* Quiz Card */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8">
            <div className="max-w-2xl mx-auto">
              <div className="mb-6 sm:mb-8">
                <div className="flex justify-between items-center mb-3 sm:mb-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Question {currentQuestion + 1}
                  </h2>
                  <span className="text-xs sm:text-sm text-gray-500">
                    {questions.length - (currentQuestion + 1)} remaining
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                    className="h-2 bg-blue-600 rounded-full transition-all duration-500"
                  ></div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-base sm:text-lg text-gray-800 font-medium">
                    <Question
                      questionText={questions[currentQuestion].question}
                      onAnswer={handleAnswer}
                      correctAnswer={questions[currentQuestion].correctAnswer}
                    />
                  </div>
                  <button 
                    onClick={() => {
                      const speech = new SpeechSynthesisUtterance(questions[currentQuestion].question);
                      window.speechSynthesis.speak(speech);
                    }}
                    className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                    title="Listen to question"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                {currentQuestion > 0 ? (
                  <button
                    onClick={goBack}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg className="mr-2 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Previous
                  </button>
                ) : (
                  <div></div>
                )}
                
                <div className="flex items-center space-x-2">
                  {[...Array(questions.length)].map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-2 h-2 rounded-full ${
                        idx < currentQuestion
                          ? 'bg-blue-600'
                          : idx === currentQuestion
                          ? 'bg-blue-400'
                          : 'bg-gray-200'
                      }`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
          {/* Achievement Banner */}
          <div className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl p-4 sm:p-8 mb-6 sm:mb-8 text-white relative overflow-hidden">
            <div className="absolute right-0 top-0 h-full w-1/2 transform opacity-10">
              <FaChartLine className="w-32 sm:w-64 h-32 sm:h-64" />
            </div>
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
              <div className="text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">Congratulations!</h2>
                <p className="text-base sm:text-lg opacity-90">You&apos;ve completed the assessment</p>
                <div className="mt-4 flex items-center justify-center sm:justify-start gap-2">
                  <FaMapMarkerAlt />
                  <span>{country}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 sm:gap-6 sm:ml-auto">
                <div className="text-center">
                  <div className="text-3xl sm:text-5xl font-bold mb-1">{literacyScore}</div>
                  <div className="text-xs sm:text-sm opacity-80">Score</div>
                </div>
                <div className="relative w-16 h-16 sm:w-24 sm:h-24">
                  <Image
                    src={getEmotionImage(score, questions.length)}
                    alt="Achievement"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Stats Cards */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Performance</h3>
                <BsBarChartLine className="w-5 h-5 text-blue-500" />
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">Accuracy Rate</span>
                    <span className="font-medium text-gray-900">{((score / questions.length) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div
                      className="h-2 bg-blue-500 rounded-full transition-all"
                      style={{ width: `${(score / questions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">Questions Completed</span>
                    <span className="font-medium text-gray-900">{questions.length}/{questions.length}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div className="h-2 bg-green-500 rounded-full w-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Badge Card */}
            {(() => {
              const badge = getBadgeInfo(score, questions.length);
              return (
                <div className={`bg-white rounded-xl shadow-sm p-6 ${badge.color} border`}>
                  <div className="flex items-center gap-4">
                    {badge.icon}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Achievement Level</h3>
                      <p className="text-gray-600">{badge.text}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">
                      {literacyLevel.title} - Keep learning to unlock more achievements!
                    </p>
                  </div>
                </div>
              );
            })()}

            {/* Learning Path */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Next Steps</h3>
                <FaArrowRight className="w-5 h-5 text-blue-500" />
              </div>
              <div className="space-y-3">
                {literacyLevel.suggestions.slice(0, 3).map((suggestion, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      index === 0 ? 'bg-blue-100 text-blue-600' :
                      index === 1 ? 'bg-purple-100 text-purple-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {index === 0 ? <BsBarChartLine /> :
                       index === 1 ? <BsLightningCharge /> :
                       <BsCurrencyDollar />}
                    </div>
                    <p className="text-sm text-gray-600">{suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Suggestions Section with Pagination */}
          <div className="bg-white rounded-xl shadow-sm p-6 my-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Suggested Resources</h3>
              <div className="flex space-x-2">
                <button 
                  onClick={previousPage} 
                  disabled={currentPage === 0}
                  className={`p-1 rounded ${currentPage === 0 ? 'text-gray-300' : 'text-blue-500 hover:bg-blue-50'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 011.414-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <span className="text-sm text-gray-600">Page {currentPage + 1} of {totalPages}</span>
                <button 
                  onClick={nextPage} 
                  disabled={(currentPage + 1) * suggestionsPerPage >= literacyLevel.suggestions.length}
                  className={`p-1 rounded ${(currentPage + 1) * suggestionsPerPage >= literacyLevel.suggestions.length ? 'text-gray-300' : 'text-blue-500 hover:bg-blue-50'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              {getCurrentPageSuggestions().map((suggestion, index) => (
                <div key={index} className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <p className="text-gray-700">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Analytics Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Score Distribution</h3>
              <Pie data={pieChartData} />
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Analysis</h3>
              <Bar data={barChartData} options={barChartOptions} />
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Question Analysis</h3>
              <div className="grid grid-cols-5 gap-2">
                {questionAnswers.map((correct, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded-md flex flex-col items-center ${
                      correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                    }`}
                  >
                    <span className={`text-xs font-medium ${correct ? 'text-green-800' : 'text-red-800'}`}>Q{idx + 1}</span>
                    <span className={`text-lg ${correct ? 'text-green-600' : 'text-red-600'}`}>
                      {correct ? '✓' : '✕'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Skill Radar</h3>
              <Radar data={radarChartData} options={radarChartOptions} />
            </div>
            {/* Adding Answer Breakdown Chart */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Answer Breakdown</h3>
              <Bar data={answerBreakdownData} />
            </div>
            {/* Historical Scores Comparison */}
            {historicalScores.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6 my-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Score History</h3>
                <div className="relative h-[300px]">
                  <Line data={historicalScoresChartData} options={historicalScoresOptions} />
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Previous Attempts:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {historicalScores.slice(-3).reverse().map((result, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            {new Date(result.date).toLocaleDateString()}
                          </span>
                          <span className="font-medium text-blue-600">
                            {((result.score / result.totalQuestions) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Country: {result.country}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 sm:mt-8">
            <div className="flex flex-col sm:flex-row items-stretch justify-center gap-3 sm:gap-6 max-w-4xl mx-auto">
              <button
                onClick={retryGame}
                className="w-full sm:w-1/3 px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transform transition-all hover:-translate-y-1 hover:shadow-lg flex items-center justify-center gap-3 text-base sm:text-lg font-medium"
              >
                <FaArrowRight className="w-5 h-5" />
                Try Again
              </button>
              <DownloadPDFButton
                score={literacyScore}
                country={country}
                literacyLevel={literacyLevel}
                questionAnswers={questionAnswers}
              />
              <button
                onClick={() => window.open("https://university.taylors.edu.my/en.html", "_blank")}
                className="w-full sm:w-1/3 px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transform transition-all hover:-translate-y-1 hover:shadow-lg flex items-center justify-center gap-3 text-base sm:text-lg font-medium"
              >
                <FaUniversity className="w-5 h-5" />
                Browse Resources
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

// Helper component for feature cards - updated for mobile
const FeatureCard = ({ icon, title, description }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
}): JSX.Element => (
  <div className="aspect-square flex flex-col items-center justify-center p-2 sm:p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-300">
    <div className="text-blue-600 text-xl sm:text-2xl mb-1 sm:mb-2">{icon}</div>
    <h3 className="font-semibold text-gray-900 text-xs sm:text-sm text-center">{title}</h3>
    <p className="text-[10px] sm:text-xs text-gray-600 text-center mt-0.5 sm:mt-1 line-clamp-2">{description}</p>
  </div>
);

export default GamePage;
