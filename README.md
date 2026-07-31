# 🏥 Jeeva Raksha — AI-Based Multilingual Smart Healthcare Application

> **"Jeeva Raksha"** (जीव रक्षा) means *"Protection of Life"* in Sanskrit.
> A production-ready, AI-powered multilingual healthcare platform built for accessibility, scalability, and intelligence.

---

## 📦 Technology Stack

| Layer              | Technology                           |
|--------------------|--------------------------------------|
| **Frontend**       | React Native (JavaScript)            |
| **Backend**        | Node.js + Express.js                 |
| **Database**       | MySQL                                |
| **Authentication** | Firebase Authentication              |
| **ML Service**     | Python 3.11 + FastAPI + Scikit-learn |
| **Dev Tool**       | Antigravity                  |

---

## 🗂️ Project Structure

```
Jeeva Raksha/
├── frontend/          ← React Native mobile application
├── backend/           ← Node.js + Express REST API server
├── ml-service/        ← Python FastAPI ML inference server
├── database/          ← MySQL schema and seed scripts
├── docs/              ← Developer documentation
└── README.md          ← You are here
```

---

## 🚀 Quick Start

### Prerequisites

Make sure the following are installed:

- **Node.js** v18+ → https://nodejs.org
- **Python** 3.11+ → https://python.org
- **MySQL** 8.0+ → https://mysql.com
- **React Native CLI** → `npm install -g react-native-cli`
- **Git** → https://git-scm.com

---

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/jeeva-raksha.git
cd jeeva-raksha
```

---

### 2. Database Setup (MySQL)

```bash
# Log into MySQL
mysql -u root -p

# Run the schema script
source database/schema.sql;
```

---

### 3. Backend Setup (Node.js)

```bash
cd backend

# Install dependencies
npm install

# Copy environment file and fill in your values
cp .env.example .env

# Start development server
npm run dev

# Start production server
npm start
```

**Backend runs on:** `http://localhost:5000`

---

### 4. ML Service Setup (Python FastAPI)

```bash
cd ml-service

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Start the ML server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

**ML Service runs on:** `http://localhost:8000`

---

### 5. Frontend Setup (React Native)

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# For Android
npx react-native run-android

# For iOS (macOS only)
cd ios && pod install && cd ..
npx react-native run-ios

# Start Metro bundler separately (if needed)
npx react-native start
```

---

## 📖 Environment Variables

See [`docs/SETUP.md`](docs/SETUP.md) for a complete guide on configuring environment variables for all three services.

---

## 🧩 Architecture Overview

```
┌─────────────────────────────────────────────────┐
│              React Native App (Frontend)         │
│   React Navigation + Axios + Firebase Auth SDK  │
└───────────────────┬─────────────────────────────┘
                    │ REST API (HTTP/HTTPS)
┌───────────────────▼─────────────────────────────┐
│          Node.js + Express Backend               │
│   Firebase Admin Auth Middleware + MySQL Pool   │
└──────────┬──────────────────────┬───────────────┘
           │ MySQL                │ HTTP (ML calls)
┌──────────▼──────┐   ┌───────────▼───────────────┐
│   MySQL 8.0     │   │  FastAPI ML Service        │
│   Database      │   │  Scikit-learn Models       │
└─────────────────┘   └───────────────────────────┘
```

---

## 📋 Available Scripts

### Backend
| Command         | Description                        |
|-----------------|------------------------------------|
| `npm run dev`   | Start with nodemon (hot reload)    |
| `npm start`     | Start production server            |
| `npm test`      | Run Jest test suite                |

### ML Service
| Command                                             | Description            |
|-----------------------------------------------------|------------------------|
| `uvicorn main:app --reload`                         | Development server     |
| `uvicorn main:app --host 0.0.0.0 --port 8000`      | Production server      |

### Frontend
| Command                           | Description             |
|-----------------------------------|-------------------------|
| `npx react-native run-android`    | Run on Android device   |
| `npx react-native run-ios`        | Run on iOS device/sim   |
| `npx react-native start`          | Start Metro bundler     |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'feat: add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

*Built with ❤️ for accessible healthcare — Jeeva Raksha Team*
