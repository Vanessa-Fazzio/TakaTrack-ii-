# TakaTrack Team Setup Guide

## Quick Start
```bash
./start-app.sh
```

## Backend Setup (2 developers)
```bash
cd backend
pip install -r requirements.txt
python3 server.py
```
**Runs on:** http://localhost:5003

## Frontend Setup (3 developers)
```bash
cd frontend
npm install
npm start
```
**Runs on:** http://localhost:3000

## Demo Login
- **Email:** demo@takatrack.com
- **Password:** demo123

## Team Responsibilities

### Backend Team
- **Developer 1:** Authentication, User APIs
- **Developer 2:** Waste Collection, Dashboard APIs

### Frontend Team  
- **Developer 1:** Login/Register, Profile pages
- **Developer 2:** Dashboard, Waste Collection pages
- **Developer 3:** Map View, Recycling Tracker

## API Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/waste/collections` - Get collections
- `POST /api/waste/collections` - Create collection
- `GET /api/waste/bins` - Get waste bins
- `GET /api/dashboard/stats` - Dashboard data

## File Structure
```
backend/routes/
├── auth.py          # Authentication
├── waste.py         # Waste management
├── dashboard.py     # Dashboard data
└── notifications.py # Notifications

frontend/src/pages/
├── Login.js         # Login page
├── Dashboard.js     # Main dashboard
├── WasteCollection.js # Collection management
└── MapView.js       # Interactive map
```

## Development Tips
1. Backend runs on port 5003
2. Frontend runs on port 3000
3. Database auto-creates with sample data
4. Use demo credentials for testing
5. Check browser console for errors