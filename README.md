# Wellness AI — Student Ergonomics & Biomechanical Station 🧘‍♂️💻

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20On--Device%20AI-blue.svg)](index.html)
[![Computer Vision](https://img.shields.io/badge/Computer%20Vision-MediaPipe%20Pose-orange.svg)](https://developers.google.com/mediapipe)
[![Standards](https://img.shields.io/badge/Ergonomics-ISO%209241--5%20%7C%20OSHA-teal.svg)](https://www.iso.org/standard/44889.html)
[![Event](https://img.shields.io/badge/Presented%20at-NCSC%202026-purple.svg)](#)

> **A scientific ergonomics, physical habit observation, and biomechanical workstation platform for students and researchers.** Built for the **National Children's Science Congress (NCSC) 2026**.

---

## 🌟 Highlights & Overview

**Wellness AI** is an intelligent, privacy-first digital ergonomics workstation designed to counter sedentary fatigue, spinal misalignment, and digital eye strain among school students and young researchers. 

Operating **100% on-device** directly within modern web browsers, the station processes webcam feeds locally via Google MediaPipe Pose without transmitting a single frame over the internet.

---

## 🚀 Key Modules & Features

### 1. 📐 Live Posture Analysis & Biomechanical Tracking
- **Real-Time Angle Computation:** Tracks 33 skeletal keypoints to calculate:
  - **Spine & Lumbar Angle:** Evaluates vertical spinal neutrality against slouching.
  - **Cervical Head Tilt:** Monitors forward head posture ("tech-neck").
  - **Screen Distance Proximity:** Estimates focal distance using inter-shoulder and ocular dimensions.
- **Dynamic Posture Index Gauge:** Continuous 0–100 ergonomic health index calculated using weighted moving averages.
- **Auditory & Visual Biofeedback:** Real-time feedback and gentle chimes upon sustained poor posture.

### 2. 🦸‍♂️ Ergonomic Visual Companion (Interactive Anime Avatars)
- Dynamic companion avatars reacting live to your posture and workout routines:
  - **Goku** (*Dragon Ball*): Supports Base State, Super Saiyan, and Ultra Instinct transformations based on posture streaks!
  - **Gojo Satoru** (*Jujutsu Kaisen*)
  - **Shinchan** (*Crayon Shin-chan*)
- Dynamic contextual dialogue bubbles providing posture reminders and encouragement.

### 3. 🤸 Guided Stretch Routine (Vision-Verified)
- **90-Second Micro-Breaks:** Scientifically curated stretches targeting common study fatigue zones:
  - Neck Left/Right Tilt
  - Shoulder Shrugs & Rolls
  - Overhead Arm & Spinal Stretch
  - Chest Expansion
- **Pose Verification:** MediaPipe detects correct stretch execution before advancing the routine timer and awarding completion points.

### 4. 🏋️ FitMove — Repetition & Exercise Counter
- On-device computer vision repetition counting for home physical workouts:
  - **Bodyweight Squats** (knee & hip flexion angle tracking)
  - **Arm Raises / Lateral Deltoid Lifts**
  - **Jumping Jacks**
  - **Floor Pushups**
- Automatic repetition state transitions, set targets (10, 15, 20, 25 reps), and celebration analytics.

### 5. 📏 ErgoCalc Blueprint (ISO 9241-5 & OSHA Compliant)
- Interactive height-based anthropometric calculator.
- Generates millimeter-accurate ergonomic station specifications:
  - Optimal Chair Seat Pan Height & Depth
  - Desk Surface Elevation
  - Monitor Top-Edge Line-of-Sight & Distance
  - Footrest Necessity Indicator
- Supports Metric (`cm`) and Imperial (`ft/in`) units with student cohort presets (Class 6, Class 8, Senior).

### 6. 💧 Smart Study Endurance & Healthy Habits
- **Water Hydration Tracker:** 45-minute countdown cadence with quick `+250ml` logging toward a 2,000ml daily target.
- **Integrated Pomodoro Timer:** 25-minute focus intervals coupled with automatic stretch break notifications.
- **Eco-Saving Screen Dimmer:** Automatic display dimming if the student steps away from their desk.
- **Ambient Lighting Detector:** Analyzes optical video luminance to notify if study area lux is too dim or causes glares.
- **Voice Control Mode:** Hands-free commands (`start timer`, `open posture`, `stretch routine`, `log water`).

### 7. 📊 Progress Logs & Gamification
- Daily Health Points Ledger tracking:
  - Sustained Posture Minutes
  - Completed Stretch Routines
  - FitMove Workout Sets
  - Hydration Compliance
  - Slouch Deductions
- Consistency streaks, achievement badges, and exportable session logs with Chart.js visualization.

---

## 🔒 Privacy & Security Guarantee

- **100% Client-Side:** Computer vision models execute exclusively inside the browser utilizing WebGL/WebAssembly.
- **Zero Cloud Video Ingestion:** No camera feeds, video snippets, or facial biometric data are uploaded, saved to external servers, or shared with third parties.

---

## 🛠️ Tech Stack

- **Frontend Core:** Semantic HTML5, CSS3 (Custom Design System, Glassmorphism, Micro-Animations)
- **Programming Language:** Vanilla JavaScript (ES6+, Strict Mode)
- **Computer Vision Engine:** Google MediaPipe Pose (`@mediapipe/pose`, `@mediapipe/camera_utils`)
- **Data Visualization:** Chart.js 4.4
- **Typography:** Fraunces, Source Sans 3, JetBrains Mono (Google Fonts)
- **Assets:** High-quality SVGs and animated companion media

---

## 📁 Project Structure

```text
├── assets/
│   ├── illustrations/     # Standby, ergonomic diagrams, and vector assets
│   ├── images/            # Student avatars and sample previews
│   └── videos/            # Companion character animation loops (Goku, Gojo, Shinchan)
├── css/
│   └── style.css          # Design system, responsive layouts & typography
├── js/
│   └── app.js             # Core logic, MediaPipe integration, state store, modules
├── index.html             # Main application entry point & workstation shell
├── .gitignore             # Git ignore patterns
└── README.md              # Project documentation
```

---

## ⚡ Quick Start & Usage

### Option 1: Direct Local Execution (No Node.js Required)
Because Wellness AI is built using pure vanilla web standards, you can run it with any static web server:

1. Clone or extract the repository:
   ```bash
   git clone https://github.com/neodyit/aaditya.git
   cd aaditya
   ```
2. Serve via any local web server (required for MediaPipe and camera stream access over `http://localhost`):
   - **Using Python 3:**
     ```bash
     python -m http.server 8000
     ```
   - **Using Node `npx serve`:**
     ```bash
     npx serve .
     ```
   - **Using XAMPP / WampServer:**
     Place the project folder inside your `htdocs` directory and navigate to:
     ```text
     http://localhost/aaditya/
     ```
3. Open your browser at `http://localhost:8000` (Google Chrome, Microsoft Edge, or Firefox recommended).
4. Grant webcam permissions when prompted to enable biomechanical tracking.

---

## 🏆 Project Credits

- **Author / Developer:** Aaditya ([@neodyit](https://github.com/neodyit))
- **Event:** National Children's Science Congress (NCSC) 2026
- **Category:** Junior Science & Technology Laboratory / Health Informatics

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — free for educational and scientific research purposes.
