import type { Question } from '../utils/txtParser'

interface Props {
  questions: Question[]
  scores: boolean[]
  answers: string[]
  timings: number[]
  onRestart: () => void
}

function fmtSecs(secs: number): string {
  if (secs < 60) return `${secs}s`
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return s === 0 ? `${m}m` : `${m}m ${s}s`
}

export function ScoreSummary({ questions, scores, answers, timings, onRestart }: Props) {
  const correct = scores.filter(Boolean).length
  const total = scores.length
  const perfect = correct === total
  const totalTime = timings.reduce((sum, t) => sum + (t ?? 0), 0)

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
      <div className="text-center space-y-1">
        <p className="text-4xl font-bold text-gray-900">
          {correct} / {total}
        </p>
        <p className="text-gray-500 text-sm">
          {perfect ? 'Perfect score!' : `${Math.round((correct / total) * 100)}% correct`}
        </p>
        <p className="text-gray-400 text-xs">
          Total time: {fmtSecs(totalTime)}
        </p>
      </div>

      <ul className="space-y-3">
        {questions.map((q, i) => (
          <li
            key={i}
            className={`rounded-lg px-4 py-3 border ${
              scores[i] ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className={`mt-0.5 font-bold shrink-0 ${scores[i] ? 'text-green-600' : 'text-red-500'}`}>
                {scores[i] ? '✓' : '✗'}
              </span>
              <div className="text-sm space-y-1 min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-gray-700 font-medium">{q.prompt}</p>
                  {timings[i] != null && (
                    <span className="text-xs text-gray-400 font-mono shrink-0">{fmtSecs(timings[i])}</span>
                  )}
                </div>
                <p className="text-gray-500">
                  <span className="font-semibold text-gray-600">Answer: </span>
                  {q.answer}
                </p>
                {!scores[i] && answers[i] && (
                  <p className="text-red-500">
                    <span className="font-semibold">Your answer: </span>
                    {answers[i]}
                  </p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>

      <button
        onClick={onRestart}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg transition-colors"
      >
        New Practice Set
      </button>
    </div>
  )
}
