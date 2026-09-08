# Client Details App

A full-stack client directory application with a React dashboard and a FastAPI backend. The dashboard displays client records, provides instant local filtering, and supports looking up an individual client by ID through the API.

## Features

- View client records in a responsive dashboard
- Filter the loaded directory by client name, email, or phone number without another API request
- Look up a client by ID using `GET /clients/{client_id}`
- Display client status, company, city, email, and phone information
- Automatically create and seed a local SQLite database for development
- Optional SQL Server configuration for deployments that require it

## Tech Stack

### Frontend

- React 19
- React DOM
- Vite 8
- JavaScript with JSX
- CSS3
- ESLint

### Backend

- Python
- FastAPI
- Uvicorn
- SQLAlchemy 2
- Pydantic through FastAPI
- `python-dotenv` for environment configuration support
- `pyodbc` for SQL Server connectivity

### Database

- SQLite for the default local development database
- Microsoft SQL Server as an optional database provider

## Project Structure

```text
backend/
  database.py          Database engine and SQLAlchemy session setup
  main.py              FastAPI application and API routes
  models.py            SQLAlchemy client model
  requirements.txt     Python dependencies
  sqlserver_setup.sql  Optional SQL Server setup script
frontend/
  src/                 React application source
  package.json         Frontend scripts and dependencies
```

## Prerequisites

- Python 3.8 or newer
- Node.js and npm
- SQL Server and an ODBC driver only if using SQL Server instead of SQLite

## Run the Backend

From the project root:

```powershell
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

The API runs at `http://localhost:8000`.

With the default configuration, the backend automatically creates `backend/clients.db`, creates its tables, and inserts sample clients when the server starts. No manual database-file creation is required.

### Backend Endpoints

- `GET /health` - Health check
- `GET /clients` - Return all clients
- `GET /clients/{client_id}` - Return one client by ID
- `GET /docs` - Open the interactive Swagger API documentation

## Run the Frontend

Open a second terminal from the project root:

```powershell
cd frontend
npm install
npm run dev
```

The dashboard runs at `http://localhost:5173` and expects the backend to be running at `http://localhost:8000`.

### Frontend Commands

```powershell
npm run lint    # Check the frontend with ESLint
npm run build   # Create a production build
npm run preview # Preview the production build
```

## Database Options

### SQLite (default)

No extra configuration is needed. The application uses SQLite and creates `backend/clients.db` automatically when FastAPI starts.

### SQL Server (optional)

Set `DATABASE_URL` before starting the backend:

```powershell
$env:DATABASE_URL = "mssql+pyodbc://user:password@server/database?driver=ODBC+Driver+17+for+SQL+Server"
python -m uvicorn main:app --reload
```

For SQL Server, create and initialize the database using `backend/sqlserver_setup.sql` through SQL Server Management Studio or `sqlcmd`. The script is not used by the default SQLite setup.

## Development Notes

- The local name, email, and phone filter works against the client list already loaded into the dashboard.
- The ID search makes an API request only when the lookup form is submitted.
- The backend enables CORS for `http://localhost:5173` and `http://127.0.0.1:5173`.
- Start the backend before testing the frontend so the client list can load successfully.
