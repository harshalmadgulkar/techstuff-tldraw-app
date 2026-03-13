# Collaborative Project Management App

A full-stack collaborative project management application with integrated whiteboarding built using **Next.js**, **PostgreSQL**, and **TLDraw**.

The application allows users to create projects, collaborate with others, and manage multiple whiteboard files within each project.

This project was built as part of a **Full-Stack Developer technical assessment**.

---

# Project Overview

This application enables users to manage projects and collaborate visually using an integrated whiteboard system.

### Core Features

* Username-based authentication (no password required)
* Create and manage projects
* Create multiple whiteboards inside each project
* Real-time whiteboard editing using TLDraw
* Save and load whiteboard canvas state from the database
* Share projects with other users
* Access control to ensure only authorized users can view or modify projects

### User Flow

1. User logs in using a username.
2. If the username does not exist, a new user is automatically created.
3. The user is redirected to the **Projects Dashboard**.
4. From the dashboard the user can:

   * Create new projects
   * View owned or shared projects
5. Inside a project workspace the user can:

   * Create whiteboards
   * Open existing whiteboards
   * Delete whiteboards
   * Share the project with other users
6. Users can edit whiteboards using the TLDraw editor and all changes are saved to the database.

---

# Technology Stack

### Frontend

* **Next.js (App Router)**
  Used for building the full-stack application with server and client components.

* **React**
  UI framework used for building interactive user interfaces.

* **Tailwind CSS**
  Utility-first CSS framework used for styling and consistent UI design.

* **TLDraw**
  A powerful whiteboarding library used to provide drawing and diagram capabilities.

### Backend

* **Next.js API Routes**
  Used to implement backend endpoints for authentication, projects, whiteboards, and sharing.

### Database

* **PostgreSQL**
  Used as the primary relational database.

### ORM

* **Prisma**
  Used for type-safe database access and schema management.

### Notifications

* **Sonner**
  Used for lightweight toast notifications.

---

# Database Schema

The database is designed to support users, projects, collaboration, and whiteboard storage.

## Tables

### User

Stores all application users.

| Field     | Type          | Description             |
| --------- | ------------- | ----------------------- |
| id        | String (UUID) | Primary key             |
| username  | String        | Unique username         |
| createdAt | DateTime      | User creation timestamp |

A user can:

* Own multiple projects
* Be a member of shared projects

---

### Project

Stores project information.

| Field       | Type          | Description               |
| ----------- | ------------- | ------------------------- |
| id          | String (UUID) | Primary key               |
| name        | String        | Project name              |
| description | String        | Optional description      |
| ownerId     | String        | User who owns the project |
| createdAt   | DateTime      | Creation timestamp        |

Relationships:

* A project belongs to one owner
* A project can have multiple whiteboards
* A project can be shared with multiple users

---

### ProjectMember

Handles **project sharing**.

| Field     | Type   | Description      |
| --------- | ------ | ---------------- |
| id        | String | Primary key      |
| projectId | String | Linked project   |
| userId    | String | User with access |

Relationships:

* A project can have many members
* A user can belong to many shared projects

Unique constraint:

(projectId, userId)

This prevents duplicate sharing entries.

---

### Whiteboard

Stores TLDraw canvas data.

| Field       | Type     | Description           |
| ----------- | -------- | --------------------- |
| id          | String   | Primary key           |
| name        | String   | Whiteboard title      |
| projectId   | String   | Parent project        |
| canvasState | JSON     | Saved TLDraw snapshot |
| createdAt   | DateTime | Creation timestamp    |

Each whiteboard belongs to a project.

---

## Database Relationship Diagram

```
User
 │
 ├── owns → Project
 │
 └── ProjectMember
        │
        └── Project
              │
              └── Whiteboard
```

---

# Setup Instructions

## Prerequisites

Ensure the following are installed:

* Node.js (18+)
* PostgreSQL
* npm

---

## 1. Clone Repository

```
git clone <repository-url>
cd project-name
```

---

## 2. Install Dependencies

```
npm install
```

---

## 3. Environment Variables

Create a `.env` file:

```
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
JWT_SECRET="your-secret-key"
```

Example `.env.example` should be included in the repository.

---

## 4. Run Database Migrations

```
npx prisma migrate dev
```

This will create all required tables.

---

## 5. Generate Prisma Client

```
npx prisma generate
```

---

## 6. Start Development Server

```
npm run dev
```

Application will run at:

```
http://localhost:3000
```

---

# Deployment

The application can be deployed using **Vercel**.

### Deployment Steps

1. Push the repository to GitHub.
2. Import the project into Vercel.
3. Configure environment variables in Vercel dashboard.

Required environment variables:

```
DATABASE_URL
JWT_SECRET
```

4. Connect a PostgreSQL database (Supabase / Railway / Neon recommended).
5. Deploy.

### Live URL

```
https://your-app-url.vercel.app
```

---

# Testing Guide

Follow these steps to test the application functionality.

## 1. Login

* Enter a username.
* If the user does not exist, a new account is created automatically.

Expected result:

User is redirected to the **Projects Dashboard**.

---

## 2. Create Project

From the dashboard:

1. Enter project name
2. Click **Create**

Expected result:

Project appears in the project list.

---

## 3. Open Project Workspace

Click a project from the dashboard.

Expected result:

Project workspace opens showing whiteboards.

---

## 4. Create Whiteboard

1. Enter whiteboard name
2. Click **Create**

Expected result:

Whiteboard appears in the list.

---

## 5. Open Whiteboard

Click the whiteboard name.

Expected result:

TLDraw editor loads.

---

## 6. Draw and Save

Draw shapes on the canvas.

Expected result:

Changes are automatically saved to the database.

Refreshing the page should load the previous state.

---

## 7. Share Project

1. Enter another user's username
2. Click **Share**

Expected result:

The user gains access to the project.

---

## 8. Verify Access Control

* Shared users can view and edit whiteboards.
* Only project owners can delete projects or manage sharing.

---

# Development Notes

Key design decisions:

* Used **Next.js App Router** for a modern full-stack architecture.
* Used **Prisma ORM** for type-safe database queries.
* Used **TLDraw snapshots** to persist canvas state.
* Implemented **project access control** through a membership table.
* Simplified authentication using username-based sessions.

---

# Future Improvements

Possible enhancements include:

* Real-time collaborative editing
* Project roles (viewer/editor)
* Activity logs
* Whiteboard version history
* Improved access management UI

---