# Backend Run Commands

## Quick Start

### 1. Activate Virtual Environment (if not already activated)
```powershell
# Windows PowerShell
.\venv\Scripts\Activate.ps1

# Or Windows CMD
venv\Scripts\activate.bat
```

### 2. Run the Backend Server

**Option A: Using run.py (Recommended)**
```bash
python run.py
```

**Option B: Using uvicorn directly**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Option C: Using Python module**
```bash
python -m app.main
```

## Server URLs

Once running, the API will be available at:
- **API Root**: http://localhost:8000
- **API Docs (Swagger)**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

## Development vs Production

- **Development mode**: Auto-reload enabled, debug logging, docs enabled
- **Production mode**: No auto-reload, info logging, docs disabled

The mode is controlled by `PIXELGENESIS_ENV` in your `.env` file.

## Common Commands

### Run with specific port
```bash
uvicorn app.main:app --reload --port 8001
```

### Run without auto-reload
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Check if server is running
```bash
curl http://localhost:8000/health
```

