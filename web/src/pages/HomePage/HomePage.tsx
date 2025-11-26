import { Metadata } from '@redwoodjs/web'
import { PlusIcon } from '@heroicons/react/24/outline'
import KanbanBoard from 'src/components/KanbanBoard/KanbanBoard'

const HomePage = () => {
  const handleCreateEpic = () => {
    // TODO: Open Epic modal
    console.log('Create epic clicked')
  }

  return (
    <>
      <Metadata title="Kanban Board" description="Simple Kanban Board" />

      <div className="min-h-screen bg-white">
        {/* Page Header */}
        <header className="border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Kanban Board</h1>
            <button
              onClick={handleCreateEpic}
              className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <PlusIcon className="h-5 w-5" />
              エピック追加
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          <KanbanBoard />
        </main>
      </div>
    </>
  )
}

export default HomePage
