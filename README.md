# 🎗️ ML-14: Breast Cancer Prediction System (API & Frontend)

A production-grade Machine Learning inference system serving a trained Breast Cancer classification model via a containerized FastAPI backend on **Render**, coupled with a modern interactive React frontend ready for deployment on **Vercel**.

---

## 🌐 Live Deployments

| Component | Platform | URL / Endpoint |
| :--- | :--- | :--- |
| **Backend API Root** | Render | [https://ml-14-breast-cancer-api.onrender.com/](https://ml-14-breast-cancer-api.onrender.com/) |
| **Health Check Endpoint** | Render | [https://ml-14-breast-cancer-api.onrender.com/health](https://ml-14-breast-cancer-api.onrender.com/health) |
| **Interactive API Docs (Swagger)** | Render | [https://ml-14-breast-cancer-api.onrender.com/docs](https://ml-14-breast-cancer-api.onrender.com/docs) |
| **Frontend Application** | Vercel | [https://ml-14-ml-model-deployment-api.vercel.app/](https://ml-14-ml-model-deployment-api.vercel.app/) |

---

## 🏗️ Architecture & Project Structure

```text
ML-14-ML-Model-Deployment-API/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py             # FastAPI app with /predict, /health, /
│   │   └── schemas.py          # Pydantic input/output schemas with 30-feature validation
│   ├── model/
│   │   └── breast_cancer_model.pkl   # Trained scikit-learn Pipeline (Scaler + LogisticRegression)
│   ├── Dockerfile              # Docker container definition
│   ├── requirements.txt        # Backend dependencies (fastapi, uvicorn, scikit-learn, etc.)
│   └── train_model.py          # Model training pipeline
├── frontend/
│   ├── src/
│   │   ├── App.jsx             # React dashboard with Quick Fill presets, real-time inference
│   │   ├── App.css             # Healthcare UI styling & responsive design
│   │   └── main.jsx
│   ├── vercel.json             # Reverse-proxy rewrite rules to prevent CORS
│   ├── vite.config.js          # Vite config with dev proxy
│   └── package.json            # React 19, Lucide icons, Vite
├── vercel.json                 # Root Vercel build & proxy configuration
└── README.md
```

---

## 📡 API Specification & Example Requests

### 1. Health Check Endpoint (`GET /health`)

Returns the service status and verifies the ML model is loaded in memory.

**Request:**
```bash
curl -X GET https://ml-14-breast-cancer-api.onrender.com/health
```

**Response (200 OK):**
```json
{
  "status": "healthy",
  "model_loaded": true
}
```

---

### 2. Prediction Endpoint (`POST /predict`)

Accepts exactly 30 numerical measurements from fine needle aspirate (FNA) of a breast mass and outputs the classification prediction along with model confidence score.

#### Example A: Malignant Case

**Request:**
```bash
curl -X POST https://ml-14-breast-cancer-api.onrender.com/predict \
  -H "Content-Type: application/json" \
  -d '{
    "features": [
      17.99, 10.38, 122.8, 1001.0, 0.1184, 0.2776, 0.3001, 0.1471, 0.2419, 0.07871,
      1.095, 0.9053, 8.589, 153.4, 0.006399, 0.04904, 0.05373, 0.01587, 0.03003, 0.006193,
      25.38, 17.33, 184.6, 2019.0, 0.1622, 0.6656, 0.7119, 0.2654, 0.4601, 0.1189
    ]
  }'
```

**Response (200 OK):**
```json
{
  "prediction": 0,
  "result": "Malignant",
  "confidence": 1.0
}
```

#### Example B: Benign Case

**Request:**
```bash
curl -X POST https://ml-14-breast-cancer-api.onrender.com/predict \
  -H "Content-Type: application/json" \
  -d '{
    "features": [
      13.54, 14.36, 87.46, 566.3, 0.09779, 0.08129, 0.06664, 0.04781, 0.1885, 0.05766,
      0.2699, 0.7886, 2.058, 23.56, 0.008462, 0.0146, 0.02387, 0.01315, 0.0198, 0.0023,
      15.11, 19.26, 99.7, 711.2, 0.144, 0.1773, 0.239, 0.1288, 0.2977, 0.07259
    ]
  }'
```

**Response (200 OK):**
```json
{
  "prediction": 1,
  "result": "Benign",
  "confidence": 0.9146
}
```

---

## 💻 Local Development Setup

### Backend (FastAPI)

```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
# source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Access Swagger docs at: `http://localhost:8000/docs`

### Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser. The Vite dev proxy will automatically route `/api/*` to the live Render backend.

---

## 🚀 Deployment Guide

### Deploying Frontend on Vercel

1. Push this repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: complete frontend and deployment configuration"
   git push origin main
   ```
2. Go to [Vercel](https://vercel.com/) and click **"Add New Project"**.
3. Import the repository: `student-Madhumitakhatua/-ML-14-ML-Model-Deployment-API`.
4. Configure Project Settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**.
6. The frontend is live, with seamless server-side rewrites proxying inference calls directly to your Render backend without browser CORS issues.
