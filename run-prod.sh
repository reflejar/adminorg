#!/bin/bash

# Start the backend server
cd /api
python manage.py migrate
gunicorn config.wsgi --bind 0.0.0.0:8000 &

# Start the frontend server
cd /front
npm start --