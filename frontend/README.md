# Job Portal Frontend

React + Vite frontend for the Django Job Portal backend.

## Prerequisites

- Node.js 18+
- Django backend running on `http://127.0.0.1:8000`

## Installation

```bash
cd frontend
npm install
```

## Run (Development)

Start the Django backend first:

```bash
cd ..
.\jobenv\Scripts\python.exe manage.py runserver
```

Then start the React dev server:

```bash
cd frontend
npm run dev
```

Open **http://localhost:5173**

## Build for Production

```bash
npm run build
npm run preview
```

## Environment

Create `.env` in the frontend folder:

```
VITE_API_URL=http://127.0.0.1:8000/api
```

## Tech Stack

- React 18 + Vite
- React Router DOM
- Axios (session + CSRF auth)
- Tailwind CSS
- Context API for authentication
