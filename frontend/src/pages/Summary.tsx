import { useEffect, useState } from 'react'
import { expensesApi, summaryApi, type Expense, type Settlement } from '../api'
import { useAppStore } from '../store'
import toast from 'react-hot-toast'

const CATEGORY_ICON: Record<string, string> = {
  food: '🍔', transport: '🚗', accommodation: '🏨',
  entertainment: '🎉', shopping: '🛍️', other: '🧾',
}

export default function Summary() {
  const { room } = useAppStore()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [settlements, setSettlements] = useState<Settlement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!room) return
    Promise.all([
      expensesApi.getByRoom(room.id),
      summaryApi.get(room.id),
    ])
      .then(([exps, summary]) => {
        setExpenses(exps)
        setSettlements(summary.settlements)
      })
      .catch(() => toast.error('โหลดสรุปไม่ได้'))
      .finally(() => setLoading(false))
  }, [room])

  if (loading) return <div className="text-center py-16 text-gray-400">⏳ กำลังคำนวณ...</div>

  return (
    <div className="space-y-5">

      {/* ── Bill-by-Bill breakdown ── */}
      <div className="card">
        <h2 className="font-bold text-gray-700 mb-4">🧾 รายการค่าใช้จ่าย</h2>
        {expenses.length === 0 ? (
          <p className="text-center text-gray-400 py-6">ยังไม่มีรายการ</p>
        ) : (
          <div className="space-y-4">
            {expenses.map(exp => {
              const perPerson = exp.splits.length > 0
                ? Math.round((exp.amount / exp.splits.length) * 100) / 100
                : 0
              const icon = CATEGORY_ICON[exp.category] ?? '🧾'

              return (
                <div key={exp.id} className="rounded-2xl border border-orange-100 overflow-hidden shadow-sm">
                  {/* Header row */}
                  <div className="flex items-center justify-between px-4 py-3 bg-orange-50">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{icon}</span>
                      <div>
                        <p className="font-semibold text-gray-800">{exp.description}</p>
                        <p className="text-xs text-gray-400">
                          จ่ายโดย <span className="font-medium text-orange-500">{exp.payer.nickname}</span>
                          {' · '}หาร {exp.splits.length} คน
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-lg text-orange-500">฿{exp.amount.toLocaleString()}</p>
                  </div>

                  {/* Per-person rows */}
                  <div className="divide-y divide-orange-50">
                    {exp.splits.map((s, idx) => {
                      const isSelf = s.user.id === exp.payerId
                      return (
                        <div
                          key={idx}
                          className={`flex items-center justify-between px-4 py-2.5 ${isSelf ? 'bg-green-50' : 'bg-white'}`}
                        >
                          <div className="flex items-center gap-2">
                            {/* colored dot */}
                            <span className={`w-2 h-2 rounded-full ${isSelf ? 'bg-green-400' : 'bg-orange-300'}`} />
                            <span className="text-sm font-medium text-gray-700">{s.user.nickname}</span>
                            {isSelf && (
                              <span className="text-xs text-green-500 bg-green-100 px-1.5 py-0.5 rounded-full">คนจ่าย</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-sm">
                            {isSelf ? (
                              <span className="text-green-500 font-semibold">ไม่ต้องโอน ✓</span>
                            ) : (
                              <>
                                <span className="text-gray-500">โอน</span>
                                <span className="font-bold text-orange-500">฿{perPerson.toLocaleString()}</span>
                                <span className="text-gray-500">ให้</span>
                                <span className="font-semibold text-gray-700">{exp.payer.nickname}</span>
                              </>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Final settlement ── */}
      <div className="card">
        <h2 className="font-bold text-gray-700 mb-4">🔄 สรุปการโอนเงินทั้งหมด</h2>
        {settlements.length === 0 ? (
          <div className="text-center py-6 text-gray-400">
            <div className="text-3xl mb-2">🎉</div>
            <p>ทุกคนหารเท่ากันแล้ว!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {settlements.map((s, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-xl border-2 border-orange-100 bg-white">
                <div className="flex-1 flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-red-500 bg-red-50 px-2 py-1 rounded-lg">{s.fromName}</span>
                  <span className="text-gray-400 text-sm">→ โอนให้ →</span>
                  <span className="font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-lg">{s.toName}</span>
                </div>
                <p className="font-bold text-xl text-orange-500 shrink-0">฿{s.amount.toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
