#!/bin/bash

echo "Starting TakaTrack Full Stack App..."

pkill -f "python.*server.py" 2>/dev/null || true
pkill -f "npm start" 2>/dev/null || true

echo "Starting Backend Server..."
cd backend
python3 server.py &
BACKEND_PID=$!
echo "Backend started with PID: $BACKEND_PID"

sleep 3

echo "Starting Frontend..."
cd ../frontend
npm start &
FRONTEND_PID=$!
echo "Frontend started with PID: $FRONTEND_PID"

echo ""
echo "TakaTrack App is running!"
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:5003"
echo ""
echo "Demo Login:"
echo "Email: demo@takatrack.com"
echo "Password: demo123"
echo ""
echo "Press Ctrl+C to stop both servers"

trap 'echo "Stopping servers..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit' INT
wait