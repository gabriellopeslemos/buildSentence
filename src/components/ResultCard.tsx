interface Props {
  correct: boolean
  expected: string
  onRetry: () => void
  onNext?: () => void
  onFinish?: () => void
  isLast: boolean
}

export function ResultCard({ correct, expected, onRetry, onNext, onFinish, isLast }: Props) {
  return (
    <div
      className={`rounded-xl p-5 border-2 ${
        correct ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'
      }`}
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{correct ? '✓' : '✗'}</span>
        <div>
          <p className={`text-lg font-bold ${correct ? 'text-green-700' : 'text-red-700'}`}>
            {correct ? 'Correct! Score: 1' : 'Incorrect. Score: 0'}
          </p>
          {!correct && (
            <p className="text-sm text-gray-600 mt-1">
              Expected:{' '}
              <span className="italic text-gray-800">{expected}</span>
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={onRetry}
          className="text-sm font-medium px-4 py-2 rounded-lg border border-gray-300 hover:bg-white transition-colors"
        >
          Try Again
        </button>

        {!isLast && onNext && (
          <button
            onClick={onNext}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
          >
            Next Question →
          </button>
        )}

        {isLast && onFinish && (
          <button
            onClick={onFinish}
            className="bg-gray-700 hover:bg-gray-800 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
          >
            Finish
          </button>
        )}
      </div>
    </div>
  )
}
