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
  const n = words.length

  if (n === 0) return []

  // Always produce 5–7 chunks, capped by word count
  const minChunks = Math.min(5, n)
  const maxChunks = Math.min(7, n)
  const target =
    minChunks === maxChunks
      ? minChunks
      : minChunks + Math.floor(Math.random() * (maxChunks - minChunks + 1))

  const base = Math.floor(n / target)
  const remainder = n % target

  const chunks: string[] = []
  let i = 0
  for (let c = 0; c < target; c++) {
    const size = c < remainder ? base + 1 : base
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
