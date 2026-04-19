# E-Commerce Admin Panel

A role-based admin dashboard for managing an e-commerce backend, built with Node.js, Express, AdminJS, Sequelize, and PostgreSQL.

---

## Tech Stack

- **Backend**: Node.js, Express.js
- **Admin Interface**: AdminJS v7
- **ORM**: Sequelize v6
- **Database**: PostgreSQL
- **Authentication**: JWT + bcrypt
- **Session**: express-session

---

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd ecommerce-admin
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory with the following:

```env
PORT=5001
DATABASE_URL=postgres://<user>:<password>@localhost:5432/<dbname>
JWT_SECRET=your-jwt-secret
SESSION_SECRET=your-session-secret
```

### 4. Set up the database

Make sure PostgreSQL is running and the database exists, then seed it:

```bash
npm run seed
```

### 5. Start the server

```bash
npm run dev
```

### 6. Access the app

| Interface     | URL                                       |
| ------------- | ----------------------------------------- |
| Admin Panel   | http://localhost:5001/admin               |
| Login API     | http://localhost:5001/admin/login         |
| Dashboard API | http://localhost:5001/api/dashboard/stats |

---

## Test Credentials

| Role  | Email          | Password    |
| ----- | -------------- | ----------- |
| Admin | admin@test.com | password123 |
| User  | user2@test.com | password123 |

---

## Features

- JWT-based authentication with bcrypt password hashing
- Role-based access control — admins and regular users see different interfaces
- Admin dashboard with live stats: total users, orders, products, and revenue
- Full CRUD for Products, Categories, Orders, Order Items, Users, and Settings
- Users and Settings resources restricted to admins only
- Regular users can only view their own orders, enforced server-side
- Custom Settings page using key-value configuration stored in the database
- Passwords hidden from all admin views

---

## Project Structure

src/
├── admin/
│ ├── components/ # Custom React components (Dashboard, SettingsList)
│ └── options.js # AdminJS configuration and resource definitions
├── config/
│ └── database.js # Sequelize connection setup
├── middleware/
│ └── auth.js # JWT authentication middleware
├── models/ # Sequelize models and associations
├── routes/
│ ├── auth.js # POST /api/login
│ └── dashboard.js # GET /api/dashboard/stats
└── server.js # Express app entry point
