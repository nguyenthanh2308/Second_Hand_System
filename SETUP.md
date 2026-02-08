# Setup Instructions

## Prerequisites

- .NET 8.0 SDK
- MySQL 8.0+
- Node.js 18+ (for Angular frontend)

## Initial Setup

### 1. Configure Application Settings

The repository does not include `appsettings.json` for security reasons. You need to create it from the example template:

```bash
# Copy example file
cp appsettings.Example.json appsettings.json
```

### 2. Database Configuration

Open `appsettings.json` and update the connection string with your database credentials:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=SecondHandDB;User=your_user;Password=your_password;"
  }
}
```

### 3. JWT Secret Key Configuration

**IMPORTANT**: You must configure a secure JWT secret key (minimum 32 characters).

**Option A: Using Environment Variable (Recommended for Production)**

```bash
# Windows PowerShell
$env:JWT_SECRET_KEY="your-super-secret-key-minimum-32-characters-long-here"

# Windows CMD
set JWT_SECRET_KEY=your-super-secret-key-minimum-32-characters-long-here

# Linux/Mac
export JWT_SECRET_KEY="your-super-secret-key-minimum-32-characters-long-here"
```

**Option B: Using appsettings.json (Development)**

Update `appsettings.json`:

```json
{
  "Jwt": {
    "Key": "your-super-secret-key-minimum-32-characters-long-here",
    "Issuer": "SecondHandSystem",
    "Audience": "SecondHandUsers"
  }
}
```

**Generate a secure key**:

```bash
# Using PowerShell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 48 | % {[char]$_})

# Or use online generator (min 32 characters)
```

### 4. Database Migration

Run Entity Framework migrations to create the database schema:

```bash
# Navigate to project root
cd Second-hand_System

# Apply migrations
dotnet ef database update
```

The application will automatically seed initial data (admin user, sample categories, products).

### 5. Run Backend

```bash
dotnet run
```

Backend will start at: `http://localhost:5000`
Swagger UI available at: `http://localhost:5000/swagger`

### 6. Run Frontend

```bash
cd ClientApp
npm install
npm start
```

Frontend will start at: `http://localhost:4200`

## Default Login Credentials

After seeding, you can login with:

**Admin Account:**
- Username: `admin`
- Password: `Admin@123`

**Customer Account:**
- Username: `customer1`
- Password: `Customer@123`

## Security Notes

⚠️ **NEVER commit `appsettings.json` or `appsettings.Development.json` to version control**

These files are included in `.gitignore` to prevent accidental exposure of:
- Database credentials
- JWT secret keys
- Other sensitive configuration

## Troubleshooting

### Application won't start with configuration error

**Error message:**
```
Database connection string not properly configured
```

**Solution:** Make sure you copied `appsettings.Example.json` to `appsettings.json` and updated all placeholder values.

---

### JWT Secret Key error

**Error message:**
```
JWT Secret Key not properly configured or too short (minimum 32 characters required)
```

**Solution:** Set environment variable `JWT_SECRET_KEY` or update `appsettings.json` with a key that is at least 32 characters long.

---

### Database connection failed

**Error message:**
```
Unable to connect to MySQL server
```

**Solution:**
1. Verify MySQL is running
2. Check connection string credentials
3. Ensure database exists or run `dotnet ef database update`
