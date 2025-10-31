#!/bin/bash

echo "🚀 Setting up mobile backend access..."

# Install ngrok if not installed
if ! command -v ngrok &> /dev/null; then
    echo "Installing ngrok..."
    curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
    echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list
    sudo apt update && sudo apt install ngrok
fi

echo "📱 Starting backend with ngrok tunnel..."

# Start backend
cd backend
python3 server.py &
BACKEND_PID=$!

sleep 3

# Start ngrok tunnel
ngrok http 5003 &
NGROK_PID=$!

echo "✅ Backend running with tunnel!"
echo "🔗 Check ngrok dashboard at: http://localhost:4040"
echo "📋 Copy the HTTPS URL and update App.js API_URL"

trap 'echo "Stopping servers..."; kill $BACKEND_PID $NGROK_PID 2>/dev/null; exit' INT
wait