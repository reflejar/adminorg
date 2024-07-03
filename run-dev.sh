#!/bin/bash

# Start the backend server
cd /api
python manage.py migrate
python manage.py runserver 0.0.0.0:8000 &

# Start the frontend server
cd /front
npm run dev
