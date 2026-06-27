# Tournament Management System (TMS)

**Tournament Management System (TMS)** is an enterprise-grade Software as a Service (SaaS) platform designed to facilitate the comprehensive creation, management, and tracking of tournaments. Built with modern web technologies, this platform supports various sports and e-sports disciplines through a modular Tournament Engine. 

With a multi-tenant architecture, users can create Organizations, host Seasons, and execute up to 6 different competition algorithms (Round-Robin, Knock-out, Swiss System, Hybrid, Ladder, and League).

---

## 🚀 Features

- **Multi-Tenant Architecture**: Manage multiple organizations seamlessly under a single account.
- **Advanced Tournament Engine**: 
  - Supports 6 Competition Formats (Round-Robin, Knock-out, Swiss, Hybrid, Ladder, League).
  - Automated Bracket Generation & Progression.
  - Live Standings & Real-time Scoring.
- **Role-Based Access Control (RBAC)**: Secure isolation between Super Admins, Group Admins (Organizers), and Players.
- **Enterprise Security & Audit Trails**: Every critical action (e.g., score updates, bracket generation) is securely logged in the system for transparency and dispute resolution.
- **Performance Optimized**: Built with Next.js 15, Turbopack, and PostgreSQL, capable of handling thousands of concurrent users viewing live standings.
- **HCI-Driven UI/UX**: Elegant, simple, and accessible interface built with Tailwind CSS, Shadcn UI, and Lucide Icons.

---

## 🛠️ Tech Stack

This project is built using a modern, scalable, and type-safe ecosystem:

### Frontend
- **Framework:** [Next.js 15](https://nextjs.org/) (App Router, Server Actions, React 19)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **State Management:** Zustand (for client state)
- **Icons:** Lucide React

### Backend & Data
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** [Prisma](https://www.prisma.io/)
- **Authentication:** [Better Auth](https://better-auth.com/) (Email/Password & Social OAuth ready)
- **Caching & Rate Limiting:** Redis

### Infrastructure & Deployment
- **Containerization:** Docker & Docker Compose
- **Hosting / CI/CD:** Ready for VPS deployment via [Dokploy](https://dokploy.com/)

---

## 📦 Getting Started (Local Development)

Follow these steps to run the TMS platform on your local machine.

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18.17 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/) (Running locally or via Docker)
- [Redis](https://redis.io/) (Optional, required for rate limiting)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/tms-platform.git
   cd tms-platform
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   Copy the `.env.example` file to `.env` and configure your database variables:
   ```bash
   cp .env.example .env
   ```
   *Make sure to set the `DATABASE_URL` pointing to your PostgreSQL instance, and configure the `BETTER_AUTH_SECRET`.*

4. **Database Migration:**
   Run Prisma migrations to set up your database schema:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the application running.

---

## 🏗️ Project Structure

The codebase strictly adheres to modular architecture principles, making it highly scalable and maintainable.

```text
tms-platform/
├── prisma/                 # Database schema and migrations
├── public/                 # Static assets
├── src/
│   ├── app/                # Next.js App Router (Pages, Layouts, API Routes)
│   ├── components/         # Reusable UI components (Shadcn, Base Components)
│   ├── lib/                # Core utilities (Prisma client, Better Auth config, Rate Limiter)
│   ├── modules/            # Business Logic Modules (Tournament Engine, Audit, Organization)
│   └── server/             # Next.js Server Actions (Backend Controllers)
├── docs/                   # Extensive technical documentation (PRD, Architecture, API, etc.)
├── Dockerfile              # Production Docker image configuration
└── docker-compose.yml      # Local development / deployment orchestration
```

---

## 📚 Documentation

This project contains comprehensive enterprise-level documentation inside the `docs/` folder:

- [01 Product Requirements Document](docs/01_PRODUCT_REQUIREMENTS_DOCUMENT4.md) (SSOT)
- [02 System Architecture](docs/02_SYSTEM_ARCHITECTURE.md)
- [03 Database Design](docs/03_DATABASE_DESIGN.md)
- [04 API Specification](docs/04_API_SPECIFICATION.md)
- [05 UI/UX Guideline](docs/05_UI_UX_GUIDELINE.md)
- [06 AI Agent Context](docs/06_AGENT.md)
- [07 Development Roadmap](docs/07_DEVELOPMENT_ROADMAP.md)
- [08 Deployment Guide](docs/08_DEPLOYMENT.md)

---

## 🐳 Docker Deployment

The application is fully containerized and production-ready.

**To run the entire stack (App, PostgreSQL, Redis) locally using Docker Compose:**
```bash
docker-compose up -d --build
```
The app will be accessible at `http://localhost:3000`.

For detailed production deployment instructions (e.g., using Dokploy on a VPS), please refer to the [Deployment Guide](docs/08_DEPLOYMENT.md).

---

## 🛡️ Security & Performance

- **Rate Limiting**: Critical endpoints (like Tournament Creation and Bracket Generation) are protected by Redis-backed rate limiters to prevent abuse.
- **Audit Trails**: All modifications to tournament states and match scores are logged in the `AuditLog` table.
- **Authentication**: Stateless, secure sessions managed via Better Auth.
- **Data Integrity**: Enforced through strict Prisma Schema relations and Server Action validations using Zod.

---

## 🤝 Contributing

We welcome contributions! Please ensure you read the `08_CODING_STANDARD.md` before submitting a Pull Request.

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

This project is proprietary and confidential. Unauthorized copying, distribution, or modification of this software is strictly prohibited. 
*(Adjust this section according to your specific open-source or proprietary licensing).*
