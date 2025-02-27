#!/bin/bash

# Navigate to the backend directory
cd backend || { echo "Backend directory not found!"; exit 1; }

# Activate the Python virtual environment
source venv/bin/activate || { echo "Virtual environment not found!"; exit 1; }

# Start the first Uvicorn server (blockchain:app) on port 3000 in the background
uvicorn blockchain:app --reload --port 3000 &

# Start the second Uvicorn server (main:app) on the default port (8000) in the background
uvicorn main:app --reload &

# Move back to the root directory
cd ..

# Navigate to the frontend directory
cd frontend || { echo "Frontend directory not found!"; exit 1; }

# Start the frontend development server
npm run dev
