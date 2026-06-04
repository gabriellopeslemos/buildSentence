import nlp from 'compromise'

export function generateFragments(answer: string): string[] {
  const doc = nlp(answer)

  const chunks: string[] = []

  // Extract noun phrases, verb phrases, prepositional phrases, clauses
  const clauses = doc.clauses().out('array') as string[]
  if (clauses.length >= 2) {
    return shuffle(clauses.map((c) => c.trim()).filter(Boolean))
  }

  // Fallback: split on common conjunctions and relative pronouns
  const parts = splitOnBoundaries(answer)
  if (parts.length >= 2) {
    return shuffle(parts)
  }

  // Last resort: noun phrases + remainder
  const nps = doc.match('#Determiner? #Adjective* #Noun+').out('array') as string[]
  const remaining = removeAll(answer, nps)
  chunks.push(...nps, ...remaining)

  const result = chunks.map((c) => c.trim()).filter(Boolean)
  return result.length >= 2 ? shuffle(result) : shuffle(splitFallback(answer))
}

function splitOnBoundaries(sentence: string): string[] {
  // Split on relative pronouns (who, which, that, where, when) and subordinating conjunctions
  const boundary = /\b(who|which|that|where|when|because|although|since|while|after|before|if|unless|so that)\b/i
  const match = sentence.search(boundary)
  if (match === -1) return []

  const first = sentence.slice(0, match).trim()
  const rest = sentence.slice(match).trim()
  if (!first || !rest) return []

  // If rest is still long, try to split it further
  const subMatch = rest.slice(1).search(boundary)
  if (subMatch !== -1 && subMatch + 1 < rest.length - 4) {
    const pivot = subMatch + 1
    return [first, rest.slice(0, pivot).trim(), rest.slice(pivot).trim()].filter(Boolean)
  }

  return [first, rest]
}

function removeAll(sentence: string, phrases: string[]): string[] {
  let remaining = sentence
  for (const p of phrases) {
    remaining = remaining.replace(p, '')
  }
  return remaining
    .split(/,|\s{2,}/)
    .map((s) => s.trim())
    .filter(Boolean)
}

function splitFallback(sentence: string): string[] {
  // Split roughly in half at a word boundary near the midpoint
  const words = sentence.split(' ')
  if (words.length <= 2) return [sentence]
  const mid = Math.ceil(words.length / 2)
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')]
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
