import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

const CREATE_EPIC_MUTATION = gql`
  mutation CreateEpicMutation($input: CreateEpicInput!) {
    createEpic(input: $input) {
      id
      name
      description
    }
  }
`

const UPDATE_EPIC_MUTATION = gql`
  mutation UpdateEpicMutation($id: Int!, $input: UpdateEpicInput!) {
    updateEpic(id: $id, input: $input) {
      id
      name
      description
    }
  }
`

interface Epic {
  id?: number
  name: string
  description?: string
}

interface EpicModalProps {
  isOpen: boolean
  onClose: () => void
  epic?: Epic | null
  onSuccess?: () => void
}

const EpicModal = ({ isOpen, onClose, epic, onSuccess }: EpicModalProps) => {
  const [name, setName] = useState(epic?.name || '')
  const [description, setDescription] = useState(epic?.description || '')

  const [createEpic, { loading: creating }] = useMutation(CREATE_EPIC_MUTATION, {
    onCompleted: () => {
      toast.success('エピックを作成しました')
      onSuccess?.()
      handleClose()
    },
    onError: (error) => {
      toast.error(`エラー: ${error.message}`)
    },
    refetchQueries: ['EpicsQuery'],
  })

  const [updateEpic, { loading: updating }] = useMutation(UPDATE_EPIC_MUTATION, {
    onCompleted: () => {
      toast.success('エピックを更新しました')
      onSuccess?.()
      handleClose()
    },
    onError: (error) => {
      toast.error(`エラー: ${error.message}`)
    },
    refetchQueries: ['EpicsQuery'],
  })

  const handleClose = () => {
    setName('')
    setDescription('')
    onClose()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error('エピック名を入力してください')
      return
    }

    const input = {
      name: name.trim(),
      description: description.trim() || undefined,
    }

    if (epic?.id) {
      updateEpic({ variables: { id: epic.id, input } })
    } else {
      createEpic({ variables: { input } })
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
                    {epic ? 'エピックを編集' : 'エピックを作成'}
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
                      エピック名 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="エピック名を入力"
                      disabled={isLoading}
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
                      {isLoading ? '保存中...' : epic ? '更新' : '作成'}
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

export default EpicModal
