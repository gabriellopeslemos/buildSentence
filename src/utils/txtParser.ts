export interface Question {
  prompt: string
  answer: string
}

export function parseTxt(content: string): Question[] {
  const questions: Question[] = []
  const lines = content.split('\n').map((l) => l.trim()).filter(Boolean)

  let currentPrompt = ''
  let currentAnswer = ''

  for (const line of lines) {
    if (line.toUpperCase().startsWith('PROMPT:')) {
      if (currentPrompt && currentAnswer) {
        questions.push({ prompt: currentPrompt, answer: currentAnswer })
      }
      currentPrompt = stripQuotes(line.slice(7).trim())
      currentAnswer = ''
    } else if (line.toUpperCase().startsWith('ANSWER:')) {
      currentAnswer = stripQuotes(line.slice(7).trim())
    }
  }

  if (currentPrompt && currentAnswer) {
    questions.push({ prompt: currentPrompt, answer: currentAnswer })
  }

  return questions
}

function stripQuotes(s: string): string {
  return s.replace(/^["']|["']$/g, '').trim()
}
