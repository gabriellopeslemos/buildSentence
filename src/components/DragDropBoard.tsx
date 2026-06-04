import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'

interface Fragment {
  id: string
  text: string
}

// ── Droppable slot ────────────────────────────────────────────────────────────

function Slot({
  index,
  fragment,
  onClear,
}: {
  index: number
  fragment: Fragment | null
  onClear: () => void
}) {
  const { isOver, setNodeRef } = useDroppable({ id: `slot-${index}` })

  return (
    <div
      ref={setNodeRef}
      onClick={fragment ? onClear : undefined}
      className={[
        'min-w-[88px] px-3 py-2 rounded-lg border-2 text-sm font-medium text-center transition-all select-none',
        fragment
          ? 'bg-blue-50 border-blue-400 text-gray-800 cursor-pointer hover:bg-red-50 hover:border-red-300'
          : isOver
            ? 'border-blue-400 bg-blue-50 border-dashed text-blue-400'
            : 'border-dashed border-gray-300 bg-white text-gray-300',
      ].join(' ')}
    >
      {fragment ? fragment.text : '___'}
    </div>
  )
}

// ── Draggable bank fragment ───────────────────────────────────────────────────

function BankFragment({
  fragment,
  isUsed,
  onClickUsed,
}: {
  fragment: Fragment
  isUsed: boolean
  onClickUsed: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: fragment.id,
  })

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={isUsed ? onClickUsed : undefined}
      {...attributes}
      {...listeners}
      className={[
        'px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all select-none',
        isDragging ? 'opacity-0' : '',
        isUsed
          ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-pointer'
          : 'bg-white border-gray-300 text-gray-700 cursor-grab active:cursor-grabbing hover:border-blue-400 hover:bg-blue-50',
      ].join(' ')}
    >
      {fragment.text}
    </div>
  )
}

// ── Board ─────────────────────────────────────────────────────────────────────

interface Props {
  allFragments: Fragment[]
  onChange: (slots: (Fragment | null)[]) => void
}

export function SentenceBoard({ allFragments, onChange }: Props) {
  const [slots, setSlots] = useState<(Fragment | null)[]>(() =>
    Array(allFragments.length).fill(null),
  )
  const [activeId, setActiveId] = useState<string | null>(null)

  const usedIds = new Set(slots.filter(Boolean).map((f) => f!.id))
  const activeFragment = activeId ? allFragments.find((f) => f.id === activeId) : null

  function applySlots(next: (Fragment | null)[]) {
    setSlots(next)
    onChange(next)
  }

  function clearSlot(index: number) {
    const next = [...slots]
    next[index] = null
    applySlots(next)
  }

  function clearSlotForFragment(fragmentId: string) {
    const index = slots.findIndex((s) => s?.id === fragmentId)
    if (index !== -1) clearSlot(index)
  }

  function handleDragStart({ active }: DragStartEvent) {
    setActiveId(active.id as string)
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveId(null)
    if (!over) return

    const draggedId = active.id as string
    const targetIndex = parseInt((over.id as string).replace('slot-', ''))
    if (isNaN(targetIndex)) return

    const draggedFragment = allFragments.find((f) => f.id === draggedId)
    if (!draggedFragment) return

    const sourceIndex = slots.findIndex((s) => s?.id === draggedId)
    const next = [...slots]

    if (sourceIndex !== -1 && sourceIndex !== targetIndex) {
      // Move between slots — swap
      next[targetIndex] = draggedFragment
      next[sourceIndex] = slots[targetIndex]
    } else if (sourceIndex === -1) {
      // Fresh from bank — place (no swap needed for the bank side)
      next[targetIndex] = draggedFragment
    }

    applySlots(next)
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="space-y-6">
        {/* Answer slots */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3 block">
            Your answer
          </span>
          <div className="flex flex-wrap gap-2">
            {slots.map((slot, i) => (
              <Slot key={i} index={i} fragment={slot} onClear={() => clearSlot(i)} />
            ))}
          </div>
        </div>

        {/* Fragment bank */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3 block">
            Available
          </span>
          <div className="flex flex-wrap gap-2">
            {allFragments.map((fragment) => (
              <BankFragment
                key={fragment.id}
                fragment={fragment}
                isUsed={usedIds.has(fragment.id)}
                onClickUsed={() => clearSlotForFragment(fragment.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeFragment && (
          <div className="px-4 py-2 rounded-lg border-2 border-blue-500 bg-blue-50 text-sm font-medium text-gray-800 shadow-lg cursor-grabbing select-none">
            {activeFragment.text}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
