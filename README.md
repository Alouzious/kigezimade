# Kigezi Made

A tourism-meets-e-commerce platform connecting artisans in Southwest Uganda (Kabale, Kisoro, Kanungu, Rukiga) directly with tourists and buyers.

## Stack

| Layer    | Tech                          |
|----------|-------------------------------|
| Frontend | React (Vite) + Tailwind CSS   |
| Backend  | Rust + Axum                   |
| Database | PostgreSQL (Neon) via sqlx    |
| AI       | Groq API (stories + translation) |

## Quick start

### 1. Database

Create a PostgreSQL database (locally or on [Neon](https://neon.tech)) and copy the connection string into `backend/.env`.

Migrations run automatically on backend startup.

### 2. Backend

```bash
cd backend
cp .env.example .env   # fill in DATABASE_URL and GROQ_API_KEY
cargo run
```

API listens on `http://localhost:3000`. Health check: `GET /health`.

### 3. Frontend

```bash
cd frontend
cp .env.example .env   # VITE_API_URL=http://localhost:3000
npm install
npm run dev
```

Site runs at `http://localhost:5173`.

## Environment variables

### Backend (`backend/.env`)

| Variable       | Description                              |
|----------------|------------------------------------------|
| `DATABASE_URL` | PostgreSQL connection string             |
| `GROQ_API_KEY` | Groq API key for AI features             |
| `PORT`         | Server port (default `3000`)             |
| `CORS_ORIGIN`  | Frontend URL for CORS (default `http://localhost:5173`) |

### Frontend (`frontend/.env`)

| Variable       | Description                    |
|----------------|--------------------------------|
| `VITE_API_URL` | Backend API base URL           |

## API routes

| Method | Path                                    | Description                |
|--------|-----------------------------------------|----------------------------|
| GET    | `/api/artisans`                         | List artisans              |
| GET    | `/api/artisans/featured`                | Featured artisans (3)      |
| GET    | `/api/artisans/:id`                     | Artisan detail             |
| POST   | `/api/artisans`                         | Register artisan           |
| GET    | `/api/artisans/:id/products`            | Artisan's products         |
| GET    | `/api/products`                         | List products (filterable) |
| GET    | `/api/products/:id`                     | Product + artisan detail   |
| POST   | `/api/orders`                           | Place an order             |
| GET    | `/api/ai/products/:id/story`            | Get cultural story         |
| POST   | `/api/ai/products/:id/story`            | Generate story (Groq)      |
| POST   | `/api/ai/products/:id/story/translate`  | Translate story            |

## Deployment

- **Frontend:** Vercel — set `VITE_API_URL` to your Render backend URL
- **Backend:** Render — set `DATABASE_URL`, `GROQ_API_KEY`, `CORS_ORIGIN` (your Vercel URL)
- **Database:** Neon — use the pooled connection string in `DATABASE_URL`

## Project structure

```
kigezimade/
├── frontend/          # React + Vite + Tailwind
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── layouts/
│       └── lib/
├── backend/           # Rust + Axum
│   ├── src/
│   │   ├── routes/
│   │   ├── models/
│   │   └── ai/
│   └── migrations/
└── README.md
```
