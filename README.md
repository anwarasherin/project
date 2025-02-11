# Welcome to Dynamic AES with Blockchain

## Create a virtual environment

$ python3 -m venv venv

$ source venv/bin/activate

## Installation

Install the application dependecies

`$ pip install -r requirements.txt`

Run the backend server

`$ uvicorn main:app --reload`

Run the blockchain server

`$ uvicorn blockchain:app --reload --port 3000`
