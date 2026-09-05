type QuizScoreProps = {
  score: number;
  questionNumber: number;
};

export default function QuizScore({ score, questionNumber }: QuizScoreProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 bg-white rounded-lg shadow-sm">
      <div className="text-sm text-gray-600">
        Pergunta <span className="font-semibold">{questionNumber}</span>
      </div>
      <div className="text-sm text-gray-600">
        Pontuação <span className="font-semibold">{score}</span>
      </div>
    </div>
  );
}
