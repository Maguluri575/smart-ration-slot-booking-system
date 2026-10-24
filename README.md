# Smart Ration Slot Booking & Public Distribution Management System

A full-stack digital management system for Public Distribution Shops (PDS) built to solve overcrowding, queues, stock leakage, manual bookings, and transparency issues. It features role-based access for beneficiaries, dealers, and government civil supplies monitors, integrated with real-time updates and machine learning.

---

## 🏛️ Role-Based Portals

The application implements three roles with strict authorization:

1. **Beneficiary / Citizen Portal**
   - Credentials: User `RATION999` (PHH Card), `RATION888` (AAY Card - Priority / Senior Citizen), or `RATION777` (PHH - Priority / Disabled). Password: `password`
   - Features: Masked ration numbers, real-time shop stock levels, queue estimators (Low, Medium, High crowd levels), active slot booking, QR Code receipt generation (for check-in verification), missed booking reschedule alerts, cancellation, and multilingual AI Chatbot assistant (supporting English, Hindi, and Telugu).

2. **PDS Dealer Portal**
   - Credentials: User `DEALER101`, Password: `password`
   - Features: Today's queue registry (search & filter by status), QR Code check-in (supports camera scan and manual verification bypass), assisted booking form for elderly citizens, stock intake supply manager, and real-time distribution charts (Chart.js).

3. **Government / Admin Portal**
   - Credentials: User `ADMIN001`, Password: `password`
   - Features: State/District/Mandal location hierarchy selection, stock supply vs distribution KPIs, interactive charts, suspicious discrepancy alerts (low-stock alerts, high dealer manual booking ratios), and complete system audit logs.

---

## ⚙️ Core Architecture

- **Frontend**: Single Page Application served statically by Express. Implements light/dark themes, multilingual dynamic translations (EN, HI, TE), PWA service worker caching (offline availability), QR generation, QR scanning, and interactive dashboards.
- **Backend (Node.js/Express.js & Socket.IO)**: Implements JWT token auth, secure password hashing, location APIs, slot bookings, transaction logs, and real-time socket broadcasting.
- **Machine Learning (Python/Flask & Scikit-Learn)**: Serves a trained `RandomForestClassifier` pipeline on port `5000` to automatically predict PDS card classifications (`AAY`, `PHH`, `NPHH`) for new registrations based on demographic factors (district, income, family size, gas connection, etc.).
- **Database (Dual Adapter)**: Seamlessly operates on a local `ration_booking.db` (SQLite) out-of-the-box for convenient testing, and shifts automatically to **Supabase PostgreSQL** when `SUPABASE_URL` and `SUPABASE_KEY` are provided in the environment file.

---

## 🚀 Installation & Local Run Instructions

### Prerequisites
- Python 3.10+ (pip should be installed)
- Windows OS (Windows Powershell enabled)

### Step 1: Run Environment Setup
Open PowerShell and run the setup script in the project root:
```powershell
powershell -ExecutionPolicy Bypass -File .\setup_env.ps1
```
This script will:
1. Automatically download and unzip a **portable local Node.js environment** inside `.node-bin/` (eliminating the need for global Node installs or admin/UAC elevation).
2. Install Python scikit-learn, joblib, flask, and pandas dependencies.
3. Prepare the node package modules inside the `backend` directory.

### Step 2: Start the Machine Learning Service (Python Flask)
Open a new shell and start the ML server:
```powershell
python .\ml_service\app.py
```
This runs the Flask service on `http://127.0.0.1:5000`. On first load, it will automatically run the training script, generate a synthetic dataset of 1500 households, train the Random Forest model, and write `card_classifier.joblib`.

### Step 3: Start the Backend Web Server (Express & Socket.IO)
Open a new shell and start the Express server:
```powershell
# We must include the local Node binary folder in path for Express to find node and run sqlite3
cmd.exe /c "set PATH=C:\Users\venky\OneDrive\Documents\Smart Ration Slot Booking System\.node-bin;%PATH% && cd backend && npm start"
```
The application will launch on: **`http://localhost:3000`**

Open `http://localhost:3000` in your web browser. Try toggling Light/Dark theme or changing languages to see the UI translate instantly.

---

## 🧪 Verification & Sanity Tests

To verify code correctness, two pre-configured test scripts are included:

1. **Database & Schema Verification**:
   Ensure Node dependencies are installed, then run from the `backend/` directory:
   ```cmd
   # Inside backend/ folder:
   ..\.node-bin\node.exe test_db.js
   ```
   *Expected outcome*: Confirm that the schema creates the tables successfully, inserts mock data, hashes passwords, and pulls beneficiary profile stocks without any failures.

2. **Machine Learning Model Verification**:
   From the `ml_service/` directory, run:
   ```powershell
   python test_ml.py
   ```
   *Expected outcome*: Trains the Random Forest Classifier, loads the pipeline, and prints classification reports for sample demographics (AAY and NPHH predictions).

---

## 🗄️ Relational Database Schema

If you wish to configure **Supabase PostgreSQL** for production, log in to Supabase, create a project, paste the content of [supabase_schema.sql](file:///c:/Users/venky/OneDrive/Documents/Smart%20Ration%20Slot%20Booking%20System/supabase_schema.sql) into the SQL editor, and execute it. 

Add the credentials to a `.env` file in the `backend/` folder:
```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-supabase-public-anon-key
JWT_SECRET=your-secure-jwt-key
PORT=3000
```
Restart the Express server to switch database operations to Supabase.
