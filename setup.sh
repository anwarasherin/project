#!/bin/bash

# Navigate to the backend directory
cd backend || { echo "Backend directory not found!"; exit 1; }

# Create a virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo "Virtual environment created."
else
    echo "Virtual environment already exists."
fi

# Activate the virtual environment
source venv/bin/activate || { echo "Failed to activate virtual environment!"; exit 1; }

# Install backend dependencies
pip install -r requirements.txt || { echo "Failed to install requirements!"; exit 1; }

# Run the Python script (ecc.py)
python ecc.py || { echo "Failed to run ecc.py!"; exit 1; }

# Move back to the root directory
cd ..

# Navigate to the frontend directory
cd frontend || { echo "Frontend directory not found!"; exit 1; }

# Install frontend dependencies
npm install || { echo "Failed to install npm packages!"; exit 1; }

echo "Project setup completed successfully!"
