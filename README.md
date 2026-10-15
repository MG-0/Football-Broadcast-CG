---
title: Football Broadcast CG
emoji: ⚽
colorFrom: blue
colorTo: green
sdk: docker
app_port: 7860
---

# Football Broadcast Graphics Control System (CG)

A real-time broadcast Character Generator (CG) and control system for football matches. This system allows producers to configure, preview, and trigger dynamic live broadcast graphic overlays (lower thirds, scorebugs, lineups, tactical configurations, sponsorships, etc.) directly onto a live video stream using software like OBS Studio, vMix, or any browser-based broadcast interface.

---

## 📂 Project Structure

The project is structured into three main modules:

1. **`api/` (Backend Server)**
   * Built with **Node.js**, **Express**, and **Socket.io** for real-time WebSocket communication.
   * Manages the persistent match configuration database (matches, teams, sponsors, tournaments).
   * Serves as the central hub routing control triggers from the dashboard to the active overlays.

2. **`dashboard/` (Control Interface)**
   * A premium React-based Single Page Application (SPA) styled with **Tailwind CSS**.
   * Offers match management (CRUD), sponsor management, team directories, and a robust Live Control Console.
   * Features custom offset positioning adjustments (X, Y offsets and scale) for live graphics.

3. **`overlay/` (Broadcast Graphics Output)**
   * Frontend overlays built using Vanilla HTML5, CSS3, and **GSAP (GreenSock Animation Platform)**.
   * Establishes a real-time socket connection with the backend to receive toggle commands and payloads.
   * Rendered directly inside OBS Studio/vMix as a transparent *Browser Source*.

---

## 🚀 Getting Started (Local Setup)

Follow these steps to run the complete system on your local development environment.

### Prerequisites
* **Node.js** (version 16.x or higher)
* **npm** (Node Package Manager)

---

### Step 1: Run the Backend API Server

1. Navigate to the `api` directory:
   ```bash
   cd api
   ```
2. Install the server dependencies:
   ```bash
   npm install
   ```
3. Set up the environment variables:
   * Copy the template `.env.example` file to a new file named `.env`:
     ```bash
     cp .env.example .env
     ```
   * Open the `.env` file and input your Mongo Database URI connection string and JWT secret key.
4. Run the server in development mode:
   ```bash
   npm run dev
   ```
   * The server runs on: `http://localhost:5000`
   * WebSocket port: `5000`

---

### Step 2: Run the Frontend Control Dashboard

1. Navigate to the `dashboard` directory:
   ```bash
   cd dashboard
   ```
2. Install the dashboard dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   * Open `http://localhost:5173` in your web browser to access the control panel.

---

### Step 3: Integrate overlays in Broadcast Software (OBS/vMix)

1. **Local Preview**: Open the [overlay/index.html](overlay/index.html) file directly in your browser.
2. **OBS Integration**:
   * Add a new **Browser Source** in OBS.
   * Check "Local file" and select the path to `overlay/index.html` (or serve it via a local static server like Live Server).
   * Set the resolution width to `1920` and height to `1080`.
   * Trigger any graphic overlay from the dashboard (e.g. Turn "Scorebug" to **SHOW**), and it will animate instantly on OBS.

---

### Step 4: Public Mobile Testing (Optional via ngrok)

To test the **QR Code Landing Page** on actual mobile devices from any network (outside the local Wi-Fi):
1. Make sure your local Express server is running on port `5000`.
2. Start an HTTP tunnel using ngrok:
   ```bash
   ngrok http 5000
   ```
3. Copy the generated public URL (e.g., `https://xxxx.ngrok-free.app`).
4. In the Control Dashboard, navigate to the **QR Code** page and paste the ngrok URL into the **ngrok URL** input field.
5. Click **Save Configuration**. The QR Code will immediately re-generate using this public tunnel link, allowing any phone scanning it to open the interactive live overlay landing page from anywhere.

---

## ⚡ Key Graphic Layers & Features

* **Scorebug Overlay**: Live clock, score updates, period controls, team colors, and badges.
* **Lineup & Tactical Formations**: Displays starting lineups and bench rosters with customizable team tactical formations (e.g., 4-3-3, 4-4-2).
* **Player Spotlight & Profile**: Custom badge highlights for selected players.
* **Event Alerts**: Substitution boards, VAR review indicators, offside alerts, and cards.
* **Sponsorships & Ads**: Top/bottom sponsor banners and tickers.
* **Weather Reports**: Local stadium temperature, wind direction/speed, and pitch condition overlays.
* **QR Codes**: Trigger live QR codes redirecting viewers to custom landing pages.
* **Custom Positioning (Offsets)**: Adjust the X, Y coordinates and scale of individual graphics directly from the control panel to fit any broadcast feed aspect ratio.

---

## 💎 Code Standards & Quality

To ensure long-term maintainability and high code quality:
* **Prettier**: Code formatting is standardized across the entire project (backend, frontend, and overlay directories).
* **ESLint**: Standard JS guidelines are enforced including logical blank lines between statements and functions for clean readability.
* **Documentation**: Key functions, routes, state variables, and hooks are fully documented with lightweight, developer-friendly comments.
