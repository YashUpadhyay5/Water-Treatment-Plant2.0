# Hydromaterials — Water Treatment Plant Design Platform

Full-stack 3D web application for designing and visualizing Water Treatment Plants (WTP). Built for engineering companies with a modern SaaS-style UI.

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Three.js (@react-three/fiber, @react-three/drei), Framer Motion, React Router, React Hot Toast
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, bcrypt, express-validator
- **Auth:** JWT (login/register), role-based (Admin / Customer)

## Features

- **Authentication:** Register (name, email, password, company), login/logout, JWT, bcrypt, Admin/Customer roles
- **Landing:** Hero with 3D water background, company intro, CTAs (Get Quote, Try 3D Designer)
- **Dashboard:** Welcome, create new WTP design, list saved designs, edit/delete, export (screenshot)
- **3D WTP Designer:** Interactive Three.js viewer; inputs for flow rate (m³/h), number of tanks, pipe diameter, layout (Compact/Industrial); dynamic 3D model (tanks, pipes, platform); orbit/zoom/pan
- **Project saving:** Save/load designs in MongoDB; rename projects
- **Admin panel:** List users and designs, analytics, delete users/designs
- **UI/UX:** Dark/light mode, responsive, animations, loading skeletons
- **Bonus:** Screenshot of 3D design, quote request form, pricing page, testimonials

## Folder Structure

```
cusrorfirst/
├── backend/
│   ├── src/
│   │   ├── index.js          # Express app, DB, routes
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── WtpDesign.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── wtp.js
│   │   │   ├── user.js
│   │   │   └── admin.js
│   │   └── seedAdmin.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

## Prerequisites

- **Node.js** 18+ and npm
- **MongoDB** 6+ running locally or a connection string (e.g. MongoDB Atlas)

## Setup (VS Code / Local)

### 1. Clone and open

```bash
cd c:\Users\DELL\Desktop\cusrorfirst
```

Open this folder in VS Code.

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

- `PORT=5000`
- `MONGODB_URI=mongodb://localhost:27017/wtp-designs` (or your Atlas URI)
- `JWT_SECRET=<your-secret-key>`
- `NODE_ENV=development`

Create first admin (optional):

```bash
# Windows PowerShell
$env:ADMIN_EMAIL="admin@wtp.com"; $env:ADMIN_PASSWORD="admin123"; npm run seed:admin
```

Start backend:

```bash
npm run dev
```

Server runs at **http://localhost:5000**.

### 3. Frontend

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

App runs at **http://localhost:5173**. Vite proxies `/api` to `http://localhost:5000`, so API calls work without CORS issues.

### 4. Use the app

- **Register** a new user (or use the admin created above to log in as admin).
- **Landing:** Click “Get Quote” or “Try 3D Designer” (sign up if needed).
- **Dashboard:** Create a new design, open saved ones, delete.
- **3D Designer:** Change flow rate, tanks, pipe diameter, layout; use mouse to rotate/zoom/pan; save design, take screenshot.
- **Admin:** Log in as admin and open **Admin** to see users, designs, and analytics.

## API Overview

- **Auth:** `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` (Bearer token)
- **WTP designs:** `GET/POST /api/wtp`, `GET/PATCH/DELETE /api/wtp/:id` (protected)
- **User:** `GET/PATCH /api/user/profile` (protected)
- **Admin:** `GET /api/admin/users`, `GET /api/admin/designs`, `GET /api/admin/analytics`, `DELETE /api/admin/users/:id`, `DELETE /api/admin/designs/:id` (admin only)

## Production Build

**Backend:**

```bash
cd backend
NODE_ENV=production npm start
```

**Frontend:**

```bash
cd frontend
npm run build
```

Static files are in `frontend/dist`. Serve them with any static server (e.g. nginx, or Express static) and point API to your backend URL.

## Deployment

1. **Environment variables**
   - Backend: set `MONGODB_URI`, `JWT_SECRET`, `PORT`, `FRONTEND_URL` (e.g. `https://yourdomain.com`) for CORS.
   - Frontend: if API is on another domain, set `VITE_API_URL` to the backend base URL and use it in `frontend/src/lib/api.js` instead of `/api`.

2. **Build**
   - Backend: run `npm start` (or use a process manager).
   - Frontend: `npm run build` and serve `dist`.

3. **Docker (optional)**

   Example backend Dockerfile:

   ```dockerfile
   FROM node:20-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   CMD ["node", "src/index.js"]
   ```

   Run MongoDB separately (e.g. Atlas or a MongoDB container). Frontend can be built with a multi-stage Dockerfile (Node to build, nginx to serve) or served by your existing web server.

## Security

- Passwords hashed with bcrypt.
- JWT for protected routes; admin routes check `role === 'admin'`.
- Input validation on auth and WTP routes (express-validator).
- Use strong `JWT_SECRET` and HTTPS in production.

## License

MIT.
