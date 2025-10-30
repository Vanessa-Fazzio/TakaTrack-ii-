# TakaTrack - Smart Waste Management App

A full-stack React + Flask application for smart waste management.

## Quick Start

Start the complete app:
```bash
./start-app.sh
```

Or start manually:

1. Backend:
```bash
cd backend
python3 server.py
```

2. Frontend:
```bash
cd frontend
npm start
```

## Access the App

- Frontend: http://localhost:3000
- Backend API: http://localhost:5003

## Demo Login

- Email: `demo@takatrack.com`
- Password: `demo123`

## Features

- User Registration & Login
- Dashboard with Statistics
- Waste Collection Management
- Real-time Notifications
- Mobile-Responsive Design
- Interactive Maps
- Recycling Tracking

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/notifications` - User notifications
- `GET /api/waste/bins` - Waste bin locations
- `GET /api/health` - Health check

## Project Structure

```
TakaTrack-ii-/
├── frontend/
├── backend/
├── start-app.sh
└── README.md
```

## Development

The app uses:
- Frontend: React 18, Tailwind CSS, Axios
- Backend: Flask, SQLite, CORS
- Authentication: Token-based auth
- Database: SQLite with sample data

## Next Steps

1. Run `./start-app.sh`
2. Open http://localhost:3000
3. Login with demo credentials
4. Explore the dashboard and features

Your TakaTrack app is ready!