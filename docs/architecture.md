## Code Organization

Use **feature-based organization**.

Domain-specific components should live inside their respective feature. Keep the separation between **UI, business logic, state management, and API communication** clear.

### Components

Components should be **dumb/presentational components**.

They are responsible for:

* Rendering UI
* Receiving data through props
* Calling callback functions passed through props
* Handling simple UI-only interactions such as opening a dropdown, modal, tab, etc.

Components should **NOT** contain:

* Backend API calls
* Business logic
* Data fetching
* Complex data transformation
* Global state management
* Authorization logic
* Direct interaction with services

Keep components focused on **how the UI is displayed**, not **how the application works**.

Use the same internal structure for components throughout the application.

Example:

```text
features/
└── issues/
    └── components/
        ├── IssueList/
        │   ├── IssueList.tsx
        │   └── index.ts
        │
        ├── IssueCard/
        │   ├── IssueCard.tsx
        │   └── index.ts
        │
        └── IssueFilters/
            ├── IssueFilters.tsx
            └── index.ts
```

### `components/ui/`

**Do NOT place manually created application components inside `components/ui/`.**

`components/ui/` is reserved exclusively for **shadcn/ui components** downloaded or generated through shadcn.

For example:

```text
components/
└── ui/
    ├── button.tsx
    ├── dialog.tsx
    ├── input.tsx
    ├── dropdown-menu.tsx
    └── ...
```

Do not add components such as:

```text
IssueCard
ProjectCard
ProfileHeader
IssueList
WorkspaceSwitcher
```

to `components/ui/`.

Application-specific components must live inside their respective feature.

---

### Services

All **backend API calls** must be placed inside `services/`.

Services are responsible only for communicating with the backend API and handling API-specific concerns.

Example:

```text
services/
├── account.service.ts                  # User/account and auth calls (register, login, logout, me, search, Google OAuth)
├── workspaces.service.ts               # Workspace related calls
├── projects.service.ts                 # Project related calls
├── issues.service.ts                   # Issue related calls
├── comments.service.ts                 # Comment related calls
├── labels.service.ts                   # Label related calls
├── workspaceMembers.service.ts         # Workspace member related calls
├── projectMembers.service.ts           # Project member related calls
├── activities.service.ts               # Activity related calls
├── attachments.service.ts              # Issue & comment attachment calls
├── invitations.service.ts              # Workspace invitation calls
├── archive.service.ts                  # Archive & soft-delete restore calls
├── analytics.service.ts                # Workspace & Project activity analytics, charts, velocity
└── notifications.service.ts            # Notifications, unread counts, mark-as-read, delete
```

Do not make API requests directly from components.

Bad:

```tsx
const IssueList = () => {
    const response = await fetch("/api/issues");
    ...
};
```

Instead:

```text
Component
    ↓
Hook
    ↓
Service
    ↓
Backend API
```

For example:

```text
IssueList
    ↓
useIssues()
    ↓
issues.service.ts
    ↓
Go API
```

---

### Hooks

Hooks contain **reusable React logic and feature-related behavior**.

Hooks can be responsible for:

* Fetching and consuming server data through services
* Managing loading/error/success states
* Managing mutations
* Combining multiple pieces of state
* Reusable UI behavior
* Connecting components to application state

Hooks should NOT contain JSX/UI rendering.

Example:

```text
features/
└── issues/
    └── hooks/
        ├── useIssues.ts
        ├── useIssue.ts
        ├── useCreateIssue.ts
        └── useUpdateIssue.ts
```

A component should preferably consume a hook rather than directly calling a service.

```tsx
const IssueList = () => {
    const { issues, loading } = useIssues();

    return (...);
};
```

The hook communicates with the service:

```text
useIssues()
    ↓
issues.service.ts
    ↓
API
```

---

### State Management

Keep state as close as possible to where it is used.

Use **local component state** for temporary UI state.

Examples:

* Modal open/close
* Dropdown open/close
* Selected tab
* Input values
* Temporary filters

Use **feature/server state** for backend data.

Examples:

* Issues
* Projects
* Workspace members
* Comments
* Labels

Use **global state** only for state that genuinely needs to be shared across unrelated parts of the application.

Examples:

* Authenticated user
* Current workspace
* Application-wide preferences

Do not place all application state inside a single global store.

---

### Types

TypeScript types related to a specific domain should preferably live inside that feature.

Example:

```text
features/
└── issues/
    ├── components/
    ├── hooks/
    ├── types.ts
    └── ...
```

Shared types that are genuinely used across multiple features may be placed in the global `types/` directory.

Do not duplicate the same type definition across multiple files.

---

### Utils

`utils/` should contain **pure, reusable helper functions** that do not belong to a specific feature.

Examples:

* Date formatting
* String formatting
* Generic validation helpers
* Generic data transformation
* Utility functions used by multiple features

Feature-specific utilities should remain inside the relevant feature.

For example:

```text
features/issues/utils/
```

for issue-specific utilities.

Do not put business logic into generic utility files merely to avoid placing it in the correct feature.

---

### Pages / Routes

Pages should act primarily as **composition layers**.

A page should:

* Compose layouts
* Render feature components
* Connect the required feature hooks
* Handle route-level concerns

Pages should NOT become large files containing:

* API calls
* Complex business logic
* Large UI implementations
* Repeated components
* Feature-specific logic that belongs inside the feature

Prefer:

```text
Page
  ↓
Feature Hook
  ↓
Service
  ↓
Backend
```

and:

```text
Page
  ↓
Feature Components
  ↓
UI Components
```

---

### Separation of Responsibilities

The general flow should be:

```text
                    ┌──────────────┐
                    │     Page     │
                    └──────┬───────┘
                           │
             ┌─────────────┴─────────────┐
             ↓                           ↓
      Feature Components          Feature Hooks
             │                           │
             ↓                           ↓
       UI / Presentation             Services
                                         │
                                         ↓
                                   Backend API
```

Each layer should have a clear responsibility:

| Layer          | Responsibility                              |
| -------------- | ------------------------------------------- |
| **Pages**      | Compose the screen and route-level concerns |
| **Components** | Render UI and handle simple UI interactions |
| **Hooks**      | React/application behavior and state logic  |
| **Services**   | Backend API communication                   |
| **Stores**     | Shared client-side/global state             |
| **Types**      | TypeScript type definitions                 |
| **Utils**      | Generic pure helper functions               |
| **shadcn/ui**  | Base UI primitives                          |

### General Rule

When adding new functionality, **do not put everything into the component that needs it**.

First determine what type of logic it is:

```text
UI rendering              → Component
React/application logic   → Hook
Backend communication     → Service
Global client state       → Store
Feature-specific helper  → Feature utility
Generic helper            → Utils
Type definition           → Feature types / shared types
```

Always prefer **separation of responsibility, reuse, and consistency** over putting logic in the nearest file.

---

## Authentication & OAuth Architecture

IssueForge supports dual-mode authentication:
1. **Password Authentication**: Email and password credentials (`POST /api/register`, `POST /api/login`).
2. **Google OAuth 2.0 / OpenID Connect**: Federated sign-in and automated account linking using Google Identity Services (`GET /api/auth/google`, `GET /api/auth/google/callback`).

### 1. OAuth 2.0 / OIDC Handoff Exchange Architecture

IssueForge uses a secure **Redis Handoff Exchange** pattern for Google OIDC. Rather than passing sensitive access and refresh tokens directly in URL query parameters during browser redirects (which would leak into browser history, access logs, and referer headers), the backend issues a short-lived, single-use handoff code stored in Redis and exchanges it via a direct POST request.

```text
User                      Browser                         Backend API (Go)              Google Identity
 │                           │                                   │                             │
 │── Click "Google Sign In"─>│                                   │                             │
 │                           │── GET /api/auth/google ──────────>│                             │
 │                           │                                   │ Generates 32-byte CSRF state│
 │                           │                                   │ Sets google_oauth_state     │
 │                           │                                   │ (HttpOnly, SameSite=Lax)    │
 │                           │<── 302 Redirect ──────────────────│                             │
 │                           │                                   │                             │
 │                           │── Follow 302 redirect ─────────────────────────────────────────>│
 │                           │   (to accounts.google.com)        │                             │
 │── Authenticate & Consent ──────────────────────────────────────────────────────────────────>│
 │                           │<── 302 Redirect with code & state ──────────────────────────────│
 │                           │                                   │                             │
 │                           │── GET /api/auth/google/callback ─>│                             │
 │                           │   (Browser attaches state cookie) │                             │
 │                           │                                   │── POST /token (exchange) ──>│
 │                           │                                   │<── Returns tokens & IDToken─│
 │                           │                                   │                             │
 │                           │                                   │ Verifies ID Token (OIDC)    │
 │                           │                                   │ Resolves User in PostgreSQL │
 │                           │                                   │ Generates JWT Access Token  │
 │                           │                                   │ Stores Refresh Token (Redis)│
 │                           │                                   │                             │
 │                           │                                   │ CreateHandoff():            │
 │                           │                                   │ - Generates 32-byte code    │
 │                           │                                   │ - Saves tokens to Redis     │
 │                           │                                   │   (TTL: 60s, handoff:<code>)│
 │                           │<── 302 Found ─────────────────────│                             │
 │                           │    Location:                      │                             │
 │                           │    /auth/callback?code=HANDOFF    │                             │
 │                           │                                   │                             │
 │                           │── Next.js /auth/callback loads ───│                             │
 │                           │                                   │                             │
 │                           │── POST /api/auth/exchange ───────>│                             │
 │                           │   Body: { "code": HANDOFF }       │ Atomically consumes &       │
 │                           │                                   │ deletes handoff from Redis  │
 │                           │<── 200 OK ────────────────────────│                             │
 │                           │    { access_token, refresh_token }│                             │
 │                           │                                   │                             │
 │── Session Stored ────────>│ Passes to useAuth.setAuthTokens() │                             │
 │── Redirect to App ───────>│ Navigates to /profile             │                             │
```

### 2. Layered Responsibilities (Code Making Flow)

To maintain clean separation of concerns, the OAuth implementation strictly adheres to the frontend architecture:

```text
Presentational Component (Dumb)
       ↓ (Emits onClick event)
Page / Container Layer
       ↓ (Coordinates flow / handles handoff redirect)
Hook Layer (useAuth)
       ↓ (Manages tokens & session state)
Service Layer (account.service.ts)
       ↓
Backend API (Go)
```

#### Layer Breakdown:

1. **Presentational Components (`components/auth/login.tsx`, `components/auth/register.tsx`)**:
   - Render the Google brand button ("Sign in with Google" / "Sign up with Google") and UI layout.
   - **Must remain dumb**: No direct API calls, no token handling, no direct `window.location` manipulation.
   - Accept an `onGoogleSignIn` / `onGoogleSignUp` callback prop:
     ```tsx
     <Button type="button" onClick={onGoogleSignIn}>
       <GoogleIcon /> Sign in with Google
     </Button>
     ```

2. **Page / Container Layer (`app/auth/callback/page.tsx`, `app/(auth)/login/page.tsx`)**:
   - Coordinates the handoff exchange lifecycle.
   - Reads the one-time `code` query parameter delivered by the backend redirect.
   - Uses an execution ref guard (`useRef`) to strictly guarantee single execution (preventing React 18 Strict Mode or double re-renders from attempting to re-consume an already consumed Redis handoff code).
   - Calls `exchangeHandoff(code)` from `services/account.service.ts`.
   - On success, updates authentication state via `setAuthTokens()`, triggers a toast notification, and navigates the user to `/profile`.
   - On error, displays a styled error message and safely navigates back to `/login`.

3. **Hook / State Layer (`hooks/use-auth.ts`)**:
   - Stores session state (`accessToken`, `refreshToken`, `isAuthenticated`).
   - Syncs tokens to both `localStorage` and `document.cookie` (with appropriate `maxAge` and `SameSite=Lax`) to ensure compatibility with client-side requests and Next.js SSR / route middleware.
   - Exposes `setAuthTokens`, `clearAuthTokens`, and `loadTokens`.

4. **Service Layer (`services/account.service.ts`)**:
   - Encapsulates authentication backend interactions:
     - `getGoogleOAuthUrl()`: Returns the full backend entrypoint URL (`${API_BASE_URL}/api/auth/google`) for initiating the OAuth handshake.
     - `exchangeHandoff(code)`: Sends `POST /api/auth/exchange` with `{ code }` to retrieve `{ access_token, refresh_token }`.
     - `handleGoogleCallback(code, state)`: Retained as a fallback for non-handoff or direct authorization code workflows.

### 3. Backend Integration & Data Model Semantics

1. **Database Schema (`users.google_sub`)**:
   - Added via migration `000021_add_google_sub_to_users.up.sql`.
   - Has a partial unique index:
     ```sql
     CREATE UNIQUE INDEX users_google_sub_key
         ON users (google_sub)
         WHERE google_sub IS NOT NULL AND deleted_at IS NULL;
     ```
   - Protects against duplicate Google identity bindings across multiple user rows while ignoring soft-deleted records.

2. **Account Linking Rules**:
   - **Identity Match**: When a user logs in with Google, the backend first queries `users` by `google_sub`. If found, the session is created immediately.
   - **Automatic Account Linking**: If no record matches `google_sub`, the backend queries by verified email (`claims.Email`). If an existing email/password account matches, the backend links Google by running `BindGoogleSub(ctx, existingUser.ID, &claims.Sub)`. This allows existing users to seamlessly switch to Google Sign-In without creating duplicate accounts or losing project/workspace data.
   - **Auto-Provisioning New Users**: If neither `google_sub` nor `email` exists:
     - Automatically generates a unique username by sanitizing the email prefix (`base = email[0:at]`) and appending a unique hex suffix (`base_xxxxx`).
     - Uses Google profile `name` or `given_name + family_name` for `fullname`.
     - Assigns a placeholder password hash: `!oidc-no-password!`. Users who sign up via Google cannot log in with a password unless they explicitly configure one.
     - Creates the user via `CreateOIDCUser`.

3. **State Token & CSRF Security**:
   - The backend generates a 32-byte cryptographically secure pseudo-random state string (`crypto/rand`).
   - The state is stored in an HTTP-only, Secure, SameSite=Lax cookie:
     ```http
     Set-Cookie: google_oauth_state=<state>; Path=/api/auth/google; Max-Age=300; HttpOnly; Secure; SameSite=Lax
     ```
   - The callback endpoint (`/api/auth/google/callback`) verifies that the incoming `state` query parameter strictly equals the `google_oauth_state` cookie value before exchanging the authorization code, and deletes the cookie immediately.

4. **CORS & Credentials**:
   - Because OAuth state cookies and session credentials travel between the frontend and the Go API server, CORS configuration on the backend enforces:
     - `AllowCredentials: true`
     - Validated allowed origins (`http://localhost:3000`, `http://localhost:4000`, `https://issue-forge-frontend.vercel.app`, or `CORS_ALLOWED_ORIGINS`).

