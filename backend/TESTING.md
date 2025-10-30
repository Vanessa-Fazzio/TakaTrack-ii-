# Testing Your TakaTrack Backend

## ✅ Structure Test (Already Passed!)
```bash
python3 simple_test.py
```

## 🚀 3 Ways to Test the Backend

### **Method 1: Quick Start (Recommended)**
```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Start server
python run.py

# 3. Test in browser
# Open: http://localhost:5000/api/health
```

### **Method 2: Using curl (Terminal)**
```bash
# Start server first: python run.py

# Test health endpoint
curl http://localhost:5000/api/health

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@takatrack.com","password":"demo123"}'
```

### **Method 3: Automated Test Script**
```bash
# Start server first: python run.py
# Then in another terminal:
python test_api.py
```

## 🔍 What to Look For

### ✅ **Success Signs:**
- Health endpoint returns: `{"status": "healthy", "timestamp": "..."}`
- Login returns: `{"token": "...", "user": {...}}`
- No error messages in terminal
- Server starts on port 5000

### ❌ **Error Signs:**
- Import errors (missing packages)
- Port 5000 already in use
- Database connection errors

## 🛠️ Common Issues & Fixes

**Problem:** `ModuleNotFoundError`
**Fix:** `pip install -r requirements.txt`

**Problem:** `Port 5000 in use`
**Fix:** Kill other processes or change port in `run.py`

**Problem:** `Permission denied`
**Fix:** Use virtual environment or `pip install --user`

## 📱 Test with Frontend

1. Start backend: `python run.py`
2. Start frontend: `cd ../frontend && npm start`
3. Login with: `demo@takatrack.com` / `demo123`