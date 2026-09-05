'use client'

import { useEffect, useState } from "react";
import { countriesApi } from "@/services";
import { Error, Loading } from "@/components";
import QuizQuestion, { Country } from "@/components/quiz/QuizQuestion";
import QuizScore from "@/components/quiz/QuizScore";

type QuizQuestionState = {
  correct: Country;
  options: Country[];
};

const shuffle = <T,>(items: T[]) => {
  return [...items].sort(() => Math.random() - 0.5);
};

const pickRandomOptions = (countries: Country[], count: number, excludeId: string) => {
  const candidates = countries.filter((c) => c.cca3 !== excludeId);
  const shuffled = shuffle(candidates);
  return shuffled.slice(0, count);
};

const buildQuestion = (countries: Country[]): QuizQuestionState => {
  const correct = countries[Math.floor(Math.random() * countries.length)];
  const wrongOptions = pickRandomOptions(countries, 3, correct.cca3);
  const options = shuffle([correct, ...wrongOptions]);

  return {
    correct,
    options,
  };
};

export default function QuizPage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [question, setQuestion] = useState<QuizQuestionState | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(1);

  useEffect(() => {
    const load = async () => {
      const [data, err] = await countriesApi.getAll();
      setLoading(false);

      if (err) {
        setError(err);
        return;
      }

      setCountries(data);
    };

    load();
  }, []);

  useEffect(() => {
    if (!loading && !error && countries.length >= 4) {
      setQuestion(buildQuestion(countries));
    }
  }, [loading, error, countries]);

  const handleSelect = (cca3: string) => {
    if (!question || isAnswered) return;

    setSelectedAnswer(cca3);
    setIsAnswered(true);

    if (cca3 === question.correct.cca3) {
      setScore((prev) => prev + 1);
    } else {
      setScore(0);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setQuestionNumber((prev) => prev + 1);
    setQuestion(buildQuestion(countries));
  };

  if (loading) return <Loading text="Loading quiz..." />;
  if (error) return <Error text={error} />;

  if (!question) {
    return (
      <Error text="Não foi possível gerar a pergunta. Verifique se existem pelo menos 4 países disponíveis." />
    );
  }

  return (
    <div className="space-y-6">
      <QuizScore score={score} questionNumber={questionNumber} />
      <QuizQuestion
        question={question}
        selectedAnswer={selectedAnswer}
        isAnswered={isAnswered}
        onSelect={handleSelect}
      />

      {isAnswered && (
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <span className="text-sm text-gray-700">
            {selectedAnswer === question.correct.cca3 ? "Correto!" : "Errado!"}
          </span>
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
            onClick={handleNext}
          >
            Próxima Pergunta
          </button>
        </div>
      )}
    </div>
  );
}
