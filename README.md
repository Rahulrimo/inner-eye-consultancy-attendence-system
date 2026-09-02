# Employee Attendance Management System

A full-stack MERN implementation of the Inner Eye Consultancy Services LLP assessment.

## Included
- Employee registration and login
- JWT authentication with role-based access
- Attendance check-in / check-out
- Working-hours calculation
- Leave deduction calculation
- HR dashboard
- Employee dashboard
- Attendance status tracking
- MongoDB database models
- Responsive modern UI

## Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Auth: JWT + bcryptjs

## Run locally

### 1. Backend
```bash
cd server
npm install
cp .env.example .env
npm run dev
```

Set `MONGO_URI` and `JWT_SECRET` in `.env`.

### 2. Frontend
```bash
cd client
npm install
npm run dev
```

Open the Vite URL shown in the terminal.

## Default HR account
For security, no hard-coded password is provided. Register an account, then set its role to `hr` directly in MongoDB for assessment/demo use, or create a seed account by adapting `server/src/seed.js`.

## Notes
Working hours are calculated from check-in/check-out timestamps. Leave deduction is calculated from approved leave days against the employee's monthly leave balance. The UI shows attendance status as Present, Checked In, Checked Out, Absent, or On Leave where applicable.

## Production considerations
For deployment, add HTTPS, secure cookies/refresh tokens, rate limiting, audit logs, stricter validation, centralized error monitoring, and production-grade secrets management.
