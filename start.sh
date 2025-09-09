#!/bin/bash

echo "[INFO] - Launching backend..."
source /Users/beckorion/Documents/Developer/Projects/CoreView/backend/venv/bin/activate
cd backend || exit 1
python app.py > /dev/null 2>&1 &
BACKEND_PID=$!
cd ..

echo "[OKAY] - Backend launched"

echo "[INFO] - Launching frontend..."
cd core-view-frontend || exit 1
npm run dev > /dev/null 2>&1 &
FRONTEND_PID=$!
cd ..

echo "[OKAY] - Frontend launched"

# Trap Ctrl+C to clean up
trap "echo; echo '[STOPPED] - Shutting down...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" INT

# Wait for both background processes
wait $BACKEND_PID $FRONTEND_PID
