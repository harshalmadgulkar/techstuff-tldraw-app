# Collaborative Whiteboard App

## Tech Stack
- Next.js
- PostgreSQL (Supabase)
- Prisma ORM
- TLDraw
- TypeScript

## Features
- Username based login
- Project management
- Project sharing
- Multiple TLDraw whiteboards
- Canvas auto-save
- Shared project access

## Setup

npm install

Create .env file

DATABASE_URL=
JWT_SECRET=

Run migrations

npx prisma migrate dev

Start server

npm run dev

## Deployment

Deployed on Vercel with Supabase PostgreSQL.