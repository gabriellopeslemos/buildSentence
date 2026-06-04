import { useState } from 'react'
import { QuestionForm } from './components/QuestionForm'
import { SentenceBoard } from './components/DragDropBoard'
import { ResultCard } from './components/ResultCard'
import { ScoreSummary } from './components/ScoreSummary'
import { generateFragments } from './utils/fragmenter'
import { validateAnswer } from './utils/validator'
import type { Question } from './utils/txtParser'

interface Fragment {
  id: string
  text: string
}

type Stage = 'input' | 'practice' | 'result' | 'summary'

export default function App() {
  const [stage, setStage] = useState<Stage>('input')
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [allFragments, setAllFragments] = useState<Fragment[]>([])
  const [slots, setSlots] = useState<(Fragment | null)[]>([])
  const [boardKey, setBoardKey] = useState(0)
  const [result, setResult] = useState<boolean | null>(null)
  const [scores, setScores] = useState<boolean[]>([])

  const question = questions[currentIndex] ?? null
  const isLast = currentIndex === questions.length - 1
  const allPlaced = slots.length > 0 && slots.every((s) => s !== null)

  function loadQuestion(qs: Question[], index: number) {
    const rawFragments = generateFragments(qs[index].answer)
    const withIds: Fragment[] = rawFragments.map((text, i) => ({
      id: `fragment-${i}-${Math.random().toString(36).slice(2)}`,
      text,
    }))
    setAllFragments(withIds)
    setSlots(Array(withIds.length).fill(null))
    setBoardKey((k) => k + 1)
    setResult(null)
    setStage('practice')
  }

  function handleStart(qs: Question[]) {
    setQuestions(qs)
    setCurrentIndex(0)
    setScores([])
    loadQuestion(qs, 0)
  }

  function handleSubmit() {
    if (!question || !allPlaced) return
    const assembled = (slots as Fragment[]).map((f) => f.text).join(' ')
    setResult(validateAnswer(assembled, question.answer))
    setStage('result')
  }

  function handleRetry() {
    loadQuestion(questions, currentIndex)
  }

  function handleNext(currentResult: boolean) {
    const next = currentIndex + 1
    setScores((prev) => {
      const updated = [...prev]
      updated[currentIndex] = currentResult
      return updated
    })
    setCurrentIndex(next)
    loadQuestion(questions, next)
  }

  function handleFinish(currentResult: boolean) {
    setScores((prev) => {
      const updated = [...prev]
      updated[currentIndex] = currentResult
      return updated
    })
    setStage('summary')
  }

  function handleReset() {
    setStage('input')
    setQuestions([])
    setCurrentIndex(0)
    setAllFragments([])
    setSlots([])
    setResult(null)
    setScores([])
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">TOEFL Build a Sentence</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Select a fragment, then click a slot to place it.
          </p>
        </header>

        {stage === 'input' && (
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Enter Questions</h2>
            <QuestionForm onStart={handleStart} />
          </section>
        )}

        {(stage === 'practice' || stage === 'result') && question && (
          <>
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-5">
              {questions.length > 1 && (
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Question {currentIndex + 1} of {questions.length}
                </p>
              )}

              <div>
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Prompt
                </span>
                <p className="text-gray-800 mt-1">{question.prompt}</p>
              </div>

              <SentenceBoard
                key={boardKey}
                allFragments={allFragments}
                onChange={setSlots}
              />

              <div className="pt-1 flex items-center gap-3">
                {stage === 'practice' && (
                  <button
                    onClick={handleSubmit}
                    disabled={!allPlaced}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors"
                  >
                    Submit
                  </button>
                )}
                <button
                  onClick={handleReset}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  New practice set
                </button>
              </div>
            </section>

            {stage === 'result' && result !== null && (
              <ResultCard
                correct={result}
                expected={question.answer}
                onRetry={handleRetry}
                onNext={!isLast ? () => handleNext(result) : undefined}
                onFinish={isLast ? () => handleFinish(result) : undefined}
                isLast={isLast}
              />
            )}
          </>
        )}

        {stage === 'summary' && (
          <ScoreSummary
            questions={questions}
            scores={scores}
            onRestart={handleReset}
          />
        )}
      </div>
    </div>
  )
}
