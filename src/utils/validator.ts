export function normalize(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[.!?,;]+$/, '')
}

export function validateAnswer(userAnswer: string, expected: string): boolean {
  return normalize(userAnswer) === normalize(expected)
}
