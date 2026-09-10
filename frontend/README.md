# 🚌 TransitGo - Sri Lanka Smart Highway & Express Bus Reservation Platform

TransitGo is a full-stack, real-time national bus transit and seat booking system designed specifically for Sri Lankan expressways (E01, E03, E04) and long-distance intercity corridor networks (Colombo-Kandy, Jaffna Sleeper, Ella Scenic).

---

## 🌟 Key Architecture & Core Capabilities

* **Dynamic Intermediate Town Discovery & Stage Fares:** Automatic calculation of stage fares when boarding from intermediate corridor stops (e.g. Kadawatha, Kegalle, Dambulla).
* **High-Concurrency Real-Time Seat Hold Locks:** 10-minute pessimistic hold lock prevents double booking across simultaneous passengers with automatic background expiry cleanup.
* **Dual-Journey Bundled Round-Trip Checkout:** Seamless outbound and return bus selection with bundled 5% promotional discount.
* **Live GPS Bus Telemetry & Highway Simulation:** WebSocket STOMP broadcast tracking bus locations with Auto-Pilot steering along Sri Lankan highway waypoints.
* **Digital QR Ticketing & Mobile Conductor Scanner:** High-resolution dynamic QR pass validation with real-time check-in and luggage tags.
* **Interactive 3D-Secure Bank OTP Sandbox:** Realistic payment gateway experience with auto-fill test cards and SMS dispatch.
* **Operations Admin Console:** Complete fleet management, active passenger manifest, promo voucher creation, and live GPS simulator.
* **Multi-Lingual Localization:** Instant zero-reload switching between Sinhala and English (i18n).
* **Emergency SOS 1969 & Passenger Review System:** Direct expressway patrol quick dial and 5-star customer feedback ratings.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons, STOMP.js / SockJS, i18next, Axios |
| **Backend** | Spring Boot 3.4, Java 17/21, Spring Data JPA, Spring WebSocket (STOMP), Spring Security |
| **Database** | MySQL 8.0 / H2 In-Memory (Configurable) |
| **Build & Tooling** | Maven, Docker, ESLint, Git |

---

## 🚀 Quick Setup & Local Deployment

### 1. Backend (Spring Boot)
```bash
cd backend
./mvnw clean spring-boot:run