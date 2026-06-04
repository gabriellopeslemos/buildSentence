import { useState } from 'react'
import { parseTxt, type Question } from '../utils/txtParser'

interface Props {
  onStart: (questions: Question[], sessionMinutes: number) => void
}

const PLACEHOLDER = `PROMPT: "What was the highlight of your trip?"
ANSWER: "The tour guides who showed us around the old city were fantastic."

PROMPT: "Who helped you prepare for the exam?"
ANSWER: "The tutor who worked with me every weekend was incredibly patient."`

export function QuestionForm({ onStart }: Props) {
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [sessionMinutes, setSessionMinutes] = useState(7)

  function handleStart() {
    const questions = parseTxt(text)
    if (questions.length === 0) {
      setError('No valid PROMPT / ANSWER pairs found. Check the format.')
      return
    }
    setError('')
    onStart(questions, sessionMinutes)
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Enter one or more questions using the format below. Each pair must start with{' '}
        <code className="bg-gray-100 px-1 rounded">PROMPT:</code> and{' '}
        <code className="bg-gray-100 px-1 rounded">ANSWER:</code>.
      </p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
        placeholder={PLACEHOLDER}
        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <button
          onClick={handleStart}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors"
        >
          Start
        </button>

        <label className="flex items-center gap-2 text-sm text-gray-600">
          Session time
          <input
            type="number"
            min={1}
            max={60}
            value={sessionMinutes}
            onChange={(e) => setSessionMinutes(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-16 border border-gray-300 rounded-md px-2 py-1 text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          min
        </label>
      </div>
    </div>
  )
}
