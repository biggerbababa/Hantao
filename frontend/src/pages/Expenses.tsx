import { useEffect, useState } from 'react'
import { expensesApi, roomsApi, type Expense, type User } from '../api'
import { useAppStore } from '../store'
import toast from 'react-hot-toast'
import ExpenseForm from '../components/ExpenseForm'

const categoryIcon: Record<string, string> = {
  food: '🍔', transport: '🚗', accommodation: '🏨',
  shopping: '🛍️', entertainment: '🎉', other: '💡',
}
const categoryLabel: Record<string, string> = {
  food: 'อาหาร', transport: 'เดินทาง', accommodation: 'ที่พัก',
  shopping: 'ช้อปปิ้ง', entertainment: 'บันเทิง', other: 'อื่นๆ',
}

export default function Expenses() {
  const { room, user } = useAppStore()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [members, setMembers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  const fetchData = async () => {
    if (!room) return
    setLoading(true)
    try {
      const [exp, mem] = await Promise.all([
        expensesApi.getByRoom(room.id),
        roomsApi.getMembers(room.key),
      ])
      setExpenses(exp)
      setMembers(mem)
    } catch { toast.error('โหลดข้อมูลไม่ได้') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [room])

  const total = expenses.reduce((s, e) => s + e.amount, 0)

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <div className="card flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400">ค่าใช้จ่ายรวม</p>
          <p className="text-2xl font-bold text-primary-600">฿{total.toLocaleString()}</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          ➕ เพิ่มรายการ
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-10 text-gray-400">⏳ กำลังโหลด...</div>
      ) : expenses.length === 0 ? (
        <div className="card text-center py-10 text-gray-400">
          <div className="text-4xl mb-2">🧾</div>
          <p>ยังไม่มีรายการค่าใช้จ่าย</p>
          <p className="text-sm mt-1">กด "เพิ่มรายการ" เพื่อเริ่มบันทึก</p>
        </div>
      ) : (
        <div className="space-y-3">
          {expenses.map(exp => (
            <div key={exp.id} className="card flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center text-xl flex-shrink-0">
                {categoryIcon[exp.category] || '💡'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-700 truncate">{exp.description}</p>
                <p className="text-xs text-gray-400">
                  {categoryLabel[exp.category] || exp.category} · จ่ายโดย{' '}
                  <span className="text-primary-500 font-medium">{exp.payer.nickname}</span>
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  หารกับ: {exp.splits.map(s => s.user.nickname).join(', ')}
                </p>
              </div>
              <p className="font-bold text-primary-600 whitespace-nowrap">฿{exp.amount.toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <ExpenseForm
          members={members}
          currentUser={user!}
          roomId={room!.id}
          onClose={() => setShowForm(false)}
          onAdded={() => { setShowForm(false); fetchData() }}
        />
      )}
    </div>
  )
}
