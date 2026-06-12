# OWL Dashboard

This app uses a React front end and a Python FastAPI backend.

## Run the application

The easiest way to run everything is from the repository root:

```sh
npm install
npm run dev
```

This starts both:

- the FastAPI backend on http://127.0.0.1:8000
- the React dashboard on http://localhost:3000

### If you want to run them separately

#### Backend

```sh
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python3 -m uvicorn main:app --host 127.0.0.1 --port 8000
```

#### Frontend

```sh
cd owl-dashboard
npm install
npm start
```

## API endpoint

The dashboard fetches data from:

- http://127.0.0.1:8000/api/dashboard

## What this app does

- Fetches dashboard data from the Python API
- Renders KPI cards, the allocation chart, the performance chart, and the alerts sidebar

## Useful commands

```sh
cd owl-dashboard
npm run build
```

This creates a production build for deployment.
