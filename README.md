# Notes App

A simple Node.js-based notes application repository scaffold. Use it to build a CLI or HTTP service for creating, listing, and managing notes.

## Features
- Node.js project scaffold ready for expansion
- Sensible `.gitignore` for Node and environment files
- Conventional MVC-style folders: `controllers/`, `routes/`, `models/`, `middleware/`, `config/`
- Ready-to-edit entry point (`index.js`) referenced in `package.json`

## Installation
1. Ensure you have Node.js 18+ installed.
2. Clone the repository and install dependencies.

```powershell
# Clone
git clone https://github.com/Ikechukwu-Okwuchukwu-Amaechina/notes-app.git
cd notes-app

# Install dependencies (none yet, but keeps workflow consistent)
npm install
```

## Usage
- Start developing by creating `index.js` and adding your app logic.
- Add scripts in `package.json` (e.g., `dev`, `start`, `test`).
- Place files in the suggested structure:

### Project structure
```
notes-app/
├─ config/        # App configuration (env, db, options)
├─ controllers/   # Request handlers / business logic
├─ middleware/    # Express or custom middleware
├─ models/        # Data models or schemas
├─ routes/        # Route definitions
├─ package.json
└─ README.md
```

```powershell
# Example: run the default script
node index.js
```

## Technologies Used
- Node.js
- npm

## Author
Ikechukwu Okwuchukwu Amaechina
Notes API (Novice-friendly)

How to run

1. Install Node.js (v18+ recommended).
2. In this folder, install packages:
	- npm install
3. Create a .env file in the project root with:
	- PORT=3000
	- JWT_SECRET=super_secret_key
4. Start the server:
	- npm start

You should see: Server running on http://localhost:3000

Auth routes

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

Notes routes (all protected)

GET /api/notes
POST /api/notes { "title": "My note", "content": "Hello" }
GET /api/notes/:id
PUT /api/notes/:id { "title": "New title", "content": "Updated" }
DELETE /api/notes/:id

Storage

Data is saved to data/db.json as simple JSON. Good for learning, not for production.

## Testing

This project uses Jest and Supertest for integration tests.

Commands:

```powershell
npm test           # run tests once
npm run test:watch # watch mode
npm run test:coverage # coverage report
```

Notes:
- Tests run against a temporary DB file (process.env.DB_FILE) and won't touch `data/db.json`.
- The app is exported from `index.js` for testing; the server only starts when run directly.
