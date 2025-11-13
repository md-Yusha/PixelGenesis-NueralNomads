# Database Setup Guide

## Option 1: Using Docker Compose (Recommended - Easiest)

1. **Start PostgreSQL container:**
   ```bash
   docker-compose up -d
   ```

2. **Verify it's running:**
   ```bash
   docker ps
   ```
   You should see `pixelgenesis-postgres` container running.

3. **The .env file is already configured** with the Docker Compose database credentials:
   - User: `pixelgenesis_user`
   - Password: `pixelgenesis_password`
   - Database: `pixelgenesis_db`
   - Port: `5432`

4. **Test connection (optional):**
   ```bash
   docker exec -it pixelgenesis-postgres psql -U pixelgenesis_user -d pixelgenesis_db
   ```

5. **Stop the database (when needed):**
   ```bash
   docker-compose down
   ```

6. **Stop and remove data (clean slate):**
   ```bash
   docker-compose down -v
   ```

## Option 2: Local PostgreSQL Installation

1. **Install PostgreSQL** on your system:
   - Windows: Download from https://www.postgresql.org/download/windows/
   - macOS: `brew install postgresql`
   - Linux: `sudo apt-get install postgresql` (Ubuntu/Debian)

2. **Create database and user:**
   ```bash
   # Connect to PostgreSQL
   psql -U postgres
   
   # Create database
   CREATE DATABASE pixelgenesis_db;
   
   # Create user (optional, or use existing user)
   CREATE USER pixelgenesis_user WITH PASSWORD 'pixelgenesis_password';
   GRANT ALL PRIVILEGES ON DATABASE pixelgenesis_db TO pixelgenesis_user;
   
   # Exit
   \q
   ```

3. **Update .env file:**
   ```env
   DATABASE_URL=postgresql://pixelgenesis_user:pixelgenesis_password@localhost:5432/pixelgenesis_db
   ```
   Replace with your actual credentials if different.

## Next Steps

After setting up the database, run migrations:

```bash
# Create initial migration (if not exists)
alembic revision --autogenerate -m "Initial migration"

# Apply migrations
alembic upgrade head
```

