import { useState } from 'react'
import { roomsApi } from '../api'
import { useAppStore } from '../store'
import toast from 'react-hot-toast'

interface Props { onJoined: () => void }

export default function JoinRoom({ onJoined }: Props) {
  const [tab, setTab] = useState<'create' | 'join'>('create')
  const [nickname, setNickname] = useState('')
  const [roomName, setRoomName] = useState('')
  const [roomKey, setRoomKey] = useState('')
  const [loading, setLoading] = useState(false)
  const setSession = useAppStore(s => s.setSession)

  const handleCreate = async () => {
    if (!nickname.trim() || !roomName.trim()) return toast.error('กรุณากรอกข้อมูลให้ครบ')
    setLoading(true)
    try {
      const data = await roomsApi.create(roomName.trim(), nickname.trim())
      setSession(data.room, data.user)
      toast.success(`สร้างห้อง "${data.room.name}" สำเร็จ! รหัส: ${data.room.key}`)
      onJoined()
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'เกิดข้อผิดพลาด')
    } finally { setLoading(false) }
  }

  const handleJoin = async () => {
    if (!nickname.trim() || !roomKey.trim()) return toast.error('กรุณากรอกข้อมูลให้ครบ')
    setLoading(true)
    try {
      const data = await roomsApi.join(roomKey.trim().toUpperCase(), nickname.trim())
      setSession(data.room, data.user)
      toast.success(`เข้าร่วมห้อง "${data.room.name}" สำเร็จ!`)
      onJoined()
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'เกิดข้อผิดพลาด')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-primary-50 flex flex-col items-center justify-center p-5">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="text-6xl mb-3">🧾</div>
        <h1 className="text-4xl font-bold text-primary-600">หารเท่า</h1>
        <p className="text-gray-500 mt-1">หารค่าใช้จ่ายสำหรับเพื่อนนักเดินทาง</p>
      </div>

      <div className="card w-full max-w-sm">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-orange-50 p-1 rounded-xl">
          <button
            onClick={() => setTab('create')}
            className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all ${tab === 'create' ? 'bg-primary-500 text-white shadow' : 'text-gray-500'}`}
          >
            ➕ สร้างห้อง
          </button>
          <button
            onClick={() => setTab('join')}
            className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all ${tab === 'join' ? 'bg-primary-500 text-white shadow' : 'text-gray-500'}`}
          >
            🔑 เข้าร่วมห้อง
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">ชื่อเล่นของคุณ</label>
            <input
              className="input-field"
              placeholder="เช่น มิน, อาย, เจ..."
              value={nickname}
              onChange={e => setNickname(e.target.value)}
            />
          </div>

          {tab === 'create' ? (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">ชื่อห้อง / ทริป</label>
              <input
                className="input-field"
                placeholder="เช่น ทริปเชียงใหม่ 2567"
                value={roomName}
                onChange={e => setRoomName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreate()}
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">รหัสห้อง</label>
              <input
                className="input-field uppercase tracking-widest font-bold text-lg text-center"
                placeholder="เช่น ABC123"
                value={roomKey}
                onChange={e => setRoomKey(e.target.value.toUpperCase())}
                maxLength={6}
                onKeyDown={e => e.key === 'Enter' && handleJoin()}
              />
            </div>
          )}

          <button
            className="btn-primary w-full mt-2"
            onClick={tab === 'create' ? handleCreate : handleJoin}
            disabled={loading}
          >
            {loading ? '⏳ กำลังโหลด...' : tab === 'create' ? '🚀 สร้างห้อง' : '🚪 เข้าร่วมห้อง'}
          </button>
        </div>
      </div>
    </div>
  )
}
