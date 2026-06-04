import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Fragment {
  id: string
  text: string
}

interface SortableFragmentProps {
  fragment: Fragment
}

function SortableFragment({ fragment }: SortableFragmentProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: fragment.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing select-none bg-white border-2 border-blue-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-800 shadow-sm hover:border-blue-500 hover:shadow-md transition-all"
    >
      {fragment.text}
    </div>
  )
}

interface Props {
  fragments: Fragment[]
  onChange: (fragments: Fragment[]) => void
}

export function DragDropBoard({ fragments, onChange }: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = fragments.findIndex((f) => f.id === active.id)
      const newIndex = fragments.findIndex((f) => f.id === over.id)
      onChange(arrayMove(fragments, oldIndex, newIndex))
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={fragments.map((f) => f.id)} strategy={horizontalListSortingStrategy}>
        <div className="flex flex-wrap gap-3 p-4 min-h-[72px] bg-blue-50 border-2 border-dashed border-blue-200 rounded-xl">
          {fragments.map((fragment) => (
            <SortableFragment key={fragment.id} fragment={fragment} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
