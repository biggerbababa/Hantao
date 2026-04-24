import { useState } from 'react'
import JoinRoom from './pages/JoinRoom'
import Lobby from './pages/Lobby'
import Expenses from './pages/Expenses'
import Summary from './pages/Summary'
import { useAppStore } from './store'

type Page = 'join' | 'lobby' | 'expenses' | 'summary'

export default function App() {
  const { room, user, clearSession } = useAppStore()
  const [page, setPage] = useState<Page>(room && user ? 'lobby' : 'join')

  if (!room || !user) {
    return <JoinRoom onJoined={() => setPage('lobby')} />
  }

  return (
    <div className="min-h-screen bg-primary-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-orange-100 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-primary-600">🧾 หารเท่า</h1>
            <p className="text-xs text-gray-400">ห้อง: {room.name} · รหัส: <span className="font-semibold text-primary-500">{room.key}</span></p>
          </div>
          <button
            onClick={() => { clearSession(); setPage('join') }}
            className="text-xs text-gray-400 hover:text-red-400 transition-colors"
          >
            ออกห้อง
          </button>
        </div>
        {/* Nav */}
        <nav className="max-w-lg mx-auto px-4 flex gap-1 pb-2">
          {([['lobby', '👥 สมาชิก'], ['expenses', '💸 รายจ่าย'], ['summary', '📊 สรุป']] as [Page, string][]).map(([p, label]) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-all ${page === p ? 'bg-primary-500 text-white shadow-sm' : 'text-gray-500 hover:bg-primary-50'}`}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-lg mx-auto px-4 py-5">
        {page === 'lobby' && <Lobby />}
        {page === 'expenses' && <Expenses />}
        {page === 'summary' && <Summary />}
      </main>
    </div>
  )
}
