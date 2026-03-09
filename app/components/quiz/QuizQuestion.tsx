import Image from "next/image";

export type Country = {
  cca3: string;
  flags: {
    svg: string;
  };
  name: {
    common: string;
  };
};

type QuizQuestionProps = {
  question: {
    correct: Country;
    options: Country[];
  };
  selectedAnswer: string | null;
  isAnswered: boolean;
  onSelect: (cca3: string) => void;
};

const getOptionClasses = (
  optionId: string,
  correctId: string,
  selectedAnswer: string | null,
  isAnswered: boolean
) => {
  const base =
    "w-full text-left px-4 py-3 rounded-lg border shadow-sm transition-all";

  if (!isAnswered) {
    return `${base} hover:bg-gray-100 cursor-pointer`;
  }

  if (optionId === correctId) {
    return `${base} bg-emerald-100 border-emerald-300 text-emerald-900`;
  }

  if (selectedAnswer === optionId && optionId !== correctId) {
    return `${base} bg-red-100 border-red-300 text-red-900`;
  }

  return `${base} bg-gray-50 border-gray-200`;
};

export default function QuizQuestion({
  question,
  selectedAnswer,
  isAnswered,
  onSelect,
}: QuizQuestionProps) {
  const { correct, options } = question;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-block overflow-hidden rounded-lg shadow-lg">
          <Image
            key={correct.cca3}
            src={correct.flags.svg || "/flag_placeholder.svg"}
            alt={`Bandeira de ${correct.name.common}`}
            width={420}
            height={280}
            className="w-full h-auto object-cover"
            priority
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map((option) => (
          <button
            key={option.cca3}
            type="button"
            className={getOptionClasses(
              option.cca3,
              correct.cca3,
              selectedAnswer,
              isAnswered
            )}
            onClick={() => onSelect(option.cca3)}
            disabled={isAnswered}
          >
            {option.name.common}
          </button>
        ))}
      </div>
    </div>
  );
}
