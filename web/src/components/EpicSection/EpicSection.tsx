import StatusColumn from 'src/components/StatusColumn/StatusColumn'

interface Epic {
  id: number
  name: string
  description?: string
}

interface Task {
  id: number
  title: string
  description?: string
  dueDate?: string
  status: string
  epicId?: number
  order: number
}

interface EpicSectionProps {
  epic: Epic
  tasks: Task[]
  onEdit?: () => void
  onDelete?: () => void
}

const STATUSES = ['TODO', 'DOING', 'REVIEW', 'DONE']
const STATUS_LABELS = {
  TODO: 'ToDo',
  DOING: 'Doing',
  REVIEW: 'Review',
  DONE: 'Done',
}

const EpicSection = ({ epic, tasks, onEdit, onDelete }: EpicSectionProps) => {
  // Group tasks by status
  const tasksByStatus = STATUSES.reduce((acc, status) => {
    acc[status] = tasks
      .filter((task) => task.status === status)
      .sort((a, b) => a.order - b.order)
    return acc
  }, {} as Record<string, Task[]>)

  const handleAddTask = (status: string) => {
    // TODO: Open Task create modal with epic and status pre-selected
    console.log('Add task to epic', epic.id, 'with status', status)
  }

  return (
    <div className="space-y-4">
      {/* Epic Header */}
      <div className="border-b border-gray-300 pb-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            ▸ {epic.name}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              編集
            </button>
            <button
              onClick={onDelete}
              className="text-sm text-red-600 hover:text-red-900"
            >
              ×
            </button>
          </div>
        </div>
      </div>

      {/* Status Row */}
      <div className="grid grid-cols-4 gap-4">
        {STATUSES.map((status) => (
          <StatusColumn
            key={status}
            status={status}
            label={STATUS_LABELS[status]}
            tasks={tasksByStatus[status]}
            onAddTask={() => handleAddTask(status)}
          />
        ))}
      </div>
    </div>
  )
}

export default EpicSection
