import { useState } from 'react'
import { expensesApi, type User } from '../api'
import toast from 'react-hot-toast'

interface Props {
  members: User[]
  currentUser: User
  roomId: string
  onClose: () => void
  onAdded: () => void
}

const CATEGORIES = [
  { key: 'food', label: 'อาหาร', icon: '🍔' },
  { key: 'transport', label: 'เดินทาง', icon: '🚗' },
  { key: 'accommodation', label: 'ที่พัก', icon: '🏨' },
  { key: 'shopping', label: 'ช้อปปิ้ง', icon: '🛍️' },
  { key: 'entertainment', label: 'บันเทิง', icon: '🎉' },
  { key: 'other', label: 'อื่นๆ', icon: '💡' },
]

export default function ExpenseForm({ members, currentUser, roomId, onClose, onAdded }: Props) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('food')
  const [payerId, setPayerId] = useState(currentUser.id)
  const [splitIds, setSplitIds] = useState<string[]>(members.map(m => m.id))
  const [loading, setLoading] = useState(false)

  const toggleSplit = (id: string) => {
    setSplitIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const handleSubmit = async () => {
    if (!description.trim()) return toast.error('กรุณาระบุชื่อรายการ')
    if (!amount || isNaN(+amount) || +amount <= 0) return toast.error('กรุณาระบุจำนวนเงินที่ถูกต้อง')
    if (splitIds.length === 0) return toast.error('กรุณาเลือกอย่างน้อย 1 คน')
    setLoading(true)
    try {
      await expensesApi.create({ description: description.trim(), amount: +amount, category, payerId, roomId, splitUserIds: splitIds })
      toast.success('เพิ่มรายการสำเร็จ!')
      onAdded()
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'เกิดข้อผิดพลาด')
    } finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-700"> เพิ่มรายการ</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
          </div>

          <div className="space-y-4">
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">ชื่อรายการ</label>
              <input className="input-field" placeholder="เช่น ข้าวกลางวัน, ตั๋วรถไฟ" value={description} onChange={e => setDescription(e.target.value)} />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">จำนวนเงิน (บาท)</label>
              <input className="input-field" type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">หมวดหมู่</label>
              <div className="grid grid-cols-3 gap-2">
                {CATEGORIES.map(c => (
                  <button
                    key={c.key}
                    onClick={() => setCategory(c.key)}
                    className={`py-2 rounded-xl text-sm font-medium flex flex-col items-center gap-0.5 border-2 transition-all ${category === c.key ? 'border-primary-400 bg-primary-50 text-primary-600' : 'border-gray-100 text-gray-500 hover:border-primary-200'}`}
                  >
                    <span className="text-xl">{c.icon}</span>
                    <span>{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Payer */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">ผู้จ่าย</label>
              <select className="input-field" value={payerId} onChange={e => setPayerId(e.target.value)}>
                {members.map(m => <option key={m.id} value={m.id}>{m.nickname}</option>)}
              </select>
            </div>

            {/* Split with */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">หารกับ (เลือกได้หลายคน)</label>
              <div className="space-y-2">
                {members.map(m => (
                  <label key={m.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-orange-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={splitIds.includes(m.id)}
                      onChange={() => toggleSplit(m.id)}
                      className="w-4 h-4 accent-orange-500"
                    />
                    <span className="font-medium text-gray-700">{m.nickname}</span>
                    {m.id === currentUser.id && <span className="text-xs text-primary-500">(คุณ)</span>}
                  </label>
                ))}
              </div>
            </div>

            <button className="btn-primary w-full" onClick={handleSubmit} disabled={loading}>
              {loading ? '⏳ กำลังบันทึก...' : '💾 บันทึกรายการ'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
