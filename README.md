# IssueForge Frontend

A modern, high-density, developer-first web application for project management and issue tracking. Built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, and **TypeScript**, IssueForge delivers a distraction-free, keyboard-friendly workspace designed for engineering teams.

---

## Overview

The IssueForge frontend provides a dark-mode-first interface prioritizing information density, rapid navigation, and visual clarity. It implements a strict architectural separation between server-side routing, service-layer communication, state hooks, and presentational components, adhering to a cohesive design system without visual clutter.

---

## Technology Stack

- **Framework**: [Next.js 16.2.12](https://nextjs.org/) (App Router, Server & Client Components)
- **UI Library**: [React 19.2.4](https://react.dev/) & React DOM
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/postcss` and `tw-animate-css`
- **UI Primitives**: [shadcn/ui](https://ui.shadcn.com/) backed by `@base-ui/react` and Radix foundations
- **Icons**: [Lucide React](https://lucide.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/) with automated bearer injection and 401 token refresh interceptors
- **Media Tools**: [react-image-crop](https://github.com/DominicTobias/react-image-crop) for interactive avatar adjustments
- **Language**: [TypeScript 5](https://www.typescriptlang.org/) (Strict Mode)

---

## Key Features & Application Views

### 1. Modern SaaS Landing Page (`/`)
- **Marketing Navigation**: Fixed, backdrop-blurred header with mathematical center alignment for section links (`Features`, `How it works`, `Product`) and auth entry points.
- **Scroll-Aware Header Transitions**: Header automatically fades out and slides up on scroll down, and smoothly fades back in on scroll up.
- **Hero Showcase**: Release announcement pill, bold typography, dual call-to-actions, and key capability highlights.
- **Interactive Product Preview**: Realistic interactive mockup featuring a live-toggling Kanban board (To Do, In Progress, Completed columns with search filtering) and an Overview analytics tab with project counters and recent audit trails.
- **6-Column Bento Grid**: Live mini-UIs demonstrating issue tracking, workspace hierarchy, audit activity streams, granular roles, project-scoped labels, and safe archive/restore.
- **Bidirectional Scroll Animations**: `ScrollFade` wrapper using `IntersectionObserver` to smoothly animate sections and cards as they enter and leave the viewport.
- **Verified Footer**: Minimal brand footer with verified links and copyright.

### 2. Authentication Suite (`/(auth)`)
- **Login (`/login`) & Register (`/register`)**: Unified dark split-panel layouts featuring custom brand artwork (`Issueforgeimg.png`), form validation, password visibility toggles, and Google OAuth action buttons.
- **Cookie & LocalStorage Synchronization**: Tokens are simultaneously synchronized across `localStorage` and `document.cookie` (`SameSite=Lax`) to enable instant server-side route evaluation in Next.js middleware.

### 3. Application Shell & Navigation
- **Isolated Public Layout**: Landing and authentication pages render completely standalone without dashboard navigation shells.
- **Authenticated Dashboard Shell (`AppShell`)**:
  - Collapsible left sidebar (`AppSidebar`) with tree navigation for workspaces, projects, invites, and archive.
  - Top header (`Navbar`) with active workspace switcher, real-time user search dialog, member invitation trigger, and user profile card.
  - Full mobile responsiveness with sliding drawer navigation.

### 4. Workspace Management (`/workspace`)
- Multi-workspace switching and creation.
- General workspace configuration and name renaming modals.
- Team member invitations with role assignment (`Owner`, `Admin`, `Member`).
- Pending workspace invitations list with instant revocation controls.

### 5. Project Hub & Kanban Tracking (`/projects/[projectId]`)
- **Project Overview**: High-level milestone metrics (`Total issues`, `To do`, `In progress`, `Completed`) and recently updated tasks.
- **High-Density Kanban Board**: Three-column workflow (`Todo`, `In Progress`, `Done`) with priority color badges (`Low`, `Medium`, `High`, `Urgent`), project labels, search filtering, and sorting.
- **Issue Modal & Detail View**: Rich issue management including title, markdown description, assignee assignment, priority updates, status transitions, and target due dates.
- **Threaded Discussions**: Add, edit, and delete issue comments.
- **Audit Activity Trail**: Chronological event logs recording state shifts and assignee reallocations.
- **Project Members**: View and manage project-specific contributors.
- **Project Settings**: Edit project metadata and initiate project archiving.

### 6. Profile & Account Settings (`/profile`)
- User details view displaying username, email, and joined organizations.
- Interactive avatar upload with integrated client-side cropping modal.

### 7. Archive & Recovery Hub (`/archive`)
- Dedicated interface for viewing soft-deleted workspaces and projects.
- One-click restoration workflow that non-destructively recovers archived items.

---

## Frontend Architecture

The codebase enforces a strict separation of concerns following a unidirectional data flow:

```text
API Contract / Axios Client
            ↓
      Service Layer
            ↓
     Hooks / State Layer
            ↓
    Page / Container Layer
            ↓
  Dumb / Presentational Components
            ↓
         shadcn/ui
```

### Layer Responsibilities

1. **Services (`services/`)**:
   - Single source of truth for external HTTP communication.
   - Construct URLs, send payloads, parse responses, and handle token attachments.
   - Components and pages **never** call `fetch()` or `axios` directly.

2. **Hooks & State (`hooks/`)**:
   - Encapsulate data fetching, loading flags, error handling, mutations, and local cache updates.
   - Examples: `useAuth`, `useWorkspaces`, `useWorkspaceSwitcher`.

3. **Pages & Containers (`app/` and feature containers)**:
   - Coordinate hooks, manage view-level state, and pass data down to presentation components.
   - Decide whether to render loading skeletons, empty states, error banners, or content.

4. **Presentational Components (`features/`, `components/`)**:
   - Dumb/pure components whose sole responsibility is rendering UI based on `props`.
   - Emit user interactions back up via callback props.
   - Contain zero backend or data-fetching logic.

5. **UI Primitives (`components/ui/`)**:
   - Strictly reserved for shadcn/ui components (`Button`, `Dialog`, `Input`, `DropdownMenu`, etc.).
   - No application-specific components are placed here.

---

## Design System

IssueForge follows a technical, pitch-black, productivity-centric visual identity detailed in `docs/design-system.md`:

| Token | Hex Value | Usage |
| :--- | :--- | :--- |
| **App Canvas** | `#000000` | Main canvas, pitch-black backgrounds |
| **Elevated Surface** | `#18181B` / `#101012` | Cards, panels, sidebars, kanban columns, modals |
| **Subtle Border** | `#27272A` | 1px hairline structural dividers and outlines |
| **Primary Text** | `#E2E8F0` | Headings, titles, primary labels |
| **Secondary Text** | `#94A3B8` | Metadata, timestamps, breadcrumbs, descriptions |
| **Primary Accent** | `#DDE1E5` | Active indicators, focus rings, selected badges |

### Core Design Rules
- **No Purple or Indigo**: Purple and indigo shades are strictly prohibited throughout the application.
- **High-Contrast Accent Rule**: Whenever `#DDE1E5` is used as a button background or fill, the foreground text must be black (`text-black`).
- **Gradients Policy**: Real application screens use flat, solid surfaces. Subtle neutral dark gradients are permitted exclusively on public marketing sections for depth.
- **Hairline Borders Over Heavy Shadows**: Structural hierarchy is established through 1px borders (`#27272A`) and spacing rather than heavy shadows or glows.

---

## Route Guarding & Security Middleware

Client-side route protection is powered by Next.js 16's root **Proxy convention** (`proxy.ts`):

- **Public Routes**: `/`, `/login`, `/register`, and auth endpoints (`/api/login`, `/api/register`, `/api/auth/refresh`).
- **Unauthenticated Access**: Any request to protected routes (`/workspace`, `/profile`, `/archive`, `/projects/...`) automatically redirects to `/login`.
- **Authenticated Access**: Authenticated sessions attempting to access `/login` or `/register` are redirected to `/profile`.
- **JWT Verification (`lib/auth.ts`)**: Decodes base64url payloads to inspect `exp` expiration timestamps and extract `userId` before setting downstream request headers (`x-user-id`).
- **Axios Interceptor (`lib/axiosClient.ts`)**:
  - Automatically attaches the `Authorization: Bearer <token>` header to all outgoing requests.
  - Intercepts `401 Unauthorized` responses to execute silent refresh token rotation, queuing concurrent requests and retrying upon token renewal.

---

## Directory Structure

```text
issueforge-frontend/
├── app/                              # Next.js App Router routes & layouts
│   ├── (auth)/                       # Auth route group
│   │   ├── login/page.tsx            # Login screen
│   │   └── register/page.tsx         # Registration screen
│   ├── archive/page.tsx              # Soft-deleted items recovery view
│   ├── profile/page.tsx              # User profile & avatar crop view
│   ├── projects/page.tsx             # Project details, kanban & overview
│   ├── workspace/page.tsx            # Workspace details, settings & invites
│   ├── layout.tsx                    # Root layout with fonts & AppShell
│   ├── page.tsx                      # Root marketing landing page
│   └── globals.css                   # Tailwind v4 theme & CSS tokens
├── components/                       # Shared application components
│   ├── auth/                         # Login and registration form views
│   ├── layout/                       # AppShell, Navbar, WorkspaceSwitcher
│   ├── issues/                       # Issue details, creation, and status components
│   ├── projects/                     # Kanban board, overview cards, project tabs
│   ├── workspace/                    # Workspace details & invitation modals
│   ├── profile/                      # Profile cards and stats
│   ├── common/                       # ImageUploadWithCrop and shared utilities
│   └── ui/                           # Pure shadcn/ui primitives
├── features/                         # Feature-based domain modules
│   └── landing/                      # Landing page module
│       ├── types.ts                  # Landing page data contracts
│       ├── constants.ts              # Static copy, preview data, bento items
│       └── components/               # Header, Hero, Preview, Bento, Workflow, CTA, Footer
├── hooks/                            # Custom React hooks (useAuth, useWorkspaceSwitcher, etc.)
├── services/                         # API client services (workspaces, projects, issues, etc.)
├── lib/                              # Infrastructure utilities
│   ├── auth.ts                       # JWT payload decoding & expiration validation
│   ├── axiosClient.ts                # Configured Axios instance with refresh interceptor
│   └── utils.ts                      # Tailwind clsx/cn helper
├── types/                            # Global TypeScript declarations
├── public/                           # Static image assets and icons
├── docs/                             # Frontend documentation
│   ├── api-contract.md               # API interface specifications
│   ├── architecture.md               # Code organization and component rules
│   └── design-system.md              # Visual language and color guidelines
├── proxy.ts                          # Next.js 16 root route protection middleware
├── tsconfig.json                     # TypeScript compiler configuration
└── package.json                      # Project dependencies and run scripts
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20.x or higher recommended)
- `npm`, `pnpm`, or `yarn`

### Installation

1. Clone the frontend repository:
   ```bash
   git clone https://github.com/DAbharat/IssueForge-Frontend.git
   cd IssueForge-Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Configuration

Create a `.env` or `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Development Server

Start the local Next.js development server:

```bash
npm run dev
```

The application will be running at [http://localhost:4000](http://localhost:4000).

---

## Build & Quality Commands

- **Type Check**: Validate TypeScript types across the entire project without emitting build artifacts:
  ```bash
  node ./node_modules/typescript/bin/tsc --noEmit
  ```
- **Lint**: Run ESLint to enforce code style:
  ```bash
  npm run lint
  ```
- **Production Build**: Generate an optimized production build:
  ```bash
  npm run build
  ```
- **Production Server**: Serve the production build locally on port 4000:
  ```bash
  npm run start
  ```

---

## License

This project is part of the IssueForge application suite. All rights reserved.
