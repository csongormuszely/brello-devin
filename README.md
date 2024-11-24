# Brello Project

## Overview
Brello is a task management application with a React frontend and a FastAPI backend.

## Project Structure
- `frontend/`: React application
- `backend/`: FastAPI application

## Setup Instructions

### Frontend
1. Navigate to the `frontend` directory
2. Run `npm install` to install dependencies
3. Run `npm start` to start the development server

### Backend
1. Navigate to the `backend` directory
2. Create a virtual environment: `python -m venv venv`
3. Activate the virtual environment:
   - On Windows: `venv\Scripts\activate`
   - On Unix or MacOS: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Set up environment variables (see .env.example)
6. Run the server: `uvicorn app.main:app --reload`

## Environment Variables
Create a `.env` file in the `backend` directory with the following variables:
- `DATABASE_URL`
- `JWT_SECRET_KEY`
- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_USERNAME`
- `EMAIL_PASSWORD`

## Dependencies
See `package.json` for frontend dependencies and `requirements.txt` for backend dependencies.
