import { useQuery } from '@redwoodjs/web'
import EpicSection from 'src/components/EpicSection/EpicSection'
import BacklogSection from 'src/components/BacklogSection/BacklogSection'

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

  const handleEditEpic = (epicId: number) => {
    // TODO: Open Epic edit modal
    console.log('Edit epic:', epicId)
  }

  const handleDeleteEpic = (epicId: number) => {
    // TODO: Confirm and delete epic
    console.log('Delete epic:', epicId)
  }

  const handleAddTask = (epicId?: number, status?: string) => {
    // TODO: Open Task create modal
    console.log('Add task:', { epicId, status })
  }

  return (
    <div className="space-y-8">
      {/* Epic Sections */}
      {epics.map((epic) => {
        const epicTasks = tasks.filter((task) => task.epicId === epic.id)
        return (
          <EpicSection
            key={epic.id}
            epic={epic}
            tasks={epicTasks}
            onEdit={() => handleEditEpic(epic.id)}
            onDelete={() => handleDeleteEpic(epic.id)}
          />
        )
      })}

      {/* Backlog Section */}
      <BacklogSection
        tasks={backlogTasks}
        onAddTask={() => handleAddTask()}
      />
    </div>
  )
}

export default KanbanBoard
