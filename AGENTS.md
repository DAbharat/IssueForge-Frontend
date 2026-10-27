<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Code Making Flow

All frontend features must follow a clear separation between **backend communication, application state, page-level coordination, and presentation**.

The default architecture for features that use backend data is:

```text
API Contract
     ↓
Service
     ↓
Hook / State
     ↓
Page / Container
     ↓
Dumb Components
```

This flow applies to **all frontend features**, not just authentication or profile-related features.

The goal is to prevent API calls, business logic, state management, and presentation from being mixed together.

---

## 1. API Contract

Before implementing any feature that communicates with the backend, check `api-contract.md`.

The API contract is the source of truth for:

* Endpoints
* HTTP methods
* Path parameters
* Query parameters
* Request bodies
* Response structures
* Authentication requirements
* Expected backend behavior

Do not invent:

* API endpoints
* Request fields
* Response fields
* Query parameters
* Backend behavior
* Domain data structures

If the required endpoint exists in `api-contract.md`, implement the frontend against that contract.

If the required endpoint does not exist, do not create a fake endpoint or silently use mock data.

Identify the missing backend/API dependency instead.

---

## 2. Service Layer

All communication with the backend must happen through the appropriate service in:

```text
services/
```

Services are responsible for:

* Making API requests
* Constructing request URLs
* Sending request bodies
* Attaching authentication where required
* Parsing API responses
* Returning backend data
* Exposing backend operations to the rest of the frontend

Example:

```text
services/
├── accounts.service.ts
├── workspaces.service.ts
├── projects.service.ts
├── issues.service.ts
├── comments.service.ts
├── labels.service.ts
├── workspace_members.service.ts
├── project_members.service.ts
└── activities.service.ts
```

Components must never directly call:

```text
fetch()
axios()
API clients
```

Do not put backend API calls inside:

* Components
* Pages
* Layout components
* UI components
* Utility functions

If the required API operation does not already exist in a service, add it to the appropriate existing service.

Do not create a new service if an existing service already owns that domain.

---

## 3. Hooks / State Layer

Hooks connect services and application state to React components.

Use hooks when a feature requires:

* Fetching backend data
* Mutations
* Loading state
* Error state
* Refetching
* Derived application state
* Feature-specific client state
* Managing asynchronous operations

Examples:

```text
hooks/
├── use-auth.ts
├── use-workspaces.ts
├── use-projects.ts
├── use-issues.ts
└── ...
```

A hook may call a service.

For example:

```text
useIssues()
     ↓
issues.service.ts
     ↓
GET /api/projects/{projectID}/issues
```

The component should consume the hook rather than independently implementing the data-fetching logic.

### Important

Do not create a hook unnecessarily.

A purely presentational component or a simple local interaction does not need a service or hook.

For example:

```text
Button click
     ↓
local component state
```

does not need:

```text
Service → Hook
```

The architecture should be applied where the responsibility actually exists, not mechanically.

---

## 4. Page / Container Layer

Pages and container components coordinate the feature.

They are responsible for connecting application data and actions to presentation components.

They may:

* Consume hooks
* Manage feature-level state
* Handle user interactions
* Pass data to components
* Pass callbacks to components
* Coordinate multiple components
* Handle loading states
* Handle error states
* Handle empty states
* Decide which components should be rendered

For example:

```tsx
const { issues, isLoading, error } = useIssues(projectId)

return (
    <IssueList
        issues={issues}
        isLoading={isLoading}
        error={error}
    />
)
```

Pages/containers should not become giant components containing all of the application's UI.

If a section of the page can be represented as a meaningful reusable component, extract it.

---

## 5. Dumb / Presentational Components

Components should be **dumb/presentational by default**.

Their primary responsibility is to determine:

> How should the provided data be displayed?

They should receive the data and callbacks they need through props.

Example:

```tsx
type IssueListProps = {
    issues: Issue[]
    onIssueSelect: (issueId: number) => void
}

export function IssueList({
    issues,
    onIssueSelect,
}: IssueListProps) {
    return (
        <div>
            {issues.map((issue) => (
                <button
                    key={issue.id}
                    onClick={() => onIssueSelect(issue.id)}
                >
                    {issue.title}
                </button>
            ))}
        </div>
    )
}
```

The component displays the data it receives.

It does not determine where that data came from.

---

## 6. Components Must Not Contain Backend Logic

Components must not:

* Call backend APIs
* Call `fetch`
* Call `axios`
* Import services
* Fetch data
* Manage API requests
* Read API responses directly
* Read authentication state directly
* Read feature data from localStorage
* Implement backend/business rules

Bad:

```tsx
function IssueList() {
    const [issues, setIssues] = useState([])

    useEffect(() => {
        fetch("/api/projects/1/issues")
            .then(...)
    }, [])

    ...
}
```

Correct:

```text
IssueList
    ↑
Page / Container
    ↑
useIssues()
    ↑
issues.service.ts
    ↑
API
```

---

## 7. Business Logic

Business logic should not be hidden inside presentational components.

Business rules should live in the appropriate application layer.

For example, if a feature needs to determine whether a user can perform an action, do not bury that logic inside a button component.

Instead:

```text
API / application state
        ↓
Hook / container
        ↓
Determine available action
        ↓
Component receives what it needs
```

The component should primarily handle presentation and user interaction.

---

## 8. Real Data Over Mock Data

Production frontend features must use real backend data whenever the corresponding API exists.

Do not create fake production data such as:

```tsx
const user = {
    fullname: "John Doe",
    username: "johndoe",
}
```

or:

```tsx
const issues = [
    {
        id: 1,
        title: "Fix login",
        status: "open",
    },
]
```

when the backend endpoint is available.

Do not use hardcoded values to make a feature appear functional.

If the backend provides the data, connect the feature to the backend.

---

## 9. Mock Data Policy

Mock data may only be used when explicitly requested for:

* UI prototyping
* Design exploration
* Storybook
* Tests
* Temporary isolated development

Mock data must be clearly separated from production data flow.

Do not silently introduce mock data because implementing the real API integration is inconvenient.

If the required API is missing, report the missing API dependency instead.

---

## 10. Existing Code Must Be Inspected First

Before creating any new:

* Service
* Hook
* Component
* Utility
* Type
* API function
* Layout component

inspect the existing codebase first.

Determine whether an equivalent already exists.

Prefer:

```text
Reuse existing code
        ↓
Extend existing code
        ↓
Create new code only when necessary
```

Do not create duplicate implementations with slightly different names.

For example, do not create:

```text
useUser.ts
useProfile.ts
useCurrentUser.ts
```

if they are all attempting to solve the same problem.

Determine the existing responsibility and extend/reuse it.

---

## 11. Feature-Based Organization

Domain-specific code should remain inside its feature where appropriate.

For example:

```text
features/
├── auth/
│   ├── components/
│   ├── hooks/
│   └── ...
│
├── issues/
│   ├── components/
│   ├── hooks/
│   └── ...
│
├── projects/
│   ├── components/
│   ├── hooks/
│   └── ...
│
└── workspaces/
    ├── components/
    ├── hooks/
    └── ...
```

Shared infrastructure should remain outside individual features.

For example:

```text
services/
hooks/
lib/
types/
components/layout/
components/ui/
```

Use judgment rather than duplicating shared code inside every feature.

---

## 12. UI Components

`components/ui/` is reserved for **shadcn/ui components**.

Do not place manually created application-specific components inside:

```text
components/ui/
```

For example, do not put:

```text
components/ui/ProfileHeader.tsx
components/ui/IssueCard.tsx
components/ui/ProjectHeader.tsx
```

Instead, place feature-specific components in their respective feature:

```text
features/profile/components/ProfileHeader.tsx
features/issues/components/IssueCard.tsx
features/projects/components/ProjectHeader.tsx
```

Shared application-level components may live in the appropriate shared component directory.

---

## 13. Standard Feature Flow

When implementing a feature involving backend data, follow this process:

### Step 1 — Understand the requirement

Determine what the feature needs to display or modify.

### Step 2 — Check `api-contract.md`

Identify the exact backend endpoints involved.

### Step 3 — Inspect existing services

Determine whether the required API operation already exists.

### Step 4 — Create or extend the service

If necessary, add the API operation to the appropriate service.

### Step 5 — Create or extend the hook/state layer

Connect the service to React state where appropriate.

### Step 6 — Implement the page/container

Use the hook/state layer and coordinate the feature.

### Step 7 — Implement presentation components

Create dumb components that receive their data and callbacks through props.

### Step 8 — Connect everything

The final flow should look like:

```text
Backend API
    ↓
Service
    ↓
Hook / State
    ↓
Page / Container
    ↓
Presentational Components
    ↓
UI primitives
```

---

## 14. Loading, Error, and Empty States

Backend-connected features must account for the full request lifecycle.

At minimum, consider:

```text
Loading
   ↓
Success
   ↓
Empty
```

and:

```text
Loading
   ↓
Error
```

Do not only implement the successful state.

The page/container or appropriate state layer should determine the state, while components should present that state.

---

## 15. No Guessing

Never guess how the backend works.

Use the following sources of truth, in order:

1. `api-contract.md`
2. Existing service implementations
3. Existing types
4. Existing hooks/state
5. Existing frontend usage

If the information is still insufficient, ask for clarification.

Do not silently invent:

* API behavior
* Data
* Fields
* Routes
* Business rules
* Authentication behavior
* Backend responses

---

## 16. Responsibility Summary

Use this mental model when writing code:

```text
API Contract
→ What does the backend provide?

Services
→ How do we communicate with the backend?

Hooks / State
→ How do we obtain and manage the data in React?

Pages / Containers
→ How does this feature coordinate its data, actions, and UI?

Components
→ How should the data be displayed and what user interactions should be emitted?

UI primitives
→ How are common visual elements implemented?
```

### The core rule

**Data flows down. Events flow up.**

```text
                    DATA
                     ↓
API → Service → Hook → Page → Component
                                  │
                                  │ user interaction
                                  ↓
                              Callback
                                  │
                                  ↑
                         Page / Hook / Service
```

Keep these responsibilities separate.

Do not solve a problem in a lower-level component when it belongs to a higher-level layer.

---

## 17. Authentication & Google OIDC Handoff Flow

When working on authentication, OAuth, or session management:

1. **Google OIDC Initiation**: Always initiate via `getGoogleOAuthUrl()` from `account.service.ts` (`GET /api/auth/google`), keeping button components dumb.
2. **Handoff Exchange**: The backend completes Google token verification and redirects the browser to `/auth/callback?code=<handoffCode>`. The frontend must exchange this one-time code via `exchangeHandoff(code)` (`POST /api/auth/exchange`).
3. **Single-Execution Guard**: Handoff codes in Redis are single-use (`DEL` on consumption). Always guard the exchange effect against double-invocation (e.g. via `useRef`) to avoid false-positive failure states during React Strict Mode or component re-renders.
4. **Token Storage**: Store access & refresh tokens via `useAuth().setAuthTokens()`. Do not manually parse, tamper with, or expose raw tokens in URL parameters.

