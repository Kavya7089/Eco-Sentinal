# 🚀 Deployment Guide (Zero Cost)

Follow these steps to get your Eco-Sentinel project live on the internet for free.

---

## 🎨 Part 1: Frontend (Vercel)

Vercel will host your dashboard UI.

1.  Go to [Vercel](https://vercel.com/) and sign up with GitHub.
2.  Click **"Add New Project"**.
3.  Import your repository: `Kavya7089/Eco-Sentinal`.
4.  In **Environment Variables**, add:
    *   `VITE_SUPABASE_URL`: (Your Supabase URL)
    *   `VITE_SUPABASE_KEY`: (Your Supabase Anon/Public Key)
5.  Click **Deploy**.

---

## ⚙️ Part 2: Backend (Render)

Render will run your Python code and process sensor data.

1.  Go to [Render](https://render.com/) and sign up with GitHub.
2.  Click **"New +"** and select **"Web Service"**.
3.  Import your repository: `Kavya7089/Eco-Sentinal`.
4.  Set the following:
    *   **Name**: `eco-sentinel-backend`
    *   **Runtime**: `Python`
    *   **Build Command**: `pip install -r backend/requirements.txt`
    *   **Start Command**: `sh backend/start_deploy.sh`
5.  In **Environment Variables**, add:
    *   `GEMINI_API_KEY`: (Your Google AI API Key)
    *   `SUPABASE_URL`: (Same as above)
    *   `SUPABASE_KEY`: (Use the **Service Role Key** here so the backend can bypass RLS)
6.  Click **Create Web Service**.

---

## 📦 Part 3: Database (Supabase)

Ensure your `alerts` table is set up in Supabase (you already did this via the SQL Editor).

> [!NOTE]  
> Since you pushed the code to GitHub, avoid committing any `.env` files. Always use the Platform's dashboard (Vercel/Render) to set secrets.

---

## 🛠️ How it works in the Cloud
I have created a script called `backend/start_deploy.sh`. When Render starts, it will:
1.  Run `simulate_sensors.py` to start generating data.
2.  Run `main_windows.py` (which works on Linux too) to process that data.
3.  It will also run a tiny web server so Render knows the service is "healthy."
