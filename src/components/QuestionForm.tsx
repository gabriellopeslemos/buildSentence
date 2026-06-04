import { useState } from 'react'
import { parseTxt, type Question } from '../utils/txtParser'

interface Props {
  onStart: (questions: Question[]) => void
}

const PLACEHOLDER = `PROMPT: "What was the highlight of your trip?"
ANSWER: "The tour guides who showed us around the old city were fantastic."

PROMPT: "Who helped you prepare for the exam?"
ANSWER: "The tutor who worked with me every weekend was incredibly patient."`

export function QuestionForm({ onStart }: Props) {
  const [text, setText] = useState('')
  const [error, setError] = useState('')

  function handleStart() {
    const questions = parseTxt(text)
    if (questions.length === 0) {
      setError('No valid PROMPT / ANSWER pairs found. Check the format.')
      return
    }
    setError('')
    onStart(questions)
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const content = ev.target?.result as string
      setText(content)
      setError('')
    }
    reader.readAsText(file)
    e.target.value = ''
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

      <div className="flex items-center gap-4">
        <button
          onClick={handleStart}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors"
        >
          Start
        </button>

        <label className="cursor-pointer text-sm text-blue-600 hover:text-blue-800 underline">
          Load from .txt
          <input type="file" accept=".txt" className="hidden" onChange={handleFile} />
        </label>
      </div>
    </div>
  )
}
