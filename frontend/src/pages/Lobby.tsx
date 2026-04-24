import { useEffect, useState } from 'react'
import { roomsApi, type User } from '../api'
import { useAppStore } from '../store'
import toast from 'react-hot-toast'

const avatarColors = [
  'bg-orange-400', 'bg-yellow-400', 'bg-pink-400', 'bg-purple-400',
  'bg-blue-400', 'bg-green-400', 'bg-red-400', 'bg-teal-400',
]

export default function Lobby() {
  const { room, user } = useAppStore()
  const [members, setMembers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMembers = async () => {
    if (!room) return
    try {
      const data = await roomsApi.getMembers(room.key)
      setMembers(data)
    } catch {
      toast.error('โหลดรายชื่อสมาชิกไม่ได้')
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchMembers() }, [room])

  const copyKey = () => {
    navigator.clipboard.writeText(room?.key || '')
    toast.success('คัดลอกรหัสห้องแล้ว!')
  }

  return (
    <div className="space-y-4">
      {/* Room Key Card */}
      <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
        <p className="text-sm opacity-80 mb-1">รหัสเชิญชวน</p>
        <div className="flex items-center gap-3">
          <span className="text-4xl font-bold tracking-widest">{room?.key}</span>
          <button
            onClick={copyKey}
            className="bg-white/20 hover:bg-white/30 rounded-lg px-3 py-1.5 text-sm font-medium transition-all"
          >
            📋 คัดลอก
          </button>
        </div>
        <p className="text-xs opacity-70 mt-2">แชร์รหัสนี้ให้เพื่อนเพื่อเข้าร่วมห้อง</p>
      </div>

      {/* Members */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-700">👥 สมาชิกในห้อง ({members.length} คน)</h2>
          <button onClick={fetchMembers} className="text-xs text-primary-500 hover:text-primary-600 font-medium">
            🔄 รีเฟรช
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-400">⏳ กำลังโหลด...</div>
        ) : members.length === 0 ? (
          <div className="text-center py-8 text-gray-400">ยังไม่มีสมาชิก</div>
        ) : (
          <ul className="space-y-2">
            {members.map((m, i) => (
              <li key={m.id} className="flex items-center gap-3 p-3 rounded-xl bg-orange-50">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${avatarColors[i % avatarColors.length]}`}>
                  {m.nickname[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-700">{m.nickname}</p>
                  {m.id === user?.id && (
                    <span className="text-xs text-primary-500 font-medium">คุณ</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
