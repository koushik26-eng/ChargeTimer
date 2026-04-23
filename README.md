# ⚡ ChargeTimer

A smart battery charging calculator that helps you calculate precise charging times for your devices. Set timers, get browser notifications, and protect your battery health.

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-7-purple?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-blue?logo=tailwindcss)

## ✨ Features

- **Charging Calculator** — Input battery level, charger wattage, and calibration factor to get accurate charging time estimates
- **Device Profiles** — Save multiple device configurations for quick access
- **Countdown Timer** — Visual countdown with progress bar, pause/resume, and cancel
- **Browser Notifications** — Get notified when charging is complete (audio + push notification)
- **Offline-First** — All device profiles stored locally in your browser
- **Responsive Design** — Works on desktop, tablet, and mobile

## 🛠️ Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/ChargeTimer.git
cd ChargeTimer
```

### 2. Install dependencies

```bash
cd web
npm install
```

### 3. Start the development server

```bash
npm run dev
```

### 4. Open in browser

Visit **http://localhost:5173** in your browser.

## 📁 Project Structure

```
ChargeTimer/
├── web/                          # Main web application
│   ├── src/
│   │   ├── components/           # Reusable components
│   │   │   ├── ui/               # shadcn/ui components
│   │   │   ├── Header.jsx        # Navigation header
│   │   │   ├── CountdownTimer.jsx # Timer with progress bar
│   │   │   └── ScrollToTop.jsx   # Scroll restoration
│   │   ├── hooks/
│   │   │   └── useDeviceProfiles.js  # Device profiles (localStorage)
│   │   ├── lib/
│   │   │   └── utils.js          # Utility functions
│   │   ├── pages/
│   │   │   ├── HomePage.jsx      # Landing page
│   │   │   ├── CalculatorPage.jsx    # Charging calculator
│   │   │   └── ProfileManagementPage.jsx  # Manage device profiles
│   │   ├── App.jsx               # Root component with routing
│   │   ├── main.jsx              # Entry point
│   │   └── index.css             # Global styles & design tokens
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
├── package.json                  # Root package.json
└── README.md
```

## 🔧 How to Use

1. **Go to the Calculator** — Click "Get Started" or navigate to `/calculator`
2. **Enter Device Details** — Add your device name, charger wattage, and the 5-minute calibration factor
   - *Calibration factor*: Charge your device for exactly 5 minutes and note the percentage increase
3. **Set Battery Levels** — Adjust current and target battery percentages
4. **Calculate** — Click "Calculate Time" to get an estimated charging duration
5. **Start Timer** — Click "Start Charging Timer" to begin the countdown
6. **Save Profiles** — Save device configurations for quick reuse

## 🏗️ Built With

- [React 18](https://react.dev/) — UI framework
- [Vite 7](https://vite.dev/) — Build tool
- [Tailwind CSS 3](https://tailwindcss.com/) — Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com/) — Component library
- [Framer Motion](https://www.framer.com/motion/) — Animations
- [React Router v7](https://reactrouter.com/) — Client-side routing
- [Lucide React](https://lucide.dev/) — Icons
- [Sonner](https://sonner.emilkowal.dev/) — Toast notifications

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
