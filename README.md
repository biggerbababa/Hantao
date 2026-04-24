# หารเท่า (Hantao) 🧾

แอปหารค่าใช้จ่ายสำหรับนักเดินทาง

## โครงสร้างโปรเจค (Monorepo)

```
hantao/
├── backend/    # NestJS + Prisma + SQLite
└── frontend/   # React + Vite + Tailwind CSS
```

## วิธีติดตั้งและรัน

### 1. ติดตั้ง dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. ตั้งค่า Database (Backend)

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

### 3. รัน Backend

```bash
cd backend
npm run dev
# Backend จะรันที่ http://localhost:3000
```

### 4. รัน Frontend

```bash
cd frontend
npm run dev
# Frontend จะรันที่ http://localhost:5173
```

## API Endpoints

| Method | URL | คำอธิบาย |
|--------|-----|----------|
| POST | `/rooms` | สร้างห้องใหม่ |
| POST | `/rooms/join` | เข้าร่วมห้อง |
| GET | `/rooms/:key` | ดูข้อมูลห้อง |
| GET | `/rooms/:key/members` | ดูรายชื่อสมาชิก |
| POST | `/expenses` | เพิ่มรายการค่าใช้จ่าย |
| GET | `/expenses/room/:roomId` | ดูรายการทั้งหมดในห้อง |
| GET | `/summary/:roomId` | ดูสรุปว่าใครเป็นหนี้ใคร |
