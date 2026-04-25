# Zivora

A modern full-stack social media application built with React, Express, MongoDB, Socket.IO, Cloudinary, and AI-powered caption generation. Zivora lets users create profiles, share posts, follow other users, manage privacy, receive notifications, and generate post captions with Groq AI.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [API Overview](#api-overview)
- [Architecture Highlights](#architecture-highlights)
- [Author](#author)

## Features

- **Authentication**: Register, login, username availability checks, JWT-based protected routes.
- **User Profiles**: View profiles, update profile details, upload profile images, and search users.
- **Social Graph**: Follow, unfollow, send follow requests, and manage private account requests.
- **Posts**: Create posts, upload images, view feeds, like posts, delete posts, and view user posts.
- **AI Captions**: Generate post captions using Groq AI.
- **Notifications**: Real-time notification support with Socket.IO and notification management APIs.
- **Privacy Settings**: Switch accounts between public and private visibility.
- **API Documentation**: Swagger documentation available from the backend.
- **Modern UI**: React 19, Vite, Tailwind CSS, Radix UI primitives, Lucide icons, and smooth motion effects.

## Tech Stack

### Frontend

- React 19
- Vite 7
- React Router DOM 7
- Redux Toolkit
- Tailwind CSS 4
- Radix UI
- Axios
- Socket.IO Client
- Lucide React
- Motion
- React Hot Toast

### Backend

- Node.js
- Express 5
- MongoDB with Mongoose
- JWT Authentication
- BcryptJS
- Socket.IO
- Cloudinary
- Multer
- Nodemailer
- Groq SDK
- Joi Validation
- Swagger UI / Swagger JSDoc
- Morgan

## Project Structure

```text
zivora-app/
├── backend/
│   ├── configs/             # Database, Cloudinary, email, socket, Swagger, and AI configs
│   ├── constants/           # Centralized app constants and environment values
│   ├── controllers/         # HTTP request/response controllers
│   ├── middlewares/         # Auth, upload, validation, and error middleware
│   ├── models/              # Mongoose models
│   ├── routes/              # API route definitions
│   ├── services/            # Business logic layer
│   ├── utils/               # Shared backend utilities
│   ├── validations/         # Joi validation schemas
│   ├── app.js               # Express app setup
│   └── server.js            # Server entry point
│
├── frontend/
│   ├── public/              # Static public assets
│   └── src/
│       ├── assets/          # Frontend assets
│       ├── components/      # Reusable UI components
│       ├── constants/       # Frontend constants
│       ├── context/         # Context providers
│       ├── hooks/           # Custom React hooks
│       ├── lib/             # Library configuration
│       ├── pages/           # Application pages and layouts
│       ├── services/        # API service layer
│       ├── utils/           # Frontend utilities
│       ├── App.jsx          # App routes and layout wiring
│       └── main.jsx         # React entry point
│
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- MongoDB, either local or hosted through MongoDB Atlas
- Cloudinary account
- Groq API key, if using AI caption generation
- Email provider credentials, if using email features

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd zivora-app
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 4. Configure Backend Environment

Create a `.env` file inside the `backend` directory:

```bash
cp .env.example .env
```

Then update the values based on your local setup and service credentials.

### 5. Run the Backend

From the `backend` directory:

```bash
npm run dev
```

Backend will run by default at:

```text
http://localhost:8080
```

### 6. Run the Frontend

From the `frontend` directory:

```bash
npm run dev
```

Frontend will run by default at:

```text
http://localhost:5173
```

## Environment Variables

Create `backend/.env` using `backend/.env.example` as a reference.

```env
PORT=8080
NODE_ENV=development
CLIENT_URL=http://localhost:5173

MONGODB_URI=mongodb://localhost:27017/zivora_test_db

JWT_SECRET=your_jwt_secret_here

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

GROQ_API_KEY=your_groq_api_key
```

## Available Scripts

### Backend Scripts

Run these from the `backend` directory.

| Script | Description |
| --- | --- |
| `npm run dev` | Starts the backend with Nodemon for development. |
| `npm start` | Starts the backend with Node.js. |

### Frontend Scripts

Run these from the `frontend` directory.

| Script | Description |
| --- | --- |
| `npm run dev` | Starts the Vite development server. |
| `npm run build` | Builds the frontend for production. |
| `npm run preview` | Serves the production build locally. |
| `npm run lint` | Runs ESLint checks. |

## API Overview

Base API URL:

```text
http://localhost:8080/api/v1
```

### Health Check

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/health` | Check backend server health. |

### Auth Routes

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/auth/check-username/:username` | Check username availability. |
| `POST` | `/auth/register` | Register a new user. |
| `POST` | `/auth/login` | Login with username/email and password. |

### Post Routes

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/posts/feed` | Get feed posts. |
| `POST` | `/posts/create` | Create a post from JSON payload. |
| `POST` | `/posts` | Create a post with image upload. |
| `POST` | `/posts/generate/caption` | Generate an AI caption. |
| `GET` | `/posts/:postId` | Get a single post. |
| `DELETE` | `/posts/:postId` | Delete a post. |
| `PUT` | `/posts/:postId/like` | Like or unlike a post. |
| `GET` | `/posts/profile/:username` | Get posts by username. |

### User Routes

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/users/me` | Get the current authenticated user. |
| `POST` | `/users/suggested-users` | Get suggested users. |
| `GET` | `/users/search` | Search users. |
| `GET` | `/users/profile/:username` | Get a user profile. |
| `PUT` | `/users/profile` | Update profile details and profile image. |
| `PUT` | `/users/privacy` | Update account visibility. |
| `POST` | `/users/:userId/follow` | Follow a user. |
| `POST` | `/users/follow-request` | Send a follow request. |
| `DELETE` | `/users/unfollow/:userId` | Unfollow a user. |
| `PUT` | `/users/update/follow-request/:notificationId/:action` | Accept or reject a follow request. |
| `GET` | `/users/:userId/saved/post/list/all` | Get saved posts for a user. |

### Notification Routes

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/notifications` | Get current user notifications. |
| `PUT` | `/notifications/:notificationId/read` | Mark a notification as read. |
| `PUT` | `/notifications/read-all` | Mark all notifications as read. |
| `DELETE` | `/notifications/:notificationId` | Delete a notification. |

### Swagger Documentation

After starting the backend, open:

```text
http://localhost:8080/api-docs
```

You can also access the raw Swagger JSON at:

```text
http://localhost:8080/api-docs.json
```

## Architecture Highlights

- **Service Layer Pattern**: Business logic is centralized in backend services and frontend API services.
- **Thin Controllers**: Backend controllers focus on request handling and response formatting.
- **Centralized Validation**: Joi validates backend requests, while frontend utilities keep client validation consistent.
- **Centralized Error Handling**: Backend middleware standardizes error responses across APIs.
- **Reusable Frontend Structure**: Pages, layouts, hooks, components, services, constants, and utilities are separated for maintainability.
- **Real-time Ready**: Socket.IO is initialized on the backend and consumed on the frontend for live updates.

## Author

**Gagan Chauhan**

---

If you like this project, consider giving it a star and sharing it with others.
