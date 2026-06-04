export function generateFragments(answer: string): string[] {
  const clean = answer.replace(/[.!?]+$/, '').trim()
  const chunks = chunkByWords(clean)
  return shuffle(chunks.map(lowercaseFirst))
}

const DISTRACTOR_POOL = [
  'however', 'although', 'despite', 'unless', 'therefore',
  'meanwhile', 'nevertheless', 'furthermore', 'consequently', 'previously',
  'suddenly', 'actually', 'certainly', 'obviously', 'apparently',
  'already', 'still', 'instead', 'somehow', 'elsewhere',
  'neither', 'whoever', 'whenever', 'whatever', 'wherever',
  'beyond', 'beneath', 'beside', 'toward', 'within',
]

export function generateDistractors(answer: string, count: number): string[] {
  const answerWords = new Set(answer.toLowerCase().replace(/[.!?]+$/, '').split(/\s+/))
  const pool = DISTRACTOR_POOL.filter((w) => !answerWords.has(w))
  return shuffle(pool).slice(0, count)
}

function chunkByWords(text: string): string[] {
  const words = text.split(/\s+/)

  if (words.length <= 1) return [text]

  const chunks: string[] = []
  let i = 0

  while (i < words.length) {
    const remaining = words.length - i
    // Strongly prefer 1-word chunks; occasionally take 2
    const size = remaining === 1 ? 1 : Math.random() < 0.65 ? 1 : 2
    chunks.push(words.slice(i, i + size).join(' '))
    i += size
  }

  return chunks
}

function lowercaseFirst(s: string): string {
  return s ? s[0].toLowerCase() + s.slice(1) : s
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
