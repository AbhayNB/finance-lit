interface QuestionProps {
  questionText: string;
  onAnswer: (isCorrect: boolean) => void;
  correctAnswer: boolean;
}

const Question: React.FC<QuestionProps> = ({ questionText, onAnswer, correctAnswer }) => {
  const handleAnswer = (userAnswer: boolean) => {
    onAnswer(userAnswer === correctAnswer);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 border-2 border-blue-100 rounded-2xl shadow-lg bg-white transition-all duration-300 hover:shadow-xl">
        <h2 className="text-xl font-medium text-gray-800 leading-relaxed">{questionText}</h2>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => handleAnswer(true)}
            className="group relative overflow-hidden px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-medium transform transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
          >
            <span className="relative z-10">True</span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </button>
          <button
            onClick={() => handleAnswer(false)}
            className="group relative overflow-hidden px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-medium transform transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
          >
            <span className="relative z-10">False</span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Question;
