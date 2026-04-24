import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const api = axios.create({ baseURL: BASE_URL })

export interface Room { id: string; key: string; name: string }
export interface User { id: string; nickname: string; roomId: string }
export interface Expense {
  id: string; description: string; amount: number; category: string;
  payerId: string; roomId: string; createdAt: string;
  payer: User; splits: { user: User }[]
}
export interface Settlement { from: string; fromName: string; to: string; toName: string; amount: number }
export interface UserSummary { userId: string; nickname: string; totalPaid: number; netBalance: number }

export const roomsApi = {
  create: (name: string, nickname: string) =>
    api.post<{ room: Room; user: User }>('/rooms', { name, nickname }).then(r => r.data),
  join: (key: string, nickname: string) =>
    api.post<{ room: Room; user: User }>('/rooms/join', { key, nickname }).then(r => r.data),
  getByKey: (key: string) =>
    api.get<Room & { users: User[] }>(`/rooms/${key}`).then(r => r.data),
  getMembers: (key: string) =>
    api.get<User[]>(`/rooms/${key}/members`).then(r => r.data),
}

export const expensesApi = {
  create: (data: { description: string; amount: number; category: string; payerId: string; roomId: string; splitUserIds: string[] }) =>
    api.post<Expense>('/expenses', data).then(r => r.data),
  getByRoom: (roomId: string) =>
    api.get<Expense[]>(`/expenses/room/${roomId}`).then(r => r.data),
}

export const summaryApi = {
  get: (roomId: string) =>
    api.get<{ totalsByUser: UserSummary[]; settlements: Settlement[] }>(`/summary/${roomId}`).then(r => r.data),
}
