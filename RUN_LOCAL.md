# Run the app locally

## 1. Prerequisites

- **Node.js 18+** installed ([nodejs.org](https://nodejs.org))
- **MongoDB** running on `localhost:27017`  
  - Install: [MongoDB Community](https://www.mongodb.com/try/download/community) or run: `docker run -d -p 27017:27017 mongo:7`

## 2. Install dependencies (first time only)

Open PowerShell in project root: `c:\Users\DELL\Desktop\cusrorfirst`

```powershell
cd backend
npm install
cd ..\frontend
npm install
```

## 3. Start backend

**Terminal 1:**

```powershell
cd c:\Users\DELL\Desktop\cusrorfirst\backend
npm run dev
```

Wait until you see: `Server running on port 5000` and `MongoDB connected`.

## 4. Start frontend

**Terminal 2 (new window):**

```powershell
cd c:\Users\DELL\Desktop\cusrorfirst\frontend
npm run dev
```

When Vite says "Local: http://localhost:5173", open that in your browser.

## 5. Open the app

- **App (frontend):** http://localhost:5173  
- **API (backend):** http://localhost:5000/api/health  

If you see "address already in use :::5000", another app is using port 5000. Either close it or change port in `backend\.env` (e.g. `PORT=5001`) and in `frontend\vite.config.js` proxy target to `http://localhost:5001`.

If files don’t show in your editor, use **File → Open Folder** and choose `c:\Users\DELL\Desktop\cusrorfirst`.
