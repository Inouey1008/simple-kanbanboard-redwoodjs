import { useState } from 'react'
import { useQuery, useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import EpicSection from 'src/components/EpicSection/EpicSection'
import BacklogSection from 'src/components/BacklogSection/BacklogSection'
import TaskModal from 'src/components/TaskModal/TaskModal'
import EpicModal from 'src/components/EpicModal/EpicModal'

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

const DELETE_EPIC_MUTATION = gql`
  mutation DeleteEpicMutation($id: Int!) {
    deleteEpic(id: $id) {
      id
    }
  }
`

const DELETE_TASK_MUTATION = gql`
  mutation DeleteTaskMutation($id: Int!) {
    deleteTask(id: $id) {
      id
    }
  }
`

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

const KanbanBoard = () => {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [isEpicModalOpen, setIsEpicModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [editingEpic, setEditingEpic] = useState<Epic | null>(null)
  const [taskDefaults, setTaskDefaults] = useState<{
    status?: string
    epicId?: number | null
  }>({})

  const { data: epicsData, loading: epicsLoading } = useQuery(EPICS_QUERY)
  const { data: tasksData, loading: tasksLoading } = useQuery(TASKS_QUERY)

  const [deleteEpic] = useMutation(DELETE_EPIC_MUTATION, {
    onCompleted: () => {
      toast.success('エピックを削除しました')
    },
    onError: (error) => {
      toast.error(`エラー: ${error.message}`)
    },
    refetchQueries: ['EpicsQuery', 'TasksQuery'],
  })

  const [deleteTask] = useMutation(DELETE_TASK_MUTATION, {
    onCompleted: () => {
      toast.success('タスクを削除しました')
    },
    onError: (error) => {
      toast.error(`エラー: ${error.message}`)
    },
    refetchQueries: ['TasksQuery'],
  })

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

  const handleEditEpic = (epic: Epic) => {
    setEditingEpic(epic)
    setIsEpicModalOpen(true)
  }

  const handleDeleteEpic = (epicId: number) => {
    if (confirm('このエピックを削除しますか？タスクはBacklogに移動されます。')) {
      deleteEpic({ variables: { id: epicId } })
    }
  }

  const handleAddTask = (status?: string, epicId?: number | null) => {
    setEditingTask(null)
    setTaskDefaults({ status, epicId })
    setIsTaskModalOpen(true)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setTaskDefaults({})
    setIsTaskModalOpen(true)
  }

  const handleDeleteTask = (taskId: number) => {
    if (confirm('このタスクを削除しますか？')) {
      deleteTask({ variables: { id: taskId } })
    }
  }

  const handleTaskModalClose = () => {
    setIsTaskModalOpen(false)
    setEditingTask(null)
    setTaskDefaults({})
  }

  const handleEpicModalClose = () => {
    setIsEpicModalOpen(false)
    setEditingEpic(null)
  }

  return (
    <>
      <div className="space-y-8">
        {/* Epic Sections */}
        {epics.map((epic) => {
          const epicTasks = tasks.filter((task) => task.epicId === epic.id)
          return (
            <EpicSection
              key={epic.id}
              epic={epic}
              tasks={epicTasks}
              onEdit={() => handleEditEpic(epic)}
              onDelete={() => handleDeleteEpic(epic.id)}
              onAddTask={(status) => handleAddTask(status, epic.id)}
              onEditTask={handleEditTask}
            />
          )
        })}

        {/* Backlog Section */}
        <BacklogSection
          tasks={backlogTasks}
          onAddTask={() => handleAddTask('TODO', null)}
          onEditTask={handleEditTask}
        />
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={handleTaskModalClose}
        task={editingTask}
        defaultStatus={taskDefaults.status}
        defaultEpicId={taskDefaults.epicId}
      />

      {/* Epic Modal */}
      <EpicModal
        isOpen={isEpicModalOpen}
        onClose={handleEpicModalClose}
        epic={editingEpic}
      />
    </>
  )
}

export default KanbanBoard
