import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import TaskCard from 'src/components/TaskCard/TaskCard'

interface Task {
  id: number
  title: string
  description?: string
  dueDate?: string
  status: string
  epicId?: number
  order: number
}

interface StatusColumnProps {
  status: string
  label: string
  tasks: Task[]
  epicId?: number | null
  onAddTask?: () => void
  onEditTask?: (task: Task) => void
}

const StatusColumn = ({
  status,
  label,
  tasks,
  epicId,
  onAddTask,
  onEditTask,
}: StatusColumnProps) => {
  const droppableId = `${epicId ?? 'backlog'}-${status}`
  const { setNodeRef, isOver } = useDroppable({
    id: droppableId,
    data: {
      status,
      epicId,
    },
  })

  return (
    <div className="space-y-2">
      <div
        ref={setNodeRef}
        className={`rounded border bg-gray-50 p-3 transition-colors ${
          isOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200'
        }`}
      >
        {/* Status Header */}
        <div className="mb-3 text-sm font-medium text-gray-700">
          {label} ({tasks.length})
        </div>

        {/* Task Cards */}
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => onEditTask?.(task)}
              />
            ))}

            {/* Add Task Button */}
            <button
              onClick={onAddTask}
              className="w-full rounded border border-dashed border-gray-300 py-2 text-sm text-gray-500 hover:border-gray-400 hover:text-gray-600"
            >
              + 追加
            </button>
          </div>
        </SortableContext>
      </div>
    </div>
  )
}

export default StatusColumn
