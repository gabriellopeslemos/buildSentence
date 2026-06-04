import { useState, useEffect } from 'react'

interface Fragment {
  id: string
  text: string
}

interface Props {
  allFragments: Fragment[]
  onChange: (slots: (Fragment | null)[]) => void
}

export function SentenceBoard({ allFragments, onChange }: Props) {
  const [slots, setSlots] = useState<(Fragment | null)[]>(() =>
    Array(allFragments.length).fill(null),
  )
  const [bank, setBank] = useState<Fragment[]>(allFragments)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    onChange(slots)
  }, [slots, onChange])

  function clickBankFragment(id: string) {
    setSelectedId((prev) => (prev === id ? null : id))
  }

  function clickSlot(index: number) {
    const current = slots[index]

    if (current) {
      // Return placed fragment to bank
      setSlots((prev) => {
        const next = [...prev]
        next[index] = null
        return next
      })
      setBank((prev) => [...prev, current])
      setSelectedId(null)
      return
    }

    if (!selectedId) return

    const fragment = bank.find((f) => f.id === selectedId)
    if (!fragment) return

    setSlots((prev) => {
      const next = [...prev]
      next[index] = fragment
      return next
    })
    setBank((prev) => prev.filter((f) => f.id !== selectedId))
    setSelectedId(null)
  }

  return (
    <div className="space-y-6">
      {/* Answer slots */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3 block">
          Your answer
        </span>
        <div className="flex flex-wrap gap-2">
          {slots.map((slot, i) => (
            <button
              key={i}
              onClick={() => clickSlot(i)}
              className={`
                min-w-[80px] px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all
                ${
                  slot
                    ? 'bg-blue-50 border-blue-400 text-gray-800 hover:border-red-300 hover:bg-red-50'
                    : selectedId
                      ? 'border-dashed border-blue-400 bg-white text-blue-300 cursor-pointer hover:bg-blue-50'
                      : 'border-dashed border-gray-300 bg-white text-gray-300 cursor-default'
                }
              `}
            >
              {slot ? slot.text : '___'}
            </button>
          ))}
        </div>
      </div>

      {/* Fragment bank */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3 block">
          Available
        </span>
        <div className="flex flex-wrap gap-2">
          {bank.length === 0 && (
            <span className="text-sm text-gray-400 italic">All fragments placed</span>
          )}
          {bank.map((fragment) => (
            <button
              key={fragment.id}
              onClick={() => clickBankFragment(fragment.id)}
              className={`
                px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all
                ${
                  selectedId === fragment.id
                    ? 'bg-blue-100 border-blue-500 text-blue-800 ring-2 ring-blue-400 ring-offset-1'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-blue-400 hover:bg-blue-50'
                }
              `}
            >
              {fragment.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
