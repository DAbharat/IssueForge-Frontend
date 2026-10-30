# API Contract

Base URL: http://localhost:8080

## General conventions

- All requests use JSON unless otherwise noted.
- Protected routes require the bearer token in the `Authorization` header.
- Successful responses are returned directly as JSON objects or arrays from the backend.
- Error responses generally look like:

```json
{
  "error": "invalid credentials"
}
```

- The backend does not use a standard `{ success, message, data }` envelope for successful responses; the DTO itself is returned directly.

---

## Authentication

### 1) POST /api/register
Auth required: No

Request body:

```json
{
  "fullname": "Jane Doe",
  "username": "janedoe",
  "email": "jane@example.com",
  "password": "StrongPassword123!"
}
```

Response (201 Created):

```json
{
  "id": 1,
  "username": "janedoe",
  "fullname": "Jane Doe",
  "email": "jane@example.com"
}
```

### 2) POST /api/login
Auth required: No

Request body:

```json
{
  "email": "jane@example.com",
  "password": "StrongPassword123!"
}
```

Response (200 OK):

```json
{
  "access_token": "eyJhbGciOi...",
  "refresh_token": "eyJhbGciOi...",
  "user": {
    "id": 1,
    "username": "janedoe",
    "fullname": "Jane Doe",
    "email": "jane@example.com",
    "workspaces": []
  }
}
```

### 3) POST /api/auth/refresh
Auth required: No

Request body:

```json
{
  "refresh_token": "eyJhbGciOi..."
}
```

Response (200 OK):

```json
{
  "accessToken": "new-access-token"
}
```

### 4) GET /api/me
Auth required: Yes

Headers:

```http
Authorization: Bearer <access_token>
```

Response (200 OK):

```json
{
  "id": 1,
  "username": "janedoe",
  "fullname": "Jane Doe",
  "email": "jane@example.com",
  "workspaces": [
    {
      "id": 12,
      "name": "Core Team",
      "role": "owner"
    }
  ]
}
```

### 4a) GET /api/auth/google
Auth required: No  
Rate limit: 3 requests / minute (`authRateLimit`)

Initiates the Google OAuth 2.0 / OpenID Connect authorization code flow.

Response (302 Found):
- Redirects the browser to Google's OAuth consent screen:
  `https://accounts.google.com/o/oauth2/v2/auth?client_id=...&redirect_uri=...&response_type=code&scope=openid+email+profile&state=...`
- Response Headers:
  - `Location`: Google consent screen URL
  - `Set-Cookie`: `google_oauth_state=<state>; Path=/api/auth/google; Max-Age=300; HttpOnly; Secure; SameSite=Lax`

Behavior & Details:
- The backend generates a cryptographically secure 32-byte base64-url encoded CSRF `state` parameter.
- Sets an HTTP-only, secure, SameSite=Lax cookie named `google_oauth_state` with path `/api/auth/google`, valid for 5 minutes (300 seconds).
- Scopes requested: `openid`, `email`, `profile`.

### 4b) GET /api/auth/google/callback
Auth required: No  
Rate limit: None

OAuth 2.0 callback endpoint invoked by Google after the user completes consent. Validates the CSRF state token against the `google_oauth_state` cookie, exchanges the authorization code with Google for tokens, verifies the OpenID Connect ID token, provisions or links the user account in PostgreSQL, generates a JWT access token and Redis refresh token, and returns the session payload or executes a secure handoff redirect.

Query params:
- `code` (string, required): The authorization code issued by Google.
- `state` (string, required): The CSRF state token issued by `/api/auth/google`. Must match the `google_oauth_state` cookie value.
- `error` (string, optional): Provider error code if the user canceled consent or Google encountered an error.

Cookies:
- `google_oauth_state` (required): Cookie set during the initiation step. Deleted upon callback processing (`Max-Age: -1`).  
  *Note: The cookie path is `/`, so the browser automatically supplies it when visiting `/api/auth/google/callback`.*

User Resolution & Account Linking:
1. **Existing Google User**: If a user record with a matching `google_sub` exists in the database, the backend authenticates the user directly.
2. **Account Linking**: If no user matches `google_sub`, but an active account with the Google verified email exists, the backend automatically links the account by binding `google_sub` to that user and authenticates them.
3. **Automatic User Provisioning**: If neither exists:
   - A unique username is generated from the email local part (sanitized to alphanumeric, `_`, `.`, bounded between 3 and 20 characters) appended with a random 5-hex character suffix (`base_xxxxx`).
   - `fullname` is extracted from Google claims `name` (or `given_name + family_name`, fallback to generated username).
   - Password hash is set to placeholder `!oidc-no-password!` (direct password login is disabled).
   - The user record is created in PostgreSQL with `google_sub`.
4. **Session Generation & Secure Handoff**:
   - Generates signed JWT access token (`JWTSecret`).
   - Generates crypto-random refresh token stored in Redis with configured TTL (`REFRESH_TOKEN_TTL`).
   - Retrieves user's workspace memberships.
   - **Browser Navigation Requests (`Sec-Fetch-Mode: navigate`)**:
     Instead of returning tokens directly in JSON or in URL parameters (which would leak into browser history and logs), the backend creates a cryptographically secure 32-byte base64url one-time **handoff code** stored in Redis with a 60-second TTL.
     The backend then returns a `302 Found` redirect to:
     `${FRONTEND_URL}/auth/callback?code={handoffCode}`
   - **Non-navigation / API clients**: Returns direct `200 OK` JSON with `LoginUserResponse`.

Response (302 Found for browser navigation):
- `Location`: `${FRONTEND_URL}/auth/callback?code=<handoffCode>`

Response (200 OK for direct API clients):

```json
{
  "access_token": "eyJhbGciOi...",
  "refresh_token": "eyJhbGciOi...",
  "user": {
    "id": 1,
    "username": "janedoe_4f92a",
    "fullname": "Jane Doe",
    "email": "jane@example.com",
    "workspaces": [
      {
        "id": 12,
        "name": "Core Team",
        "role": "owner"
      }
    ]
  }
}
```

Error responses:
- `400 Bad Request`:
  - `{"error": "invalid oauth state"}` (cookie missing, state missing, or state mismatch)
  - `{"error": "missing authorization code"}`
- `401 Unauthorized`:
  - `{"error": "google sign-in was not completed"}` (when `error` query param is present)
  - `{"error": "google sign-in failed"}` (token exchange failure, ID token verification failure, or unverified email)
  - `{"error": "invalid credentials"}`
- `403 Forbidden`:
  - `{"error": "forbidden"}`
- `409 Conflict`:
  - `{"error": "duplicate email"}` (email conflict during account creation)
  - `{"error": "duplicate username"}` (username collision during auto-generation)
  - `{"error": "google account is already linked"}` (Google account is bound to another user)
- `500 Internal Server Error`:
  - `{"error": "internal server error"}`

### 4c) POST /api/auth/exchange
Auth required: No  
Rate limit: None

Exchanges a temporary single-use Google OIDC handoff code stored in Redis for active JWT access and refresh tokens.

Request body:

```json
{
  "code": "4e73f8a09b...32_byte_base64url_string"
}
```

Behavior & Details:
- The backend looks up the key `handoff:<code>` in Redis using `HGetAll`.
- The code entry is **atomically consumed and deleted from Redis before returning** (`Consume`), preventing reuse and replay attacks.
- Handoff codes have a strict 60-second TTL.
- Enforces payload limit of 4096 bytes with unknown fields disallowed.
- Eliminates exposing tokens in URL parameters, browser history, or server access logs.

Response (200 OK):

```json
{
  "access_token": "eyJhbGciOi...",
  "refresh_token": "eyJhbGciOi..."
}
```

Error responses:
- `400 Bad Request`:
  - `{"error": "invalid or oversized request body"}`
  - `{"error": "request body must only contain a single json object"}`
  - `{"error": "invalid handoff code"}` (code empty, not found, expired, or already consumed)
- `500 Internal Server Error`:
  - `{"error": "internal server error"}`

### 4d) POST /api/users/logout
Auth required: Yes  
Rate limit: 3 requests / minute (`authRateLimit`)

Terminates the user's session and revokes the active refresh token from Redis.

Headers:
```http
Authorization: Bearer <access_token>
```

Request body:
```json
{
  "refresh_token": "eyJhbGciOi..."
}
```

Behavior & Details:
- The backend deletes the provided refresh token from the Redis token store.
- If `refresh_token` is empty or not found in Redis, the backend completes gracefully without returning an error.
- Enforces single JSON object payload with unknown fields disallowed (payload limit 1 MB).

Response (200 OK):
```json
{
  "message": "user logged out"
}
```

Error responses:
- `400 Bad Request`:
  - `{"error": "invalid or oversized request body"}`
  - `{"error": "request body must contain a single json object"}`
- `401 Unauthorized`:
  - `{"error": "unauthorized"}` (missing or invalid Bearer access token)

---

## User endpoints

### 5) GET /api/users/{userID}
Auth required: Yes

Path params:
- `userID` (number)

Response (200 OK):

```json
{
  "id": 1,
  "username": "janedoe",
  "fullname": "Jane Doe",
  "created_at": "2026-08-01T10:32:00Z",
  "updated_at": "2026-08-01T10:32:00Z"
}
```

### 6) GET /api/users/{username}
Auth required: Yes

Path params:
- `username` (string)

Response (200 OK): same shape as user response object.

### 7) GET /api/users/search?search=jan
Auth required: Yes

Query params:
- `search` (string, optional)

Response (200 OK):

```json
[
  {
    "id": 1,
    "username": "janedoe",
    "fullname": "Jane Doe",
    "created_at": "2026-08-01T10:32:00Z",
    "updated_at": "2026-08-01T10:32:00Z"
  }
]
```

### 8) DELETE /api/users/{userID}
Auth required: Yes

Path params:
- `userID` (number)

Response (200 OK):

```json
1
```

---

## Workspace endpoints

### 9) POST /api/workspaces
Auth required: Yes

Request body:

```json
{
  "name": "Design Team"
}
```

Response (201 Created):

```json
{
  "id": 12,
  "name": "Design Team"
}
```

### 10) GET /api/workspaces/{workspaceID}
Auth required: Yes

Path params:
- `workspaceID` (number)

Response (200 OK):

```json
{
  "id": 12,
  "name": "Design Team",
  "created_at": "2026-08-01T11:00:00Z",
  "updated_at": "2026-08-01T11:00:00Z"
}
```

### 11) PATCH /api/workspaces/{workspaceID}
Auth required: Yes

Body:

```json
{
  "name": "Updated Design Team"
}
```

Response (200 OK): workspace object

### 12) DELETE /api/workspaces/{workspaceID}
Auth required: Yes

Response (200 OK):

```json
12
```

### 13) POST /api/workspace/{workspaceID}
Auth required: Yes

Used to restore a deleted workspace.

Response (200 OK): workspace object

---

## Project endpoints

### 14) POST /api/workspaces/{workspaceID}/projects
Auth required: Yes

Path params:
- `workspaceID` (number)

Request body:

```json
{
  "name": "IssueForge Web",
  "description": "Frontend and UI work for issue tracking",
  "workspace_id": 12
}
```

Response (201 Created):

```json
{
  "id": 20,
  "workspace_id": 12,
  "lead_id": 1,
  "name": "IssueForge Web",
  "description": "Frontend and UI work for issue tracking",
  "created_at": "2026-08-01T12:00:00Z",
  "updated_at": "2026-08-01T12:00:00Z"
}
```

### 15) GET /api/projects/{projectID}
Auth required: Yes

Path params:
- `projectID` (number)

Response (200 OK): project object

### 16) PATCH /api/projects/{projectID}/details
Auth required: Yes

Request body:

```json
{
  "name": "IssueForge App",
  "description": "Updated description"
}
```

Response (200 OK): project object

### 17) PATCH /api/projects/{projectID}/lead
Auth required: Yes

Request body:

```json
{
  "lead_id": 2
}
```

Response (200 OK): project object

### 18) DELETE /api/projects/{projectID}
Auth required: Yes

Response (200 OK): project object

### 18b) POST /api/projects/{projectID}/restore
Auth required: Yes

Used to restore a deleted project. Parent workspace must not be deleted.

Response (200 OK): project object


### 19) GET /api/workspaces/{workspaceID}/projects
Auth required: Yes

Path params:
- `workspaceID` (number)

Response (200 OK):

```json
[
  {
    "id": 20,
    "workspace_id": 12,
    "lead_id": 1,
    "name": "IssueForge Web",
    "description": "Frontend and UI work for issue tracking",
    "created_at": "2026-08-01T12:00:00Z",
    "updated_at": "2026-08-01T12:00:00Z"
  }
]
```

### 19b) GET /api/projects/{projectID}/activities
Auth required: Yes (Project members only)

Path params:
- `projectID` (number)

Query params:
- `limit` (number, optional, default: 20, max: 100)
- `offset` (number, optional, default: 0)

Response (200 OK):

```json
[
  {
    "id": 1,
    "project_id": 20,
    "actor_id": 1,
    "actor_name": "Bharat Don",
    "actor_username": "bharat",
    "target_user_id": 2,
    "target_user_name": "Jane Doe",
    "target_user_username": "janedoe",
    "activity_type": "PROJECT_MEMBER_ADDED",
    "field_name": null,
    "old_value": null,
    "new_value": null,
    "created_at": "2026-10-20T20:43:48.07822+05:30"
  }
]
```

---

## Issue endpoints

### 20) POST /api/projects/{projectID}/issues
Auth required: Yes

Path params:
- `projectID` (number)

Request body:

```json
{
  "project_id": 20,
  "assigned_to": 2,
  "title": "Fix login form",
  "description": "Email validation issue on login screen",
  "status": "open",
  "priority": "high"
}
```

Response (201 Created):

```json
{
  "id": 40,
  "project_id": 20,
  "created_by": 1,
  "assigned_to": 2,
  "title": "Fix login form",
  "description": "Email validation issue on login screen",
  "status": "open",
  "priority": "high",
  "due_date": null,
  "created_at": "2026-08-01T12:30:00Z",
  "updated_at": "2026-08-01T12:30:00Z"
}
```

### 21) GET /api/issues/{issueID}
Auth required: Yes

Path params:
- `issueID` (number)

Response (200 OK): issue object

### 22) GET /api/projects/{projectID}/issues
Auth required: Yes

Path params:
- `projectID` (number)

Response (200 OK):

```json
[
  {
    "id": 40,
    "project_id": 20,
    "created_by": 1,
    "creator_name": "Jane Doe",
    "assigned_to": 2,
    "assignee_name": "John Smith",
    "title": "Fix login form",
    "description": "Email validation issue on login screen",
    "status": "open",
    "priority": "high",
    "due_date": null,
    "created_at": "2026-08-01T12:30:00Z",
    "updated_at": "2026-08-01T12:30:00Z"
  }
]
```

### 23) PATCH /api/issues/{issueID}/details
Auth required: Yes

Request body:

```json
{
  "title": "Fix login form validation",
  "description": "Need to handle empty email states"
}
```

Response (200 OK): issue object

### 24) PATCH /api/issues/{issueID}/status
Auth required: Yes

Request body:

```json
{
  "status": "in_progress"
}
```

Response (200 OK): issue object

### 25) PATCH /api/issues/{issueID}/assignee
Auth required: Yes

Request body:

```json
{
  "assigned_to": 2
}
```

Response (200 OK): issue object

### 26) PATCH /api/issues/{issueID}/priority
Auth required: Yes

Request body:

```json
{
  "priority": "medium"
}
```

Response (200 OK): issue object

### 27) GET /api/users/me/issues/assigned
Auth required: Yes

Response (200 OK): array of issue summaries

### 28) GET /api/users/me/issues/created
Auth required: Yes

Response (200 OK): array of issue summaries

### 29) PATCH /api/issues/{issueID}/due-date
Auth required: Yes

Request body:

```json
{
  "due_date": "2026-08-15T00:00:00Z"
}
```

Response (200 OK): issue object

### 30) DELETE /api/issues/{issueID}
Auth required: Yes

Response (200 OK):

```json
40
```

### 31) PATCH /api/issues/{issueID}/restore
Auth required: Yes

Response (200 OK): issue object

---

## Comment endpoints

### 32) POST /api/issues/{issueID}/comments
Auth required: Yes

Path params:
- `issueID` (number)

Request body:

```json
{
  "issue_id": 40,
  "content": "I can take this task"
}
```

Response (201 Created):

```json
{
  "id": 70,
  "issue_id": 40,
  "author_id": 1,
  "author_name": "Jane Doe",
  "parent_comment_id": null,
  "content": "I can take this task",
  "is_edited": false,
  "created_at": "2026-08-01T12:42:00Z",
  "updated_at": "2026-08-01T12:42:00Z"
}
```

### 33) GET /api/comments/{commentID}
Auth required: Yes

Response (200 OK): comment object

### 34) GET /api/issues/{issueID}/comments
Auth required: Yes

Response (200 OK): array of comments

### 35) PATCH /api/comments/{commentID}
Auth required: Yes

Request body:

```json
{
  "content": "Updated comment text"
}
```

Response (200 OK): comment object

### 36) DELETE /api/comments/{commentID}
Auth required: Yes

Response (200 OK): comment object or deleted identifier depending handler behavior

---

## Label endpoints

### 37) POST /api/projects/{projectID}/labels
Auth required: Yes

Request body:

```json
{
  "name": "frontend",
  "color": "#3b82f6"
}
```

Response (201 Created):

```json
{
  "id": 5,
  "project_id": 20,
  "name": "frontend",
  "color": "#3b82f6",
  "created_by": 1,
  "created_at": "2026-08-01T12:50:00Z",
  "updated_at": "2026-08-01T12:50:00Z"
}
```

### 38) GET /api/labels/{labelID}
Auth required: Yes

Response (200 OK): label object

### 39) GET /api/projects/{projectID}/labels
Auth required: Yes

Response (200 OK): array of label objects

### 40) PATCH /api/labels/{labelID}
Auth required: Yes

Request body:

```json
{
  "name": "ui",
  "color": "#10b981"
}
```

Response (200 OK): label object

### 41) DELETE /api/labels/{labelID}
Auth required: Yes

Response (200 OK): label object or deleted identifier depending handler behavior

### 42) POST /api/issues/{issueID}/labels
Auth required: Yes

Request body:

```json
{
  "label_ids": [5, 8]
}
```

Response (200 OK): backend response depending implementation

### 43) DELETE /api/issues/{issueID}/labels/{labelID}
Auth required: Yes

Response (200 OK): backend response depending implementation

### 44) GET /api/issues/{issueID}/labels
Auth required: Yes

Response (200 OK): array of label objects

---

## Project member endpoints

### 45) POST /api/projects/{projectID}/members
Auth required: Yes

Request body:

```json
{
  "user_id": 2
}
```

Response (200/201 OK): project member object

### 46) GET /api/projects/{projectID}/members
Auth required: Yes

Response (200 OK): array of project member objects

---

## Workspace member endpoints

### 47) POST /api/workspaces/{workspaceID}/members
Auth required: Yes

Request body:

```json
{
  "user_id": 2
}
```

Response (200/201 OK): workspace member object

### 48) GET /api/workspaces/{workspaceID}/members/{userID}
Auth required: Yes

Response (200 OK): workspace member object

### 49) GET /api/workspaces
Auth required: Yes

Response (200 OK): list of user workspaces

### 50) GET /api/workspaces/{workspaceID}/members
Auth required: Yes

Response (200 OK): array of workspace members

### 51) DELETE /api/workspaces/{workspaceID}/members/{userID}
Auth required: Yes

Response (200 OK): backend response depending implementation

### 52) PATCH /api/workspaces/{workspaceID}/members/promote
Auth required: Yes(Admins only)

Response (200 OK): workspace_id, user_id, user_role(new role)

---

## Workspace invitation endpoints

### 52) POST /api/workspaces/{workspaceID}/invitations
Auth required: Yes

Request body:

```json
{
  "user_id": 2
}
```

Response (201 Created): invitation object

### 53) GET /api/invitations/{invitationID}
Auth required: Yes

Response (200 OK): invitation object

### 54) GET /api/invitations/pending
Auth required: Yes

Response (200 OK): array of pending invitations

### 55) GET /api/workspaces/{workspaceID}/invitations/pending
Auth required: Yes

Response (200 OK): array of pending invitations for a workspace

### 56) POST /api/invitations/{invitationID}/accept
Auth required: Yes

Response (200 OK): invitation object

### 57) POST /api/invitations/{invitationID}/decline
Auth required: Yes

Response (200 OK): invitation object

### 58) POST /api/invitations/{invitationID}/cancel
Auth required: Yes (workspace admin only)

Cancels a pending invitation. Only the workspace admin can cancel; the backend validates workspace admin authorization internally.

Response (200 OK): invitation object

---

## Issue activity endpoints

### 59) GET /api/issues/{issueID}/activities
Auth required: Yes

Response (200 OK):

```json
[
  {
    "id": 11,
    "issue_id": 40,
    "actor_id": 1,
    "actor_name": "Jane Doe",
    "activity_type": "updated_status",
    "field_name": "status",
    "old_value": "open",
    "new_value": "in_progress",
    "created_at": "2026-08-01T12:55:00Z"
  }
]
```

---

## Issue attachment endpoints

### 60) POST /api/issues/{issueID}/attachments
Auth required: Yes

Request type: multipart/form-data

Form fields:
- `file` : uploaded attachment file

Response (201 Created): attachment metadata object

### 61) GET /api/attachments/{attachmentID}
Auth required: Yes

Response (200 OK): attachment metadata object

### 62) GET /api/issues/{issueID}/attachments
Auth required: Yes

Response (200 OK): array of attachment metadata objects

### 63) GET /api/comments/{commentID}/attachments
Auth required: Yes

Response (200 OK): array of attachment metadata objects

### 64) DELETE /api/attachments/{attachmentID}
Auth required: Yes

Response (200 OK): attachment deletion result

### 64b) POST /api/attachments/{attachmentID}/restore
Auth required: Yes (Uploader or Project Lead)

Response (200 OK):
```json
{
  "attachmentID": 12
}
```

---

## Archive endpoints

### 65) GET /api/archive/counts
Auth required: Yes

Response (200 OK):
```json
{
  "workspaces": 2,
  "projects": 3,
  "issues": 7,
  "attachments": 1
}
```

### 66) GET /api/archive/workspaces?search=
Auth required: Yes

Query params:
- `search` (string, optional)

Response (200 OK): array of archived workspace objects (`id`, `name`, `created_at`, `updated_at`, `deleted_at`)

### 67) GET /api/archive/projects?search=
Auth required: Yes

Query params:
- `search` (string, optional)

Response (200 OK): array of archived project objects (`id`, `workspace_id`, `workspace_name`, `lead_id`, `lead_name`, `name`, `description`, `created_at`, `updated_at`, `deleted_at`)

### 68) GET /api/archive/issues?search=
Auth required: Yes

Query params:
- `search` (string, optional)

Response (200 OK): array of archived issue objects (`id`, `project_id`, `project_name`, `workspace_id`, `workspace_name`, `created_by`, `creator_name`, `assigned_to`, `assignee_name`, `title`, `description`, `status`, `priority`, `created_at`, `updated_at`, `due_date`, `deleted_at`)

### 69) GET /api/archive/attachments?search=
Auth required: Yes

Query params:
- `search` (string, optional)

Response (200 OK): array of archived attachment objects (`id`, `issue_id`, `issue_title`, `project_id`, `project_name`, `uploaded_by`, `uploader_name`, `original_name`, `resource_type`, `mime_type`, `file_size`, `public_url`, `created_at`, `deleted_at`)

---

## Workspace Invitations

### 70) POST /api/workspaces/{workspaceID}/invitations
Auth required: Yes (Admin/Owner only)

Request body:
```json
{
  "user_id": 23
}
```

Response (201 Created):
```json
{
  "id": 5,
  "workspace_id": 5,
  "invited_user_id": 23,
  "invitedd_by": 1,
  "status": "PENDING",
  "created_at": "2026-10-20T20:43:48.07822+05:30",
  "responded_at": null
}
```

### 71) GET /api/invitations/pending
Auth required: Yes

Returns pending invitations sent to the authenticated user.

Response (200 OK):
```json
[
  {
    "id": 5,
    "workspace_id": 5,
    "workspace_name": "Bharat's Workspaces 2",
    "invited_username": "bharat",
    "inviter_fullname": "Bharat Don",
    "created_at": "2026-10-20T20:43:48.07822+05:30"
  }
]
```

### 72) GET /api/invitations/{invitationID}
Auth required: Yes

Response (200 OK):
```json
{
  "id": 5,
  "workspace_id": 5,
  "invited_user_id": 23,
  "invitedd_by": 1,
  "status": "PENDING",
  "created_at": "2026-10-20T20:43:48.07822+05:30",
  "responded_at": null
}
```

### 73) GET /api/workspaces/{workspaceID}/invitations/pending
Auth required: Yes (Admin/Owner only)

Returns pending invitations sent by this workspace.

Response (200 OK):
```json
[
  {
    "id": 5,
    "workspace_id": 5,
    "invited_user_id": 23,
    "username": "bhardemo27_9f7c5",
    "fullname": "bhardemo",
    "created_at": "2026-10-20T20:43:48.07822+05:30"
  }
]
```

### 73b) GET /api/workspaces/{workspaceID}/invitations/rejected
Auth required: Yes (Admin/Owner only)

Returns declined and cancelled invitations sent by this workspace.

Response (200 OK):
```json
[
  {
    "id": 3,
    "workspace_id": 5,
    "invited_user_id": 5,
    "username": "benchmark_user_03",
    "fullname": "Benchmark User 03",
    "status": "DECLINED",
    "created_at": "2026-10-19T13:22:02.912093+05:30",
    "responded_at": "2026-10-27T14:46:55.416927+05:30"
  }
]
```

### 74) POST /api/invitations/{invitationID}/accept
Auth required: Yes (Invited user only)

Response (200 OK):
```json
{
  "id": 5,
  "workspace_id": 5,
  "invited_user_id": 23,
  "status": "ACCEPTED",
  "responded_at": "2026-10-20T21:00:00Z"
}
```

### 75) POST /api/invitations/{invitationID}/decline
Auth required: Yes (Invited user only)

Response (200 OK):
```json
{
  "id": 5,
  "workspace_id": 5,
  "invited_user_id": 23,
  "status": "DECLINED",
  "responded_at": "2026-10-20T21:00:00Z"
}
```

### 76) POST /api/invitations/{invitationID}/cancel
Auth required: Yes (Admin/Owner only)

Response (200 OK):
```json
{
  "id": 5,
  "status": "CANCELLED",
  "responded_at": "2026-10-20T21:00:00Z"
}
```

---

## Analytics

### 77) GET /api/workspaces/{workspaceID}/analytics
Auth required: Yes (Workspace Admin only)

Query parameters (optional):
- `from`: string (`YYYY-MM-DD` or RFC3339 timestamp, default: 30 days ago)
- `to`: string (`YYYY-MM-DD` or RFC3339 timestamp, default: now)
- `limit`: integer (top active members limit, default: 10)

Response (200 OK):
```json
{
  "daily_activities": [
    {
      "date": "2026-10-01",
      "total_activities": 12
    },
    {
      "date": "2026-10-02",
      "total_activities": 8
    }
  ],
  "issue_velocity": [
    {
      "date": "2026-10-01",
      "issues_created": 4,
      "issues_completed": 2
    },
    {
      "date": "2026-10-02",
      "issues_created": 3,
      "issues_completed": 5
    }
  ],
  "activity_breakdown": [
    {
      "activity_type": "ISSUE_CREATED",
      "count": 45
    },
    {
      "activity_type": "ISSUE_STATUS_UPDATED",
      "count": 38
    },
    {
      "activity_type": "COMMENT_CREATED",
      "count": 29
    }
  ],
  "member_leaderboard": [
    {
      "user_id": 10,
      "fullname": "Alex Developer",
      "username": "alexdev",
      "email": "alex@example.com",
      "issue_actions_count": 52,
      "completed_issues_count": 14
    }
  ]
}
```

### 78) GET /api/projects/{projectID}/analytics
Auth required: Yes (Project Lead or Workspace Admin only)

Query parameters (optional):
- `from`: string (`YYYY-MM-DD` or RFC3339 timestamp, default: 30 days ago)
- `to`: string (`YYYY-MM-DD` or RFC3339 timestamp, default: now)
- `limit`: integer (project members activity stats limit, default: 10)

Response (200 OK):
```json
{
  "daily_activities": [
    {
      "date": "2026-10-01",
      "total_activities": 7
    }
  ],
  "issue_velocity": [
    {
      "date": "2026-10-01",
      "issues_created": 2,
      "issues_completed": 1
    }
  ],
  "activity_breakdown": [
    {
      "activity_type": "ISSUE_CREATED",
      "count": 20
    },
    {
      "activity_type": "ISSUE_STATUS_UPDATED",
      "count": 15
    }
  ],
  "member_leaderboard": [
    {
      "user_id": 10,
      "fullname": "Alex Developer",
      "username": "alexdev",
      "email": "alex@example.com",
      "issue_actions_count": 35,
      "completed_issues_count": 10
    }
  ]
}
```

---

## Notifications

### 1) GET /api/notifications
Auth required: Yes

Query parameters:
- `limit` (optional, integer, default: 20, max: 100)
- `offset` (optional, integer, default: 0)
- `filter` (optional, string: `"unread"` to fetch only unread notifications)

Response (200 OK):
```json
[
  {
    "id": 101,
    "recepient_id": 5,
    "sender_id": 2,
    "notification_type": "ISSUE_ASSIGNED_TO_YOU",
    "title": "Issue Assigned to You",
    "message": "You have been assigned to issue 'Fix login bug'",
    "project_id": 12,
    "issue_id": 45,
    "workspace_id": 3,
    "is_read": false,
    "read_at": null,
    "created_at": "2026-10-30T12:00:00Z",
    "updated_at": "2026-10-30T12:00:00Z"
  }
]
```

### 2) GET /api/notifications/unread
Auth required: Yes

Response (200 OK):
```json
[
  {
    "id": 101,
    "recepient_id": 5,
    "sender_id": 2,
    "notification_type": "ISSUE_ASSIGNED_TO_YOU",
    "title": "Issue Assigned to You",
    "message": "You have been assigned to issue 'Fix login bug'",
    "project_id": 12,
    "issue_id": 45,
    "workspace_id": 3,
    "is_read": false,
    "read_at": null,
    "created_at": "2026-10-30T12:00:00Z",
    "updated_at": "2026-10-30T12:00:00Z"
  }
]
```

### 3) GET /api/notifications/unread/count
Auth required: Yes

Response (200 OK):
```json
{
  "unread_count": 3
}
```

### 4) GET /api/notifications/{id}
Auth required: Yes

Path parameters:
- `id`: notification ID (int64)

Response (200 OK):
```json
{
  "id": 101,
  "recepient_id": 5,
  "sender_id": 2,
  "notification_type": "ISSUE_ASSIGNED_TO_YOU",
  "title": "Issue Assigned to You",
  "message": "You have been assigned to issue 'Fix login bug'",
  "project_id": 12,
  "issue_id": 45,
  "workspace_id": 3,
  "is_read": false,
  "read_at": null,
  "created_at": "2026-10-30T12:00:00Z",
  "updated_at": "2026-10-30T12:00:00Z"
}
```

### 5) PATCH /api/notifications/{id}/read
Auth required: Yes

Path parameters:
- `id`: notification ID (int64)

Response (200 OK):
```json
{
  "id": 101,
  "recepient_id": 5,
  "sender_id": 2,
  "notification_type": "ISSUE_ASSIGNED_TO_YOU",
  "title": "Issue Assigned to You",
  "message": "You have been assigned to issue 'Fix login bug'",
  "project_id": 12,
  "issue_id": 45,
  "workspace_id": 3,
  "is_read": true,
  "read_at": "2026-10-30T12:05:00Z",
  "created_at": "2026-10-30T12:00:00Z",
  "updated_at": "2026-10-30T12:05:00Z"
}
```

### 6) POST /api/notifications/read-all
Auth required: Yes

Response (200 OK):
```json
{
  "message": "all notifications marked as read"
}
```

### 7) DELETE /api/notifications/{id}
Auth required: Yes

Path parameters:
- `id`: notification ID (int64)

Response (200 OK):
```json
{
  "id": 101
}
```

### 8) DELETE /api/notifications
Auth required: Yes

Marks all read/unread notifications as read in PostgreSQL and enqueues a background deletion job.

Response (200 OK):
```json
{
  "message": "all notifications queued for deletion"
}
```

---

## Notes


- All protected routes rely on the JWT token in the `Authorization` header.
- The backend uses `gorilla/mux` path variables like `{issueID}`, `{workspaceID}`, `{projectID}`, etc.
- Several endpoints accept `PATCH` requests with partial objects, meaning only the fields you want to update need to be sent.
- Query params and path params are required exactly as shown in the route definition.
- For upload endpoints, use `multipart/form-data`; for all other endpoints use `application/json`.
- Google OAuth endpoints operate under `/api/auth/google*`. The initiation endpoint sets an HTTP-only state cookie on path `/api/auth/google`, and the callback endpoint validates it.
- Backend CORS configuration enables credentials (`AllowCredentials: true`) to support cross-origin authentication requests from allowed frontend origins (e.g. `http://localhost:3000`, `https://issue-forge-frontend.vercel.app`).

