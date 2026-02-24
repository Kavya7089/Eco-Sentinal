import csv
import time
import os
import requests
import json
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Configure Gemini
if GEMINI_API_KEY:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-pro')
    except Exception as e:
        print(f"⚠️ Gemini Config Error: {e}")
        model = None
else:
    print("⚠️ Warning: GEMINI_API_KEY not found in .env")
    model = None

CSV_FILE = "./data/stream.csv"

def ask_gemini(temp: float, vibration: float) -> str:
    """
    Query Gemini for a repair action using the standard library.
    """
    if not model:
        return "CRITICAL: Check Manual (AI Config Error)"
        
    try:
        prompt = (
            f"Sensor Data: Temperature is {temp}°C. Vibration is {vibration}Hz. "
            f"The threshold is 900°C. Since this value is high, Provide a short, technical "
            f"2-sentence repair instruction for a factory operator. "
            f"Start with 'ACTION REQUIRED:'."
        )
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"AI Error: {str(e)}"

def push_to_supabase(data):
    """
    Push data to Supabase using REST API (avoids heavy SDK dependencies).
    """
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("⚠️ Supabase skipped (missing URL/KEY)")
        return

    url = f"{SUPABASE_URL}/rest/v1/alerts"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }
    
    try:
        response = requests.post(url, headers=headers, json=data)
        if response.status_code in [200, 201]:
            print(f"✅ Alert synced to Supabase")
        else:
            print(f"❌ Supabase Error {response.status_code}: {response.text}")
    except Exception as e:
        print(f"❌ Supabase Connection Error: {e}")

def tail_csv(filename):
    """
    Generator that yields new lines from a CSV file as they are written.
    Implements 'tail -f' behavior.
    """
    if not os.path.exists(filename):
        return

    # Open the file and go to the end
    with open(filename, "r") as f:
        # Move to end of file
        f.seek(0, 2)
        
        while True:
            line = f.readline()
            if not line:
                time.sleep(0.1)
                continue
            yield line

def main():
    print(f"🚀 Windows Backend Running (Lightweight Mode)...")
    print(f"📡 Monitoring {CSV_FILE} for anomalies...")
    
    if not os.path.exists(CSV_FILE):
        print(f"❌ Error: {CSV_FILE} not found. Please run 'python simulate_sensors.py' first.")
        return

    # Use a custom CSV reader on the standard input stream
    for line in tail_csv(CSV_FILE):
        try:
            # Skip empty lines
            if not line.strip():
                continue
                
            parts = line.strip().split(',')
            if len(parts) < 4:
                continue
                
            # Parse row: sensor_id, timestamp, temperature, vibration
            sensor_id = parts[0]
            try:
                temperature = float(parts[2])
                vibration = float(parts[3])
            except ValueError:
                continue # Skip header or bad data

            # Filter Logic (Temp > 900)
            if temperature > 900:
                print(f"🔥 Anomaly Detected! Temp: {temperature}°C")
                
                # AI Logic
                action = ask_gemini(temperature, vibration)
                print(f"🤖 AI Insight: {action}")
                
                # Supabase Logic
                data = {
                    "sensor_id": sensor_id,
                    "temperature": temperature,
                    "vibration": vibration,
                    "timestamp": int(time.time() * 1000), 
                    "repair_action": action
                }
                push_to_supabase(data)

        except Exception as e:
            print(f"Error processing line: {e}")

if __name__ == "__main__":
    main()
