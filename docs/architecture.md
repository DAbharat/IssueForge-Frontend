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
├── accounts.service.ts                 # User/account related calls
├── workspaces.service.ts               # Workspace related calls
├── projects.service.ts                 # Project related calls
├── issues.service.ts                   # Issue related calls
├── comments.service.ts                 # Comment related calls
├── labels.service.ts                   # Label related calls
├── workspace_members.service.ts        # Workspace member related calls
├── project_members.service.ts          # Project member related calls
└── activities.service.ts               # Activity related calls
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
