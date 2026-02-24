import pathway as pw
import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_DB_URI = os.getenv("SUPABASE_DB_URI") # Format: postgresql://user:pass@host:port/dbname

# Configure Gemini
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-pro')

def ask_gemini_udf(temp: float, vibration: float) -> str:
    """
    User-Defined Function to query Gemini.
    Only triggered for filtered rows.
    """
    if not GEMINI_API_KEY:
        return "CRITICAL: Connector Logic Error (No API Key)"
        
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

# 1. Input Connector (Streaming CSV)
data = pw.io.csv.read(
    "./data/stream.csv",
    mode="streaming",
    schema=pw.schema_from_csv("./data/stream.csv")
)

# 2. Filtering (Real-Time ETL)
# Only process rows where temperature > 900
critical_alerts = data.filter(pw.this.temperature > 900.0)

# 3. RAG / Logic Layer (Apply Gemini)
# We use pw.apply to run the python function on specific columns
enriched_alerts = critical_alerts.select(
    *pw.this,
    repair_action=pw.apply(ask_gemini_udf, pw.this.temperature, pw.this.vibration)
)

# 4. Output Connector (Supabase/Postgres)
# We write the processed results to the 'alerts' table
if SUPABASE_DB_URI:
    pw.io.postgres.write(
        enriched_alerts,
        postgres_connection_string=SUPABASE_DB_URI,
        table_name="alerts",
        mode="append"
    )
else:
    # Fallback for debugging: Print to console if no DB configured
    pw.io.csv.write(enriched_alerts, "critical_alerts_log.csv")

# Run the pipeline
if __name__ == "__main__":
    print("🚀 Pathway Pipeline Running...")
    pw.run()
