import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useMutation, useQuery } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import { format } from 'date-fns'

const EPICS_QUERY = gql`
  query EpicsForTaskModal {
    epics {
      id
      name
    }
  }
`

const CREATE_TASK_MUTATION = gql`
  mutation CreateTaskMutation($input: CreateTaskInput!) {
    createTask(input: $input) {
      id
      title
      description
      dueDate
      status
      epicId
    }
  }
`

const UPDATE_TASK_MUTATION = gql`
  mutation UpdateTaskMutation($id: Int!, $input: UpdateTaskInput!) {
    updateTask(id: $id, input: $input) {
      id
      title
      description
      dueDate
      status
      epicId
    }
  }
`

interface Task {
  id?: number
  title: string
  description?: string
  dueDate?: string
  status: string
  epicId?: number
  order?: number
}

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  task?: Task | null
  defaultStatus?: string
  defaultEpicId?: number | null
  onSuccess?: () => void
}

const STATUSES = [
  { value: 'TODO', label: 'ToDo' },
  { value: 'DOING', label: 'Doing' },
  { value: 'REVIEW', label: 'Review' },
  { value: 'DONE', label: 'Done' },
]

const TaskModal = ({
  isOpen,
  onClose,
  task,
  defaultStatus = 'TODO',
  defaultEpicId = null,
  onSuccess,
}: TaskModalProps) => {
  const [title, setTitle] = useState(task?.title || '')
  const [description, setDescription] = useState(task?.description || '')
  const [dueDate, setDueDate] = useState(
    task?.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : ''
  )
  const [status, setStatus] = useState(task?.status || defaultStatus)
  const [epicId, setEpicId] = useState<number | null>(
    task?.epicId !== undefined ? task.epicId : defaultEpicId
  )

  const { data: epicsData } = useQuery(EPICS_QUERY)
  const epics = epicsData?.epics || []

  // Update form when task prop changes
  useEffect(() => {
    if (task) {
      setTitle(task.title || '')
      setDescription(task.description || '')
      setDueDate(task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : '')
      setStatus(task.status || 'TODO')
      setEpicId(task.epicId !== undefined ? task.epicId : null)
    } else {
      setStatus(defaultStatus)
      setEpicId(defaultEpicId)
    }
  }, [task, defaultStatus, defaultEpicId])

  const [createTask, { loading: creating }] = useMutation(CREATE_TASK_MUTATION, {
    onCompleted: () => {
      toast.success('タスクを作成しました')
      onSuccess?.()
      handleClose()
    },
    onError: (error) => {
      toast.error(`エラー: ${error.message}`)
    },
    refetchQueries: ['TasksQuery'],
  })

  const [updateTask, { loading: updating }] = useMutation(UPDATE_TASK_MUTATION, {
    onCompleted: () => {
      toast.success('タスクを更新しました')
      onSuccess?.()
      handleClose()
    },
    onError: (error) => {
      toast.error(`エラー: ${error.message}`)
    },
    refetchQueries: ['TasksQuery'],
  })

  const handleClose = () => {
    setTitle('')
    setDescription('')
    setDueDate('')
    setStatus('TODO')
    setEpicId(null)
    onClose()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast.error('タイトルを入力してください')
      return
    }

    const input = {
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      status,
      epicId: epicId || undefined,
    }

    if (task?.id) {
      updateTask({ variables: { id: task.id, input } })
    } else {
      createTask({ variables: { input } })
    }
  }

  const isLoading = creating || updating

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title className="text-lg font-semibold text-gray-900">
                    {task ? 'タスクを編集' : 'タスクを作成'}
                  </Dialog.Title>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      タイトル <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="タスクのタイトルを入力"
                      disabled={isLoading}
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      説明
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="説明を入力（任意）"
                      rows={3}
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      締切日
                    </label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ステータス
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      disabled={isLoading}
                    >
                      {STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      エピック
                    </label>
                    <select
                      value={epicId === null ? '' : epicId}
                      onChange={(e) =>
                        setEpicId(e.target.value ? parseInt(e.target.value) : null)
                      }
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      disabled={isLoading}
                    >
                      <option value="">Backlog</option>
                      {epics.map((epic) => (
                        <option key={epic.id} value={epic.id}>
                          {epic.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      disabled={isLoading}
                    >
                      キャンセル
                    </button>
                    <button
                      type="submit"
                      className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                      disabled={isLoading}
                    >
                      {isLoading ? '保存中...' : task ? '更新' : '作成'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default TaskModal
