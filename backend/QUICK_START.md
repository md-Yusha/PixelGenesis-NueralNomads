# Quick Start Guide

## ✅ Step 1: Dependencies Installed
Done! You've installed all Python dependencies.

## 📝 Step 2: Environment File Created
Done! The `.env` file has been created with all required variables.

**Note:** You can update these values later when you have the actual credentials:
- `PIXELGENESIS_IPFS_API_TOKEN` - Get from https://web3.storage/
- `SECRET_KEY` - Generate a strong random string for production
- Database credentials (if not using Docker)

## 🗄️ Step 2: Set Up PostgreSQL Database

### Option A: Using Docker (Easiest - Recommended)

If you have Docker installed:

```bash
# Navigate to backend directory
cd backend

# Start PostgreSQL container
docker-compose up -d

# Verify it's running
docker ps
```

The database will be available at:
- Host: `localhost`
- Port: `5432`
- Database: `pixelgenesis_db`
- User: `pixelgenesis_user`
- Password: `pixelgenesis_password`

**The .env file is already configured for these Docker credentials!**

### Option B: Local PostgreSQL Installation

If you don't have Docker or prefer local PostgreSQL:

1. **Install PostgreSQL:**
   - Windows: Download from https://www.postgresql.org/download/windows/
   - macOS: `brew install postgresql`
   - Linux: `sudo apt-get install postgresql`

2. **Create database:**
   ```bash
   # Connect to PostgreSQL
   psql -U postgres
   
   # Run these commands:
   CREATE DATABASE pixelgenesis_db;
   CREATE USER pixelgenesis_user WITH PASSWORD 'pixelgenesis_password';
   GRANT ALL PRIVILEGES ON DATABASE pixelgenesis_db TO pixelgenesis_user;
   \q
   ```

3. **Update .env file** if you used different credentials:
   ```env
   DATABASE_URL=postgresql://your_user:your_password@localhost:5432/pixelgenesis_db
   ```

## 🔄 Step 3: Run Database Migrations (Next Step)

Once the database is set up, run:

```bash
# Create initial migration
alembic revision --autogenerate -m "Initial migration"

# Apply migrations
alembic upgrade head
```

## 🚀 Step 4: Start the Server (After migrations)

```bash
# Option 1: Using the run script
python run.py

# Option 2: Using uvicorn directly
uvicorn app.main:app --reload
```

The API will be available at:
- **API**: http://localhost:8000
- **Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 📋 Summary

✅ Step 1: Dependencies installed  
✅ Step 2: .env file created  
⏳ Step 2: Set up PostgreSQL (choose Docker or local)  
⏳ Step 3: Run migrations  
⏳ Step 4: Start server  

## Troubleshooting

### Docker not found?
- Install Docker Desktop: https://www.docker.com/products/docker-desktop/
- Or use local PostgreSQL (Option B above)

### Database connection errors?
- Verify PostgreSQL is running: `docker ps` or `pg_isready`
- Check `.env` file has correct `DATABASE_URL`
- Ensure database exists and user has permissions

### Need help?
Check `setup-db.md` for detailed database setup instructions.

