# Notes App

Simple Notes API with JWT auth, MongoDB (Mongoose), secure headers, rate limiting, and a tiny frontend.

## Features
- Users: signup with OTP verification, login to get JWT
- Notes: full CRUD with ownership checks
- Tags: optional array, filter via `?tag` or `?tags=a,b`
- Security: Helmet, rate-limited login
- Timestamps: `createdAt`, `updatedAt`
- Minimal frontend: `public/index.html`

## Deployment Link
https://notes-app-1-nhsk.onrender.com

## Installation
1. Ensure you have Node.js 18+ installed.
2. Clone the repository and install dependencies.

```powershell
# Clone
git clone https://github.com/Ikechukwu-Okwuchukwu-Amaechina/notes-app.git
cd notes-app

# Install dependencies
npm install
```

## Run

1) Install Node.js (v18+ recommended) and MongoDB, or rely on tests that spin up an in-memory MongoDB.

2) Create a .env in project root:

```
PORT=3000
JWT_SECRET=super_secret_key
MONGODB_URI=mongodb://localhost:27017/notes-app
```

3) Start the server:

```powershell
npm start
```

Visit http://localhost:3000 to try the minimal frontend.

## Auth routes

POST /api/auth/signup
Body (JSON): { "name": "John", "email": "john@mail.com", "phone": "1234567890", "password": "pass123" }
Return: demoOtp (for testing). Use it in verify step.

POST /api/auth/verify-otp
Body: { "email": "john@mail.com", "otp": "123456" }

POST /api/auth/login
Body: { "email": "john@mail.com", "password": "pass123" }
Return: { token: "..." }

Use the token in headers for notes routes:
Authorization: Bearer YOUR_JWT_TOKEN

## Notes routes (all protected)

GET /api/notes
- Query filters:
	- /api/notes?tag=work → notes with tag "work"
	- /api/notes?tags=work,urgent → notes containing both "work" and "urgent"

POST /api/notes
Body:
```
{ "title": "My note", "content": "Hello", "tags": ["work","urgent"] }
```

GET /api/notes/:id

PUT /api/notes/:id
Body (any subset):
```
{ "title": "New title", "content": "Updated", "tags": ["work"] }
```

DELETE /api/notes/:id

## Storage

MongoDB via Mongoose. Indexes on `tags` and compound `{ userId, tags }` to speed up tag queries.

## Testing

This project uses Jest and Supertest for integration tests. Tests use mongodb-memory-server.

Commands:

```powershell
npm test           # run tests once
npm run test:watch # watch mode
npm run test:coverage # coverage report
```

Notes:
- The app is exported from `index.js`; server starts only when run directly.
## Security

- Helmet for secure HTTP headers
- Rate limiting on login (15 minutes window, max 20 attempts)
- Basic input validation for phone (signup) and tags (notes)
