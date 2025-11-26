import { useQuery } from '@redwoodjs/web'

const EPICS_QUERY = gql`
  query EpicsQuery {
    epics {
      id
      name
      description
    }
  }
`

const TASKS_QUERY = gql`
  query TasksQuery {
    tasks {
      id
      title
      description
      dueDate
      status
      epicId
      order
    }
  }
`

const KanbanBoard = () => {
  const { data: epicsData, loading: epicsLoading } = useQuery(EPICS_QUERY)
  const { data: tasksData, loading: tasksLoading } = useQuery(TASKS_QUERY)

  if (epicsLoading || tasksLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  const epics = epicsData?.epics || []
  const tasks = tasksData?.tasks || []

  // Separate tasks by epic and backlog
  const backlogTasks = tasks.filter((task) => task.epicId === null)

  return (
    <div className="space-y-8">
      {/* Epic Sections */}
      {epics.map((epic) => (
        <div key={epic.id} className="space-y-4">
          {/* Epic Section will be a separate component */}
          <div className="border-b border-gray-300 pb-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                ▸ {epic.name}
              </h2>
              <div className="flex gap-2">
                <button className="text-sm text-gray-600 hover:text-gray-900">
                  編集
                </button>
                <button className="text-sm text-gray-600 hover:text-gray-900">
                  ×
                </button>
              </div>
            </div>
          </div>

          {/* Status Row - will be implemented next */}
          <div className="text-gray-400 text-sm">Status columns coming soon...</div>
        </div>
      ))}

      {/* Backlog Section */}
      <div className="space-y-4">
        <div className="border-b border-gray-300 pb-2">
          <h2 className="text-lg font-semibold text-gray-900">▸ Backlog</h2>
        </div>

        {/* Backlog tasks - will be implemented next */}
        <div className="text-gray-400 text-sm">
          {backlogTasks.length} tasks in backlog
        </div>
      </div>
    </div>
  )
}

export default KanbanBoard
