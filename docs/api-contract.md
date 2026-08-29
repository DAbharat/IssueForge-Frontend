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

### 58) POST /api/invitations/{invitationID}/decline
Auth required: Yes

This route is also used for cancellation/decline flow in the router; the backend behavior is the same as decline. Use the same payload conventions as above.

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

---

## Notes

- All protected routes rely on the JWT token in the `Authorization` header.
- The backend uses `gorilla/mux` path variables like `{issueID}`, `{workspaceID}`, `{projectID}`, etc.
- Several endpoints accept `PATCH` requests with partial objects, meaning only the fields you want to update need to be sent.
- Query params and path params are required exactly as shown in the route definition.
- For upload endpoints, use `multipart/form-data`; for all other endpoints use `application/json`.
