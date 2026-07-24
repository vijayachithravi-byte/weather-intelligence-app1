# Weather Intelligence Web Application

A modern, responsive, and feature-rich Weather Intelligence dashboard built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**.

The application provides real-time weather metrics, 7-day weather forecasts, 24-hour hourly timelines, interactive trend charts, and AI-powered weather recommendations powered by **Open-Meteo APIs** and **Gemini 3.6 Flash**.

---

## 🌟 Key Features

### 1. Smart Location Search
- Search any city globally with real-time autocompletion via Open-Meteo Geocoding API.
- Search validation, friendly error handling, and major city quick shortcuts.
- Keyboard navigation support (`ArrowUp`, `ArrowDown`, `Enter`, `Escape`).
- Recent searches history saved locally with favorite toggle capability.
- One-click browser Geolocation detection (`My Location`).

### 2. Comprehensive Current Weather
- City, State/Province, Country name, and Country Code.
- Temperature in **°C** or **°F** (with instant toggle).
- Feels-like temperature, Daily Min & Max temperatures.
- Weather condition description and dynamic animated Lucide weather icons.
- Atmospheric metrics: **Humidity (%)**, **Wind Speed & Direction**, **Barometric Pressure (hPa)**, **Visibility (km)**, **UV Index**, **Sunrise & Sunset times**.
- Last updated timestamp and manual refresh control.

### 3. 7-Day Weather Forecast
- Daily cards displaying date, day name, weather condition, min/max temperature range bars, and rain probability.
- Expandable daily details showing precipitation volume (mm), max wind gusts (km/h), max UV index, and temperature spread.

### 4. 24-Hour Timeline Forecast
- Smooth horizontal scrollable 24-hour weather timeline with icons, hourly temperatures, humidity, and rain chance badges.

### 5. Interactive Weather Analytics Charts
- Interactive data visualizations powered by **Recharts**:
  - **Temperature Trend**: Area chart mapping daily Min vs. Max temperatures.
  - **Precipitation**: Bar chart displaying daily rain probability and rainfall volume.
  - **Humidity**: Area chart showing 24-hour relative humidity trend.
  - **Wind Speed**: Line chart showing peak wind gusts.

### 6. AI Weather Intelligence & Recommendations
- Algorithmic and **Gemini 3.6 Flash** AI recommendation engine covering:
  - **Clothing Suggestions**: Layering, outerwear, and footwear tips based on temperature.
  - **Outdoor Activity Advice**: Ideal sports, hiking, walking, or indoor gym recommendations.
  - **Travel & Commute Advice**: Wind warnings, driving visibility, and road stability alerts.
  - **Health Precautions**: UV index hazard warnings, pollen/humidity alerts, and cold protection.
  - **Hydration Reminders**: Fluid intake goals adjusted for heat and relative humidity.
  - **Rain & UV Alerts**: Immediate umbrella warnings and SPF recommendations.
- Interactive category filter chips (*All*, *Clothing*, *Activities*, *Travel*, *Health*, *Hydration*, *Rain Alert*, *UV Care*).
- "Generate Gemini AI Deep Analysis" button for custom AI weather executive summaries.

---

## 🛠️ Technologies Used

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Lucide React Icons
- **Data Visualization**: Recharts
- **Weather Data Source**: Free Open-Meteo Geocoding & Forecast APIs (No API key required)
- **AI Recommendation Engine**: Express server backend with `@google/genai` (Gemini 3.6 Flash)
- **State Management & Persistence**: React Hooks + Browser `localStorage`

---

## 🚀 Getting Started Locally

### Prerequisites
- **Node.js**: v18 or higher
- **npm**: v9 or higher

### Installation

1. **Clone or download the repository:**
   ```bash
   git clone <repository-url>
   cd weather-intelligence
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables (Optional):**
   Copy `.env.example` to `.env`:
   ```env
   GEMINI_API_KEY="your_gemini_api_key_here"
   ```
   *Note: The core weather forecast and local AI rule engine operate seamlessly without an API key!*

4. **Run Development Server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

---

## 📦 Production Build Instructions

To create an optimized production build:

```bash
npm run build
```

This will run Vite build for the frontend bundle and Esbuild for the Express backend wrapper, outputting static client assets into `dist/`.

To test the production build locally:

```bash
npm run start
```

---

## ☁️ Cloudflare Pages Deployment Instructions

This application is fully compatible with **Cloudflare Pages** for client-side SPA hosting.

### Method 1: Git Integration (Recommended)

1. Push your repository to **GitHub** or **GitLab**.
2. Log into the [Cloudflare Dashboard](https://dash.cloudflare.com/) and navigate to **Workers & Pages** → **Create Application** → **Pages** → **Connect to Git**.
3. Select your repository and configure build settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Build Output Directory**: `dist`
4. Environment Variables:
   - Add `NODE_VERSION` = `18` or `20`.
5. Click **Save and Deploy**. Cloudflare Pages will build and host your site on a global CDN edge network.

### Method 2: Direct Upload via Wrangler CLI

1. Install Wrangler CLI:
   ```bash
   npm install -g wrangler
   ```
2. Build the project:
   ```bash
   npm run build
   ```
3. Deploy the `dist` directory:
   ```bash
   wrangler pages deploy dist --project-name=weather-intelligence
   ```

---

## 📄 License
Apache-2.0 License
