# Quiz App - Quick Start Guide

## ✅ All Issues Fixed

### Problems Resolved:
1. **Port Alignment** - Backend now on 4001, frontend configured correctly
2. **CORS Configuration** - Added DELETE and PUT methods
3. **API Integration** - Fixed payload format mismatch
4. **Options Format** - Admin now transforms choices array to {a, b, c, d} format
5. **Type Field Removed** - Backend doesn't use type, removed from frontend
6. **Cache Cleanup** - Removed corrupted .next build artifacts

## 🚀 How to Start

### Terminal 1 - Backend:
```bash
cd backend
npm run dev
```
**Expected output:** `Server running on 4001`

### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```
**Expected output:** `Ready on http://localhost:3000`

## 🧪 Test the Integration

### 1. Check Backend Health:
```bash
curl http://localhost:4001/api/health
```
Expected: `{"status":"ok"}`

### 2. List Quizzes:
```bash
curl http://localhost:4001/api/quizzes
```

### 3. Create a Quiz (valid format):
```bash
curl -X POST http://localhost:4001/api/quizzes \
  -H "Content-Type: application/json" \
  -H "x-admin-token: Admin@123456" \
  -d '{
    "title": "JavaScript Basics",
    "questions": [
      {
        "text": "What does const mean?",
        "options": { "a": "variable", "b": "constant", "c": "function", "d": "class" },
        "correct_option": "b"
      }
    ]
  }'
```

### 4. Open Frontend:
- Home: http://localhost:3000
- Admin: http://localhost:3000/admin
- Quiz: http://localhost:3000/quiz/1

## 📝 Key Changes Made

**Backend (.env):**
- Set PORT=4001
- Added CORS_ORIGIN=http://localhost:3000

**Backend (server.js):**
- CORS now allows DELETE and PUT methods

**Frontend (.env.local):**
- Updated NEXT_PUBLIC_API_URL=http://localhost:4001

**Frontend (admin/page.tsx):**
- Transforms `{choices: [...]}` → `{a: "...", b: "...", ...}`
- Removed type field from payload

**Frontend (types.ts):**
- Removed type from CreateQuestionPayload

## ⚠️ Important Notes

1. **Backend must start first** (it will bind to port 4001)
2. **Frontend depends on backend** running on 4001
3. **Database migrations** - Run `npm run migrate:fix` in backend if schema issues occur
4. **Clean orphan quizzes**: `curl -X DELETE http://localhost:4001/api/quizzes/<id>`

## 🔧 Troubleshooting

**If backend won't start:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**If frontend shows errors:**
```bash
cd frontend
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

**Database connection issues:**
Check DATABASE_URL in backend/.env is correct

**CORS errors:**
Ensure backend is running and CORS_ORIGIN matches frontend URL
