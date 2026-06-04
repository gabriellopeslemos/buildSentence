import { useState, useEffect, useRef } from 'react'
import { QuestionForm } from './components/QuestionForm'
import { PromptHelper } from './components/PromptHelper'
import { SentenceBoard } from './components/DragDropBoard'
import { ScoreSummary } from './components/ScoreSummary'
import { generateFragments, generateDistractors } from './utils/fragmenter'
import { validateAnswer } from './utils/validator'
import type { Question } from './utils/txtParser'

interface Fragment {
  id: string
  text: string
}

type Stage = 'input' | 'practice' | 'summary'

export default function App() {
  const [stage, setStage] = useState<Stage>('input')
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [allFragments, setAllFragments] = useState<Fragment[]>([])
  const [distractors, setDistractors] = useState<Fragment[]>([])
  const [slots, setSlots] = useState<(Fragment | null)[]>([])
  const [boardKey, setBoardKey] = useState(0)
  const [scores, setScores] = useState<boolean[]>([])
  const [answers, setAnswers] = useState<string[]>([])
  const [timings, setTimings] = useState<number[]>([])
  const questionStartRef = useRef<number>(Date.now())
  const [timeLeft, setTimeLeft] = useState(40)
  const [sessionTimeLeft, setSessionTimeLeft] = useState(7 * 60)

  const question = questions[currentIndex] ?? null
  const isLast = currentIndex === questions.length - 1
  const allPlaced = slots.length > 0 && slots.every((s) => s !== null)

  // Per-question countdown
  useEffect(() => {
    if (stage !== 'practice') return
    const id = setInterval(() => setTimeLeft(t => Math.max(0, t - 1)), 1000)
    return () => clearInterval(id)
  }, [stage, boardKey])

  // Per-question timeout → count as wrong and advance
  useEffect(() => {
    if (stage !== 'practice' || timeLeft > 0) return
    const assembled = slots.filter(Boolean).map((f) => (f as Fragment).text).join(' ')
    setAnswers((prev) => { const u = [...prev]; u[currentIndex] = assembled; return u })
    recordTiming()
    if (isLast) handleFinish(false)
    else handleNext(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, stage])

  // Session-wide countdown (ticks during practice)
  useEffect(() => {
    if (stage !== 'practice') return
    const id = setInterval(() => setSessionTimeLeft(t => Math.max(0, t - 1)), 1000)
    return () => clearInterval(id)
  }, [stage])

  // Session timeout → mark all remaining as wrong and go to summary
  useEffect(() => {
    if (stage !== 'practice' || sessionTimeLeft > 0) return
    const assembled = slots.filter(Boolean).map((f) => (f as Fragment).text).join(' ')
    recordTiming()
    setAnswers((prev) => {
      const u = [...prev]
      u[currentIndex] = u[currentIndex] ?? assembled
      for (let i = currentIndex + 1; i < questions.length; i++) u[i] = u[i] ?? ''
      return u
    })
    setScores((prev) => {
      const u = [...prev]
      for (let i = currentIndex; i < questions.length; i++) u[i] = u[i] ?? false
      return u
    })
    setStage('summary')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionTimeLeft, stage])

  function recordTiming() {
    const elapsed = Math.round((Date.now() - questionStartRef.current) / 1000)
    setTimings((prev) => { const u = [...prev]; u[currentIndex] = elapsed; return u })
  }

  function loadQuestion(qs: Question[], index: number) {
    const rawFragments = generateFragments(qs[index].answer)
    const withIds: Fragment[] = rawFragments.map((text, i) => ({
      id: `fragment-${i}-${Math.random().toString(36).slice(2)}`,
      text,
    }))
    const distractorCount = Math.random() < 0.5 ? 1 : 2
    const distractorTexts = generateDistractors(qs[index].answer, distractorCount)
    const fakeFragments: Fragment[] = distractorTexts.map((text, i) => ({
      id: `distractor-${i}-${Math.random().toString(36).slice(2)}`,
      text,
    }))
    setAllFragments(withIds)
    setDistractors(fakeFragments)
    setSlots(Array(withIds.length).fill(null))
    setBoardKey((k) => k + 1)
    setTimeLeft(40)
    questionStartRef.current = Date.now()
    setStage('practice')
  }

  function handleStart(qs: Question[], sessionMinutes: number) {
    setQuestions(qs)
    setCurrentIndex(0)
    setScores([])
    setAnswers([])
    setTimings([])
    setSessionTimeLeft(sessionMinutes * 60)
    loadQuestion(qs, 0)
  }

  function handleSubmit() {
    if (!question || !allPlaced) return
    const assembled = (slots as Fragment[]).map((f) => f.text).join(' ')
    const isCorrect = validateAnswer(assembled, question.answer)
    setAnswers((prev) => { const u = [...prev]; u[currentIndex] = assembled; return u })
    recordTiming()
    if (isLast) handleFinish(isCorrect)
    else handleNext(isCorrect)
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

  function fmtTime(secs: number): string {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  function handleReset() {
    setStage('input')
    setQuestions([])
    setCurrentIndex(0)
    setAllFragments([])
    setDistractors([])
    setSlots([])
    setScores([])
    setAnswers([])
    setTimings([])
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
          <>
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Enter Questions</h2>
              <QuestionForm onStart={handleStart} />
            </section>
            <PromptHelper />
          </>
        )}

        {stage === 'practice' && question && (
          <>
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  {questions.length > 1 ? `Question ${currentIndex + 1} of ${questions.length}` : ''}
                </p>
                <span
                  className={`text-sm font-mono font-bold tabular-nums ${
                    sessionTimeLeft <= 60 ? 'text-red-500' : 'text-gray-400'
                  }`}
                >
                  {fmtTime(sessionTimeLeft)}
                </span>
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Prompt
                </span>
                <p className="text-gray-800 mt-1">{question.prompt}</p>
              </div>

              <SentenceBoard
                key={boardKey}
                allFragments={allFragments}
                distractors={distractors}
                onChange={setSlots}
                trailChar={question.answer.trimEnd().endsWith('?') ? '?' : undefined}
              />

              <div className="pt-1 flex items-center gap-3">
                {stage === 'practice' && (
                  <>
                    <button
                      onClick={handleSubmit}
                      disabled={!allPlaced}
                      className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors"
                    >
                      Submit
                    </button>
                    <span
                      className={`text-sm font-mono font-bold tabular-nums ${
                        timeLeft <= 10 ? 'text-red-500' : 'text-gray-400'
                      }`}
                    >
                      {timeLeft}s
                    </span>
                  </>
                )}
                <button
                  onClick={handleReset}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  New practice set
                </button>
              </div>
            </section>
          </>
        )}

        {stage === 'summary' && (
          <ScoreSummary
            questions={questions}
            scores={scores}
            answers={answers}
            timings={timings}
            onRestart={handleReset}
          />
        )}
      </div>
    </div>
  )
}
