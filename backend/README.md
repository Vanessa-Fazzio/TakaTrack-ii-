# TakaTrack Backend API

Flask-based REST API for the TakaTrack waste management mobile app.

## Features

- 🔐 JWT Authentication
- 👤 User management
- 🗑️ Waste bin tracking
- 📅 Collection scheduling
- ♻️ Recycling tracking with environmental impact
- 🔔 Notifications system
- 📊 Dashboard statistics

## Quick Start

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Run the application:
```bash
python run.py
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/recent-activity` - Get recent activity

### Waste Management
- `GET /api/waste/bins` - Get all waste bins
- `GET /api/waste/bins/<id>` - Get specific bin
- `GET /api/waste/collections` - Get user collections
- `POST /api/waste/collections` - Schedule new collection
- `PUT /api/waste/collections/<id>` - Update collection
- `DELETE /api/waste/collections/<id>` - Cancel collection

### Recycling
- `GET /api/recycling/records` - Get recycling records
- `POST /api/recycling/records` - Add recycling record
- `GET /api/recycling/stats` - Get recycling statistics
- `DELETE /api/recycling/records/<id>` - Delete record

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/<id>/read` - Mark notification as read
- `PUT /api/notifications/mark-all-read` - Mark all as read
- `DELETE /api/notifications/<id>` - Delete notification

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile
- `PUT /api/profile/change-password` - Change password

## Sample Data

The application creates sample data on first run:
- Demo user: `demo@takatrack.com` / `demo123`
- Sample waste bins with different statuses
- Sample collections and notifications

## Environment Variables

- `SECRET_KEY` - Flask secret key
- `JWT_SECRET_KEY` - JWT signing key
- `DATABASE_URL` - Database connection string
- `FLASK_ENV` - Environment (development/production)

## Database

Uses SQLite by default. The database file will be created automatically as `takatrack.db`.

## CORS

CORS is enabled for all origins to support frontend development.