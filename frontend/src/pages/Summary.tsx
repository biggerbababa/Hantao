import { useEffect, useState } from 'react'
import { summaryApi, type Settlement, type UserSummary } from '../api'
import { useAppStore } from '../store'
import toast from 'react-hot-toast'

export default function Summary() {
  const { room } = useAppStore()
  const [data, setData] = useState<{ totalsByUser: UserSummary[]; settlements: Settlement[] } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!room) return
    summaryApi.get(room.id)
      .then(setData)
      .catch(() => toast.error('โหลดสรุปไม่ได้'))
      .finally(() => setLoading(false))
  }, [room])

  if (loading) return <div className="text-center py-16 text-gray-400">⏳ กำลังคำนวณ...</div>
  if (!data) return null

  return (
    <div className="space-y-5">
      {/* Per Person Totals */}
      <div className="card">
        <h2 className="font-bold text-gray-700 mb-4">💰 สรุปค่าใช้จ่ายรายคน</h2>
        <div className="space-y-3">
          {data.totalsByUser.map(u => (
            <div key={u.userId} className="flex items-center justify-between p-3 rounded-xl bg-orange-50">
              <div>
                <p className="font-semibold text-gray-700">{u.nickname}</p>
                <p className="text-xs text-gray-400">จ่ายไปแล้ว ฿{u.totalPaid.toLocaleString()}</p>
              </div>
              <div className={`text-right`}>
                <p className={`font-bold ${u.netBalance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {u.netBalance >= 0 ? '+' : ''}{u.netBalance.toLocaleString()} ฿
                </p>
                <p className="text-xs text-gray-400">
                  {u.netBalance > 0 ? 'มีคนต้องจ่ายคืน' : u.netBalance < 0 ? 'ต้องจ่ายเพิ่ม' : 'เท่ากันพอดี ✓'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Settlements */}
      <div className="card">
        <h2 className="font-bold text-gray-700 mb-4">🔄 สรุปการโอนเงิน</h2>
        {data.settlements.length === 0 ? (
          <div className="text-center py-6 text-gray-400">
            <div className="text-3xl mb-2">🎉</div>
            <p>ทุกคนหารเท่ากันแล้ว!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.settlements.map((s, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-xl border-2 border-orange-100 bg-white">
                <div className="flex-1">
                  <p className="font-semibold text-gray-700">
                    <span className="text-red-500">{s.fromName}</span>
                    {' '}ต้องโอนให้{' '}
                    <span className="text-green-500">{s.toName}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-xl text-primary-600">฿{s.amount.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
