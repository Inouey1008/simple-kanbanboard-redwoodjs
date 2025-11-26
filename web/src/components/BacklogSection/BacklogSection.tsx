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

interface BacklogSectionProps {
  tasks: Task[]
  onAddTask?: () => void
  onEditTask?: (task: Task) => void
}

const BacklogSection = ({
  tasks,
  onAddTask,
  onEditTask,
}: BacklogSectionProps) => {

  return (
    <div className="space-y-4">
      {/* Backlog Header */}
      <div className="border-b border-gray-300 pb-2">
        <h2 className="text-lg font-semibold text-gray-900">▸ Backlog</h2>
      </div>

      {/* Backlog Tasks - simple vertical list, no status columns */}
      <div className="space-y-2">
        {tasks.length === 0 ? (
          <div className="rounded border border-dashed border-gray-300 p-8 text-center text-sm text-gray-400">
            Backlogにタスクはありません
          </div>
        ) : (
          <>
            {tasks
              .sort((a, b) => a.order - b.order)
              .map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={() => onEditTask?.(task)}
                />
              ))}
          </>
        )}

        {/* Add Task Button */}
        <button
          onClick={onAddTask}
          className="w-full rounded border border-dashed border-gray-300 py-2 text-sm text-gray-500 hover:border-gray-400 hover:text-gray-600"
        >
          + 追加
        </button>
      </div>
    </div>
  )
}

export default BacklogSection
