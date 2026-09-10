# 🚌 TransitGo - Next-Gen Bus Booking Platform

An interactive, high-performance bus booking web application tailored for Sri Lankan expressway and national long-distance transit corridors.

### 🌐 Live Showcase
[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit_TransitGo-10b981?style=for-the-badge&logo=vercel)](https://transit-go-bus-booking-system.vercel.app/)

---

### 🌟 Key Architectural & Functional Features

#### 🚍 Passenger Booking & Exploration Experience
* **Dynamic Corridor Search:** Multi-town route detection across major Sri Lankan expressways and national transit networks with one-click origin/destination swapping.
* **Dual Journey Flow:** Seamless support for both **One-Way** and **Round-Trip (Save 5%)** booking with sequential Outbound ➔ Return bus selection.
* **Interactive Seat Map (`SeatLayout`):** Visual seat layout showing occupied, available, and held seats with dynamic real-time price tallying.
* **National Fleet Explorer (`FleetExplorerModal`):** Direct catalog view to explore all transit operators, fleet specifications, and highway corridors.
* **Interactive Route Paths (`RouteMapModal`):** Modal breakdown displaying intermediate halts, travel stages, and corridor geography.
* **Automated Fare Calculation:** Dynamic pricing based on travel distance, bus type (Luxury AC, Semi-Luxury, VIP), and optional promo discount vouchers.

#### 🎫 Operations, Verification & Security
* **Ticket Verification Engine (`CheckTicketModal`):** Instant passenger-side ticket status verification using unique booking reference codes.
* **Digital Conductor Scanner (`ConductorScannerModal`):** Quick-pass boarding QR and ticket validation interface for bus crews.
* **Role-Based Admin Portal (`AdminDashboard` & `AdminAuthModal`):** Secured dashboard for fleet operators to manage buses, schedules, routes, and seat allocations.
* **Passenger Safety SOS Hub (`SosModal`):** Rapid-access modal providing emergency dispatch numbers and route helpline assistance.
* **Social Proof & Passenger Reviews (`ReviewModal`):** Built-in rating and feedback system for individual fleet operators and service quality.

#### ⚡ Modern UI/UX & Real-Time Engineering
* **Glassmorphic Cyber-Dark UI:** Built with Tailwind CSS, sleek emerald accents, smooth modal transitions, and responsive mobile-first views.
* **Live Network Telemetry (`LiveDateTime`):** Synchronized live date/time widget matching local transit operating schedules.
* **Real-Time Synchronisation Ready:** Integrated WebSocket client (`services/websocket.js`) architecture designed to push live seat-state and schedule updates across active sessions.
* **Multilingual Localization:** Ready for internationalization powered by `react-i18next`.
* **Zero-Downtime Standalone Demo Engine:** Built-in intelligent mock fallback ensuring recruiters and visitors experience 100% feature parity even during backend offline states.
---

### 🛠️ Tech Stack
* **Frontend:** React 18, Vite, Tailwind CSS, Lucide Icons, i18next
* **Backend Architecture:** Spring Boot, REST APIs, WebSocket Telemetry
* **Database Engine:** MySQL / Serverless TiDB
* **Deployment:** Vercel
---

### Contact Us: thenula2002@gmail.com

Designed & Developed by Thenula Rathnayake (Software Engineer| Full-Stack Developer)
