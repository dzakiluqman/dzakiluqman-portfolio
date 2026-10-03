# Fullstack Portfolio Website with CMS Admin Dashboard

A fullstack portfolio website with a CMS Admin Dashboard built with **React**, **Vite**, **Tailwind CSS**, and **Supabase**.

---

## 🚀 Features

### 🌟 Public Portfolio (`/`)
- **Dynamic Hero Section**: Personal profile data (name, headline, bio, avatar, location, social links) retrieved directly from Supabase `profiles`.
- **Project Showcase**: Published projects filterable by categories with direct GitHub repository links, live demos, and tech stack tags.
- **Interactive CV**: Multi-tab curriculum vitae displaying work history, academic education, and professional certifications.
- **Dynamic Technical Skills**: Filtered and grouped by domain (Frontend, Backend, DevOps) with proficiency badges.
- **Real-time Contact Form**: Visitor inquiries inserted directly into the Supabase `messages` table with confirmation alerts.
- **Dedicated Project Detail Page (`/project/:slug`)**: Deep dive into system design, architecture, and technology breakdown.

### 🛡️ Admin CMS Dashboard (`/admin/dashboard`)
- **Protected Routes**: Protected by [AuthContext](file:///d:/GitHub/dzakiluqman/src/context/AuthContext.jsx) and Supabase authentication. Unauthenticated users are redirected to `/admin/login`.
- **Overview & KPI Analytics**: Real-time summary counts of projects, work experiences, skills, and unread inquiries.
- **Project Management (`/admin/projects`)**: Full CRUD (Create, Read, Update, Delete) with interactive modal, auto-slug generator, visibility switch, and featured project badges.
- **CV Management (`/admin/cv`)**: Comprehensive CRUD for Work Experience, Education degrees, and Technical competencies.
- **Message Inbox (`/admin/messages`)**: Read, filter (All / Unread / Read), toggle status, delete, and reply directly via email.

---

## 🛠️ Tech Stack

- **Frontend**: Vite + React 18 (JSX)
- **Styling**: Tailwind CSS (Dark / Minimalist theme with glassmorphism)
- **Routing**: `react-router-dom` (v6)
- **Icons & Animation**: `lucide-react`, `framer-motion`
- **Database & Auth**: Supabase (`@supabase/supabase-js`) with Row Level Security (RLS)

---

## 📁 Project Structure

```
src/
├── assets/
├── components/
│   ├── common/        # Navbar, Footer, ProtectedRoute, LoadingSpinner
│   ├── public/        # Hero, ProjectCard, ExperienceTimeline, SkillBadge, ContactForm
│   └── admin/         # Sidebar, AdminHeader, ProjectFormModal, ExperienceFormModal
├── context/
│   └── AuthContext.jsx # Manage Supabase Admin Auth state & demo fallback
├── lib/
│   ├── supabase.js    # Supabase Client initialization & environment variable check
│   └── mockData.js    # Fallback seed data for out-of-the-box demo preview
├── pages/
│   ├── public/        # Home.jsx, ProjectDetail.jsx
│   └── admin/         # Login.jsx, Dashboard.jsx, AdminProjects.jsx, AdminCV.jsx, AdminMessages.jsx
├── App.jsx            # Router setup
├── main.jsx
└── index.css          # Tailwind directives & design utilities
```

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your Supabase project credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

> **Note:** If you run without connecting Supabase, the app automatically runs in **Preview / Demo Mode**, loading sample portfolio data and enabling demo admin login with `admin@portfolio.dev` / `admin123`.

### 3. Setup Supabase Database
In your Supabase project dashboard, open the **SQL Editor** and execute the queries in [`supabase_schema.sql`](file:///d:/GitHub/dzakiluqman/supabase_schema.sql). This will automatically create:
- Tables: `profiles`, `projects`, `experiences`, `educations`, `skills`, `certifications`, `messages`
- Row-Level Security (RLS) policies for public reads and authenticated admin writes
- Initial seed data

### 4. Run Development Server
```bash
npm run dev
```
Visit `http://localhost:5173` to explore the public portfolio or `http://localhost:5173/admin/login` to access the CMS.
