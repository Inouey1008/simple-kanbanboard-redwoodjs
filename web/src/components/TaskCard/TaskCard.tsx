import { format } from 'date-fns'

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
  const isOverdue =
    task.dueDate && new Date(task.dueDate) < new Date(new Date().setHours(0, 0, 0, 0))

  return (
    <div
      onClick={onClick}
      className={`
        cursor-pointer rounded border bg-white p-3 transition-colors
        ${isOverdue ? 'border-red-300 bg-red-50' : 'border-gray-200'}
        hover:border-gray-300 hover:shadow-sm
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
