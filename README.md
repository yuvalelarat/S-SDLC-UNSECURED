# S-SDLC-UNSECURED

**S-SDLC-UNSECURED** is a full-stack web application designed to demonstrate secure software development practices across all stages of the Software Development Life Cycle (SDLC). It includes a secure backend using Node.js, Express, TypeORM, and PostgreSQL, and a React-based frontend.

---

## 🔐 Security-Focused Objectives

- Input validation and sanitization
- Secure session handling with JWT
- Database ORM usage to prevent SQL injection
- Use of environment variables to protect secrets
- Modular service/controller architecture

---

## 📦 Project Structure

```

S-SDLC-UNSECURED/
├── backend/         # Node.js + Express + TypeORM backend
│   ├── config/      # DB connection and app configuration
│   ├── controllers/ # API logic
│   ├── models/      # Entity definitions
│   ├── routes/      # Route definitions
│   ├── services/    # Business logic
│   └── app.js       # App entry point
├── frontend/        # React client app
│   └── src/         # Components and pages

````

---

## ⚙️ Backend Setup

### Prerequisites

- Node.js (v14+)
- npm (v6+)
- PostgreSQL

### 1. Configure Environment Variables

Create a `.env` file inside the `backend/` folder:

```env
# JWT secret for authentication
JWT_SECRET=your_jwt_secret

# Email credentials (for sending the users emails of creating a new password )
EMAIL_USER=user@email.mail
EMAIL_PASS=somepass
```

### 2. Create PostgreSQL Database

Make sure PostgreSQL is running, then create a database manually:

```sql
CREATE DATABASE project;
```

also change the password / username / port or any configurations in the /config/data-source.js by the setup you'd like to and by the credentails on your pgAdmin / PostgreSQL

### 3. Install Dependencies and Run

```bash
cd backend
npm install
npm start
```

The backend will start at: `http://localhost:3000`

---

## 🖥️ Frontend Setup

### 1. Install and Run

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at: `http://localhost:5173`

---

## ✅ Features

* Secure authentication with JWT
* PostgreSQL + TypeORM entity management
* Email integration (via environment variables)
* Modular architecture with separation of concerns

---

## 🔒 Secure SDLC Principles Implemented

| Phase          | Security Focus                                      |
| -------------- | --------------------------------------------------- |
| Requirements   | Defined secure defaults and environment management  |
| Design         | Modular separation of backend/frontend and services |
| Implementation | ORM protection, input sanitization, JWT auth        |
| Deployment     | Environment-based secrets, scalable config          |

---
