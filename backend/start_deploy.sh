#!/bin/bash

# Navigate to backend directory
cd backend

# Start the sensor simulator in the background
python simulate_sensors.py &

# Start a simple HTTP server in the background to satisfy Render's health check
# Render requires a port to be listening even for background workers
python -m http.server $PORT &

# Start the main processing script
# We use main_windows.py because it doesn't depend on Pathway (which is heavy for free tiers)
python main_windows.py
