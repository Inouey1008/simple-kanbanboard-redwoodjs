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
  onAddTask?: () => void
}

const StatusColumn = ({ status, label, tasks, onAddTask }: StatusColumnProps) => {
  const handleTaskClick = (taskId: number) => {
    // TODO: Open Task edit modal
    console.log('Edit task:', taskId)
  }

  return (
    <div className="space-y-2">
      <div className="rounded border border-gray-200 bg-gray-50 p-3">
        {/* Status Header */}
        <div className="mb-3 text-sm font-medium text-gray-700">
          {label} ({tasks.length})
        </div>

        {/* Task Cards */}
        <div className="space-y-2">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => handleTaskClick(task.id)}
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
      </div>
    </div>
  )
}

export default StatusColumn
