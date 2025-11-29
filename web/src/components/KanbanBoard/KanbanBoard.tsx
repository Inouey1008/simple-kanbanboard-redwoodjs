import { useState } from 'react'
import { useQuery, useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import EpicSection from 'src/components/EpicSection/EpicSection'
import BacklogSection from 'src/components/BacklogSection/BacklogSection'
import TaskModal from 'src/components/TaskModal/TaskModal'
import EpicModal from 'src/components/EpicModal/EpicModal'
import TaskCard from 'src/components/TaskCard/TaskCard'

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

const MOVE_TASK_MUTATION = gql`
  mutation MoveTaskMutation($id: Int!, $status: String!, $epicId: Int, $order: Float!) {
    moveTask(id: $id, status: $status, epicId: $epicId, order: $order) {
      id
      status
      epicId
      order
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
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const { data: epicsData, loading: epicsLoading } = useQuery(EPICS_QUERY)
  const { data: tasksData, loading: tasksLoading } = useQuery(TASKS_QUERY)

  const [moveTask] = useMutation(MOVE_TASK_MUTATION, {
    onCompleted: () => {
      toast.success('タスクを移動しました')
    },
    onError: (error) => {
      toast.error(`エラー: ${error.message}`)
    },
    refetchQueries: ['TasksQuery'],
  })

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

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id)
    setActiveTask(task || null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const taskId = Number(active.id)
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    // Get new status and epicId from drop target
    const newStatus = over.data.current?.status
    const newEpicId = over.data.current?.epicId

    // If dropped in backlog (no status), keep current status
    const finalStatus = newStatus || task.status
    const finalEpicId = newEpicId !== undefined ? newEpicId : task.epicId

    // Get all tasks in the destination
    const destinationTasks = tasks
      .filter((t) => {
        const matchesStatus = finalStatus ? t.status === finalStatus : true
        const matchesEpic = finalEpicId !== undefined ? t.epicId === finalEpicId : t.epicId === null
        return matchesStatus && matchesEpic && t.id !== taskId
      })
      .sort((a, b) => a.order - b.order)

    // Calculate new order based on drop position
    let newOrder: number

    if (destinationTasks.length === 0) {
      // First task in this column
      newOrder = 1000
    } else {
      const overIndex = destinationTasks.findIndex((t) => t.id === over.id)

      if (overIndex === -1) {
        // Dropped at the end
        newOrder = destinationTasks[destinationTasks.length - 1].order + 1000
      } else if (overIndex === 0) {
        // Dropped at the beginning
        newOrder = destinationTasks[0].order - 1000
      } else {
        // Dropped in the middle
        const prevOrder = destinationTasks[overIndex - 1].order
        const nextOrder = destinationTasks[overIndex].order
        newOrder = (prevOrder + nextOrder) / 2
      }
    }

    // Update if something changed
    if (
      finalStatus !== task.status ||
      finalEpicId !== task.epicId ||
      Math.abs(newOrder - task.order) > 0.01
    ) {
      moveTask({
        variables: {
          id: taskId,
          status: finalStatus,
          epicId: finalEpicId,
          order: newOrder,
        },
      })
    }
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
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

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>

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
