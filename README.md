# ♻️ TakaTrack — Smart Waste Management System

TakaTrack is a Smart Waste Management System designed to help waste management companies, local authorities, and communities efficiently track, manage, and optimize waste collection, disposal, and recycling activities.

---

## 🌍 Project Overview

TakaTrack aims to promote a cleaner, greener, and smarter environment through the use of technology.  
The platform automates key processes such as scheduling, **GPS tracking, **notifications, and **data reporting, ensuring timely waste collection and efficient operations.

---

## 🚀 Key Features

- 📍 GPS Tracking: Real-time monitoring of waste collection trucks and bin locations.  
- 🗓️ Automated Scheduling: Automatically plan and optimize collection routes.  
- 🔔 Notifications: Send alerts to users and staff on collection updates or missed schedules.  
- ♻️ Recycling Tracking: Keep records of recyclable waste and environmental impact.  
- 📊 Dashboard & Analytics: View statistics on collection progress and waste trends.  

---

## 🧠 Tech Stack

Frontend: React.js  
Backend: Flask (Python)  
Database: PostgreSQL / MySQL / MongoDB  
Version Control: Git & GitHub  
Design: Figma  

---

## 👥 Team Members & Roles

| Name | Role | Responsibilities |
|------|------|------------------|
| Vanessa Fazzio | 🖥️ Frontend Developer 1B: Logic & Integration |  Data handling and user authentication
| Christian Michael | 🗺️ Frontend Developer 2 – Maps & Notifications | Adds interactive map features, notifications, and UX improvements |
| Randy Wanyoike | 🧩 Backend Developer 1 – Core System & Database | Builds data models, CRUD APIs, and manages database logic |
| Feysal Dahir | ⚙️ Backend Developer 2 – Features & Integrations | Implements GPS tracking, scheduling automation, and notifications |
| * Josiah Brown*| Frontend Developer 1A: UI & Layouts  |  Visual design and page structure | 

---

## 🧩 Detailed Task Distribution

### 👨‍💻 Frontend Developer 1B: Logic & Integration - Vanessa Fazzio

Main focus: Data handling and user authentication

Tasks:
	•	Handle user authentication:
	•	Login & Register pages (with JWT or tokens)
	•	Secure routes (protect dashboard after login)
	•	Integrate backend APIs:
	•	Fetch and display data (bins, schedules, recycling records)
	•	Handle loading, error, and success states.
	•	Implement form submissions (waste collection, recycling updates).
	•	Connect all UI components from 1A to real backend data.
	•	Test and debug API connections.

✅ Deliverable: Fully functional interface that fetches real data, handles authentication, and connects UI to backend.


---

### 🗺️ Frontend Developer 2: Maps & Notifications — Christian Michael

Main Focus: Interactivity and visualization.  
Tasks:
- Integrate map views showing bin locations and routes.  
- Add real-time bin status indicators (full/empty, collected, pending).  
- Implement notification alerts (popups, badges, etc.).  
- Improve app responsiveness and animations.  
- Ensure design consistency across all screens.  

✅ End Deliverable: Interactive, real-time user features such as maps and alerts.

---

### 👩‍💻 Frontend Developer 1A: UI & Layouts - Josiah Brown

Main focus: Visual design and page structure

Tasks:
	•	Set up the project structure (React app, routing, folder organization).
	•	Build the static UI components:
	•	Dashboard layout (sidebar, navbar, cards)
	•	Waste collection table/form (structure + design)
	•	Recycling tracking page (UI only)
	•	Apply styling & responsiveness (CSS frameworks like Tailwind, Bootstrap, or custom CSS).
	•	Ensure design matches Figma/UI guidelines.
	•	Implement reusable components (buttons, modals, forms).

✅ Deliverable: Well-styled, responsive UI with consistent layouts and components (no backend connection yet).





### 🧩 Backend Developer 1: Core System & Database — Randy Wanyoike

Main Focus: Data and logic layer.  
Tasks:
- Set up database (PostgreSQL, MySQL, or MongoDB).  
- Create models for:
  - Users (drivers, admins, residents)
  - Waste bins / collection points
  - Collection schedules
  - Recycling records  
- Build CRUD APIs for waste collection and disposal management.  
- Handle data validation and error handling.  

✅ End Deliverable: Functional backend with clean APIs and reliable data storage.

---

### ⚙️ Backend Developer 2: Features & Integrations — Feysal Dahir

Main Focus: Smart automation and real-time features.  
Tasks:
- Implement GPS tracking (Google Maps or OpenStreetMap APIs).  
- Build automated scheduling for collection days.  
- Integrate notifications (email, SMS, or push).  
- Add real-time updates using WebSockets or Firebase (optional).  
- Test endpoints using Postman or Swagger.  

✅ End Deliverable: A connected, automated backend that powers smart system features.

---

## 🏗️ Project Setup Instructions

### 🖥️ Frontend (React)

1. Clone the repository
   ```bash
   git clone https://github.com/VanessaFazzio/TakaTrack(ii).git
