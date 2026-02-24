import csv
import time
import random
import os
from datetime import datetime

DATA_DIR = "./data"
CSV_FILE = os.path.join(DATA_DIR, "stream.csv")

# Ensure data directory exists
os.makedirs(DATA_DIR, exist_ok=True)

# Initialize CSV with headers if it doesn't exist
if not os.path.exists(CSV_FILE):
    with open(CSV_FILE, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["sensor_id", "timestamp", "temperature", "vibration"])

print(f"📡 Simulator started. Streaming data to {CSV_FILE}...")

try:
    while True:
        with open(CSV_FILE, "a", newline="") as f:
            writer = csv.writer(f)
            
            # 10% chance of critical anomaly
            is_critical = random.random() < 0.1
            
            sensor_id = f"TURBINE-{random.randint(1, 5)}"
            timestamp = int(time.time())
            
            if is_critical:
                temperature = random.uniform(900.0, 1200.0) # Critical Range
                vibration = random.uniform(50.0, 80.0)      # High Vibration
                status = "CRITICAL"
            else:
                temperature = random.uniform(600.0, 850.0)  # Normal Range
                vibration = random.uniform(10.0, 30.0)      # Normal Vibration
                status = "NORMAL"

            row = [sensor_id, timestamp, round(temperature, 2), round(vibration, 2)]
            writer.writerow(row)
            
            print(f"[{datetime.now().strftime('%H:%M:%S')}] Pushed: {row} ({status})")
            
        time.sleep(0.5)

except KeyboardInterrupt:
    print("\n🛑 Simulation stopped.")
