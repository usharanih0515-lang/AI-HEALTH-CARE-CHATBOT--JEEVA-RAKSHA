# =============================================================================
# Jeeva Raksha — Environment Setup Guide (docs/SETUP.md)
# =============================================================================
# A complete step-by-step guide for setting up all environment variables
# across the three services: Backend, ML Service, and Frontend.
# =============================================================================

# 🔧 Environment Variable Setup Guide

This document explains every environment variable in Jeeva Raksha and how to obtain the values.

---

## 1. Firebase Project Setup

### Step 1: Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **Add project** → name it `jeeva-raksha`
3. Enable Google Analytics (optional) → Create project

### Step 2: Enable Authentication
1. In the Firebase console: **Authentication** → **Sign-in method**
2. Enable **Email/Password**
3. (Optional) Enable **Google**, **Phone** for future use

### Step 3: Get Web Config (for Frontend)
1. **Project Settings** → **General** → **Your apps** → **Add App** → Choose **Android** or **iOS**
2. Register your app (use `com.jeevaraksha` as package name)
3. Copy the Firebase config values to `frontend/.env`

### Step 4: Generate Service Account Key (for Backend)
1. **Project Settings** → **Service Accounts**
2. Click **Generate new private key** → Download the JSON file
3. Copy values from the JSON into `backend/.env`:

```
FIREBASE_PROJECT_ID   = value of "project_id"
FIREBASE_CLIENT_EMAIL = value of "client_email"
FIREBASE_PRIVATE_KEY  = value of "private_key" (keep the \n characters)
```

> ⚠️ **NEVER commit the service account JSON file or your .env files to Git.**

---

## 2. MySQL Database Setup

### Step 1: Create the Database
```sql
mysql -u root -p
source database/schema.sql;
```

### Step 2: Create a Dedicated User (Recommended)
```sql
CREATE USER 'jeeva_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON jeeva_raksha.* TO 'jeeva_user'@'localhost';
FLUSH PRIVILEGES;
```

### Step 3: Update `backend/.env`
```
DB_HOST     = localhost
DB_PORT     = 3306
DB_USER     = jeeva_user
DB_PASSWORD = strong_password
DB_NAME     = jeeva_raksha
```

---

## 3. Backend Environment Variables (`backend/.env`)

| Variable                   | Description                           | Where to Get              |
|----------------------------|---------------------------------------|---------------------------|
| `NODE_ENV`                 | `development` or `production`         | Set manually              |
| `PORT`                     | Express server port (default: 5000)   | Set manually              |
| `DB_HOST`                  | MySQL host                            | MySQL config              |
| `DB_USER`                  | MySQL username                        | MySQL config              |
| `DB_PASSWORD`              | MySQL password                        | MySQL config              |
| `DB_NAME`                  | Database name (`jeeva_raksha`)        | schema.sql                |
| `FIREBASE_PROJECT_ID`      | Firebase project ID                   | Firebase Service Account  |
| `FIREBASE_CLIENT_EMAIL`    | Firebase client email                 | Firebase Service Account  |
| `FIREBASE_PRIVATE_KEY`     | Firebase private key (with `\n`)      | Firebase Service Account  |
| `ML_SERVICE_BASE_URL`      | URL of FastAPI service                | `http://localhost:8000`   |
| `JWT_SECRET`               | Random secret for internal JWTs       | Generate randomly         |
| `RATE_LIMIT_MAX_REQUESTS`  | Max requests per window per IP        | Set manually (default 100)|

**Generate a secure JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 4. ML Service Environment Variables (`ml-service/.env`)

| Variable            | Description                          |
|---------------------|--------------------------------------|
| `ENVIRONMENT`       | `development` or `production`        |
| `PORT`              | FastAPI port (default: 8000)         |
| `ALLOWED_ORIGINS`   | Comma-separated CORS origins         |
| `MODELS_DIR`        | Path to `.joblib` model files        |
| `LOG_LEVEL`         | Loguru level (`DEBUG`, `INFO`, etc.) |
| `BACKEND_API_URL`   | Node.js backend URL                  |

---

## 5. Frontend Environment Variables (`frontend/.env`)

| Variable                       | Description                        |
|--------------------------------|------------------------------------|
| `API_BASE_URL`                 | Backend API URL                    |
| `API_TIMEOUT`                  | Request timeout in ms              |
| `FIREBASE_API_KEY`             | Firebase Web API key               |
| `FIREBASE_AUTH_DOMAIN`         | Firebase Auth domain               |
| `FIREBASE_PROJECT_ID`          | Firebase Project ID                |
| `FIREBASE_STORAGE_BUCKET`      | Firebase Storage bucket            |
| `FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID       |
| `FIREBASE_APP_ID`              | Firebase App ID                    |

> **Android Emulator Note:** Use `http://10.0.2.2:5000` instead of `localhost` in `API_BASE_URL`
> to reach the host machine from within the Android emulator.

---

## 6. Git Configuration

Add the following to your `.gitignore`:

```
# Environment files — NEVER commit
backend/.env
frontend/.env
ml-service/.env
*.env

# Firebase service account JSON
firebase-service-account.json
serviceAccountKey.json

# Logs
backend/logs/
ml-service/logs/

# Node modules
node_modules/

# Python
__pycache__/
*.pyc
venv/
.venv/
ml-service/models/*.joblib
```
