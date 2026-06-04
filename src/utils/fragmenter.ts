export function generateFragments(answer: string): string[] {
  const clean = answer.replace(/[.!?]+$/, '').trim()
  const chunks = chunkByWords(clean)
  return shuffle(chunks.map(lowercaseFirst))
}

function chunkByWords(text: string): string[] {
  const words = text.split(/\s+/)

  // Too short to split meaningfully
  if (words.length <= 3) return [text]

  const chunks: string[] = []
  let i = 0

  while (i < words.length) {
    const remaining = words.length - i
    // Pick chunk size 2 or 3, but never leave a 1-word orphan at the end
    const maxSize = remaining <= 4 ? remaining : 3
    const size = maxSize <= 2 ? maxSize : Math.random() < 0.5 ? 2 : 3
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
