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
}

const BacklogSection = ({ tasks, onAddTask }: BacklogSectionProps) => {
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
                <div
                  key={task.id}
                  className="cursor-pointer rounded border border-gray-200 bg-white p-3 hover:border-gray-300"
                >
                  {/* Task Card component will be added in Commit 3 */}
                  <div className="text-sm font-medium text-gray-900">
                    {task.title}
                  </div>
                  {task.dueDate && (
                    <div className="mt-1 text-xs text-gray-500">
                      {new Date(task.dueDate).toLocaleDateString('ja-JP')}
                    </div>
                  )}
                </div>
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
