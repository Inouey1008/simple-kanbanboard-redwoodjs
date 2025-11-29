import { format } from 'date-fns'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Task {
  id: number
  title: string
  description?: string
  dueDate?: string
  status: string
  epicId?: number
  order: number
}

interface TaskCardProps {
  task: Task
  onClick?: () => void
}

const TaskCard = ({ task, onClick }: TaskCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const isOverdue =
    task.dueDate && new Date(task.dueDate) < new Date(new Date().setHours(0, 0, 0, 0))

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={`
        cursor-grab rounded border bg-white p-3 transition-colors active:cursor-grabbing
        ${isOverdue ? 'border-red-300 bg-red-50' : 'border-gray-200'}
        ${isDragging ? 'shadow-lg' : 'hover:border-gray-300 hover:shadow-sm'}
      `}
    >
      {/* Task Title */}
      <div className="text-sm font-semibold text-gray-900">{task.title}</div>

      {/* Due Date */}
      {task.dueDate && (
        <div
          className={`mt-1.5 text-xs ${
            isOverdue ? 'font-medium text-red-600' : 'text-gray-500'
          }`}
        >
          {format(new Date(task.dueDate), 'yyyy/MM/dd')}
        </div>
      )}
    </div>
  )
}

export default TaskCard
