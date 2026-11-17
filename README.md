# S4DS MITAOE — Official Web Platform & TECHNEX 2K26 Portal

[![Next.js](https://img.shields.io/badge/Next.js-16.4.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.1-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![RushDB](https://img.shields.io/badge/Database-RushDB-FF5722?style=for-the-badge)](https://rushdb.com/)
[![Cloudinary](https://img.shields.io/badge/Media-Cloudinary-3448C5?style=for-the-badge&logo=cloudinary)](https://cloudinary.com/)
[![Audit Status](https://img.shields.io/badge/Audit-62%2F62%20Tests%20Passed-emerald?style=for-the-badge)]()

Official website and event management platform for the **Society for Data Science (S4DS) Student Chapter** at **MIT Academy of Engineering (MITAOE), Alandi, Pune**.

The platform powers public chapter outreach, student membership onboarding, media asset management, and the flagship annual technical project exhibition **TECHNEX 2K26**.

---

## 🌟 Key Features

### 🚀 Public Chapter Portal
- **Modern Cyber-Dark Theme**: Clean aesthetic with deep onyx backgrounds, warm crimson/gold accents, and fluid glassmorphic UI.
- **Flagship Event — TECHNEX 2K26**:
  - Live registration workflow for multi-member student teams across technical domains (AI/ML, Data Science, Web3, IoT & Robotics, Cloud/DevOps).
  - Dynamic fee calculation (S4DS Members ₹49 vs. Non-Members ₹99) with server-side validation.
  - Interactive dynamic UPI QR code generator (`upi://pay`) and payment verification.
  - Immediate registration confirmation code (`TNX-2026-XXX`) with downloadable digital participant badges.
- **Student Membership Portal**: Digital application process with instant PRN deduplication and proof-of-payment capture.
- **Events & Hackathons**: Interactive timeline of upcoming workshops, guest lectures, bootcamps, and hackathons.
- **Portfolio & Gallery**: Showcase of student innovations, project abstracts, and high-resolution event media.
- **Team Roster**: Directory of faculty advisors, core committee members, and domain heads.

### 🛡️ Admin Dashboard (`/admin`)
- **Secure JWT Authentication**: Role-based access control with hashed password protection (`bcryptjs` & `jsonwebtoken`).
- **TECHNEX Command Center (`/admin/technex`)**:
  - Global event controls (toggle registrations on/off, edit fees, update UPI IDs, set event dates).
  - Dynamic QR management with live preview.
- **Registration & Application Manager (`/admin/registrations`)**:
  - Tabbed interface for TECHNEX team entries and student membership applications.
  - Fast search by Team Name, Leader Name, PRN, Email, UTR, or Registration Code.
  - Department and Academic Year filters with ascending/descending date sorting.
  - **Full-Screen Payment Proof Viewer**: Interactive zoom-in/zoom-out modal for fast verification of UPI screenshots.
  - One-click status updates (`Approved`, `Shortlisted`, `Finalist`, `Rejected`).
  - Single-click record deletion with confirmation prompts and database synchronization.
  - One-click CSV export with complete registration coordinates.
- **Centralized Media Manager (`/admin/media`)**:
  - Direct file uploads with automatic asset tagging, categorization, and dimension detection.
  - Active payment QR switcher with single-click activation.
- **Content Management**: Full CRUD modules for Events, Projects, Gallery, and Team Members.

---

## 🏗️ Architecture & Tech Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend Framework** | **Next.js 16.4.6 (App Router)** | React 19, Turbopack, Server & Client Components |
| **Styling** | **Tailwind CSS 3.4.17** | Custom dark theme, glassmorphic navigation, responsive layouts |
| **Primary Database** | **RushDB** | Schema-first knowledge graph & hybrid cloud record store |
| **Fallback Database** | **Local Persistent Store** | Resilient `src/data/db.json` fallback with memory caching |
| **Asset & Image Hosting**| **Cloudinary** | Automatic subfolder routing, responsive transformations |
| **Authentication** | **JWT & Bcrypt** | Secure admin session management |
| **Icons** | **Lucide React** | Consistent, modern vector iconography |
| **Analytics** | **Firebase SDK** | Client-side Google Analytics integration |

---

## 📁 Cloudinary Media Structure

All media uploaded through the platform is automatically organized into hierarchical subfolders inside the root `S4DS` folder:

```
Cloudinary Media Library
└── S4DS/
    ├── payment-screenshots/  # Uploaded student UPI receipts & payment slips
    ├── payment-qr/           # Official chapter payment QR code assets
    ├── events/               # Event banners, posters, and flyers
    ├── gallery/              # Campus event photography and workshop photos
    ├── team/                 # Core team and faculty profile portraits
    ├── projects/             # Student project screenshots and diagrams
    ├── banners/              # Hero sliders and announcement graphics
    ├── logos/                # Chapter identity and sponsor logos
    └── documents/            # Event rules, problem statements, and guides
```

---

## 💾 Database & Data Model

The application interfaces with **RushDB** using strict schema discovery rules:

- **`TECHNEX_REGISTRATION`**: Team name, project title, domain track, leader details (name, email, phone, PRN, college, department, year, division), member array, membership category, fee paid, UPI/UTR ID, Cloudinary payment screenshot URL, and status.
- **`MEMBERSHIP`**: Student applicant details, PRN, academic year, department, payment receipt URL, and status.
- **`EVENT`**: Title, date, time, venue, category, description, registration link, poster URL.
- **`TEAM_MEMBER`**: Name, role, domain, bio, image URL, social links, sort order.
- **`PROJECT`**: Title, category, abstract, technologies, github URL, live demo, banner image.
- **`GALLERY_ITEM`**: Title, event name, category, image URL, date.
- **`MEDIA_ITEM`**: Centralized media registry with Cloudinary public IDs, secure URLs, asset folders, and active flags.
- **`SETTINGS`**: Global chapter configuration, UPI credentials, TECHNEX toggles, and emergency banners.

*A transparent, dual-write caching layer ensures that even if RushDB is undergoing maintenance, all queries seamlessly fall back to local persistent storage (`src/data/db.json`) without downtime.*

---

## ⚙️ Environment Variables

Create a `.env` file in the project root based on `.env.example`:

```env
# Application Base URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# RushDB Configuration
# Option A - RushDB Cloud (Recommended):
RUSHDB_API_KEY=your_rushdb_cloud_api_key

# Option B - RushDB Local Standalone Engine:
RUSHDB_MODE=direct
RUSHDB_ENGINE_URL=http://127.0.0.1:3000
RUSHDB_ENGINE_TOKEN=local-token

# Cloudinary Media Storage
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Security & Admin Authentication
JWT_SECRET=your_super_secure_jwt_secret_key_change_in_production
ADMIN_NAME=S4DS MITAOE Administrator
ADMIN_EMAIL=admin@s4ds.org
ADMIN_PASSWORD=YourSecureAdminPassword123!

# Public Chapter Contact & Payment Details
NEXT_PUBLIC_CHAPTER_EMAIL=contact@s4ds.org
NEXT_PUBLIC_CHAPTER_PHONE=+91 020 3025 3500
NEXT_PUBLIC_UPI_ID=s4ds@upi

# Firebase Configuration (Analytics)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.18.0 or newer (v20+ recommended)
- **npm** or **pnpm** / **yarn**

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/kunal285/S4DS.git
cd S4DS
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Fill in your Cloudinary, RushDB, and Admin credentials in .env
```

### 3. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Verification

The project includes an end-to-end verification audit suite (`scripts/test-audit.js`) verifying 62 critical aspects including:
- Public and protected route availability
- Admin JWT authentication, token decoding, and access control
- Complete CRUD operations across Events, Team, Projects, and Gallery
- Full TECHNEX registration workflow (fee recalculation, duplicate PRN rejection, required field validation)
- Cloudinary folder structuring (`S4DS/<subfolder>`) and upload integrity
- RushDB schema enforcement and fallback reliability
- SEO compliance (`robots.txt`, `sitemap.xml`)

Run the audit suite against a running server:
```bash
npm test
```

Expected result:
```
==========================================================
  AUDIT RESULTS: 62 PASSED, 0 FAILED
==========================================================
```

---

## 📦 Production Build

To create an optimized production build:

```bash
npm run build
npm run start
```
---
## 🏛️ Project Directory Structure
```
S4ds/
├── public/                     # Static icons, logos, and public images
├── scripts/
│   └── test-audit.js           # 62-point automated verification suite
├── src/
│   ├── app/
│   │   ├── (public)/           # Public pages: /, /about, /events, /team, /gallery, /contact, /membership
│   │   ├── technex-2k26/       # Flagship TECHNEX 2K26 landing & registration form
│   │   ├── registration/       # Success confirmation badge page
│   │   ├── admin/              # Protected admin dashboard pages (registrations, media, technex, events, etc.)
│   │   └── api/                # Next.js Route Handlers (REST endpoints)
│   ├── components/             # Reusable UI widgets (Navbar, Footer, Toast, Modal, Skeleton, etc.)
│   ├── data/
│   │   └── db.json             # Local fallback database
│   └── lib/
│       ├── auth.js             # JWT verification & password hashing helpers
│       ├── cloudinary.js       # Cloudinary client with S4DS folder architecture
│       ├── db.js               # Unified DB abstraction layer (RushDB + local fallback)
│       ├── firebase.js         # Firebase App & Analytics initialization
│       └── rushdb.js           # RushDB SDK wrapper with schema caching
├── .env.example                # Sample environment variables
├── next.config.mjs             # Next.js configuration (remote image patterns, headers)
├── package.json
├── tailwind.config.js          # Custom theme tokens and colors
└── README.md                   # Project documentation
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License & Credits

Developed with ❤️ by the **S4DS MITAOE Technical Team**.  
All rights reserved © 2026 Society for Data Science, MIT Academy of Engineering.
