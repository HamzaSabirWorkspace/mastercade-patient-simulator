# 🏥 Mastercade — AI Patient Simulator

An interactive medical patient simulation application built for clinical diagnostic training and patient interrogation.

## 🎨 Theme & Design System
- **Company Name**: Mastercade
- **Theme**: Dark Blue & White (`#070D1B` midnight navy, glowing `#00F0FF` cyan highlights, glassmorphism, animated SVG telemetry ECG monitor).

## 🚀 Quick Start (Local Development)

### 1. Run Backend FastAPI Server (Port 8000)
```bash
pip install -r requirements.txt
python -m uvicorn app:app --port 8000 --reload
```

### 2. Run React Front End (Port 5173)
```bash
cd frontend
npm install
npm run dev
```
Access the application in your browser at `http://127.0.0.1:5173`.

---

## 🌐 Free Server Deployment

### Backend Deployment (Render.com)
1. Push repository to GitHub.
2. Create a new Web Service on [Render.com](https://render.com).
3. Set Build Command: `pip install -r requirements.txt`
4. Set Start Command: `uvicorn app:app --host 0.0.0.0 --port $PORT`
5. Add Environment Variable `GEMINI_API_KEY`.

### Front End Deployment (Vercel / Netlify)
1. Import `frontend/` directory to Vercel/Netlify.
2. Build command: `npm run build`, Output directory: `dist`.
3. Open your deployed site and connect to your Render API backend!
