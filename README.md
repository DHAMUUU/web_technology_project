# CampusHub

CampusHub is a campus communication platform built on the existing React, Vite, Express, JWT, and MongoDB stack. Members can browse audience-aware notices, save bookmarks, track unread items, receive in-app notifications, and view the academic calendar. Administrators can publish and target notices, manage members and events, and review an audit trail.

## Requirements

- Node.js 18 or newer
- A MongoDB database, local or MongoDB Atlas

## Run locally

Create `server/.env` from the example, then configure the database URI and a private JWT secret:

```bash
cd server
npm install
cp .env.example .env
```

Generate a JWT signing secret with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

Paste the generated value after `JWT_SECRET=` in `server/.env`. For Atlas, use the URI from **Database → Connect → Drivers** and allow your IP in **Security → Network Access**. Keep the completed URI private. The API only accepts browser requests from the origins listed in `CLIENT_ORIGIN`.

Start the API:

```bash
npm run dev
```

In another terminal:

```bash
cd client
npm install
npm run dev
```

Open the Vite address, normally `http://localhost:5173`. The API health endpoint is `http://localhost:5000/api/health`. Set `VITE_API_URL` in `client/.env` to override the default API base URL.

## Demo data

`npm run seed` safely adds demo accounts and sample notices when they are missing. It does not delete or reset existing accounts or notices. The seeded demo passwords are intended only for a disposable development database; change or remove those accounts before using a shared database.

## Features

- Responsive CampusHub layout, persistent light/dark theme, searchable notices, category/priority filters, pagination, and list/grid views.
- Notice drafts, archive/publish state, expiry, pins, department/year targeting, and server-side audience filtering.
- Profile group preferences, per-user bookmarks, unique read receipts, unread filtering, and persistent in-app notifications.
- Month calendar with agenda; administrators can create and remove events.
- Admin dashboard with database-backed category/activity metrics, member administration, and a read-only audit log.
- Rate-limited authentication routes, bcrypt password hashing, JWT role checks, input validation, bounded request bodies, Helmet headers, restricted CORS, and allowlisted updates.

## API overview

Protected routes use `Authorization: Bearer <token>`. Existing route contracts for `/api/auth`, `/api/notices`, `/api/users`, and `/api/stats` remain available.

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| POST | `/api/auth/register`, `/api/auth/login` | Public, rate limited | Create a member account or sign in |
| PUT | `/api/auth/change-password` | Signed in | Change password |
| GET, PATCH | `/api/users/me` | Signed in | Read or update profile group preferences |
| GET | `/api/notices` | Signed in | Search, filter, sort, and paginate visible notices |
| GET | `/api/notices/:id` | Signed in | Read a notice and create its read receipt |
| POST | `/api/notices/:id/read` | Signed in | Mark a notice read |
| PUT | `/api/notices/:id/bookmark` | Signed in | Toggle a bookmark |
| GET | `/api/notices/bookmarks`, `/api/notices/unread/count` | Signed in | Read personal bookmarks and unread count |
| POST, PUT, DELETE | `/api/notices` and `/api/notices/:id` | Admin | Manage notices |
| GET, POST, PUT, DELETE | `/api/events` | Read signed in; writes admin | Academic calendar |
| GET, PATCH, POST | `/api/notifications` | Signed in | List and mark notifications read |
| GET | `/api/audit` | Admin | Read administrative audit history |
| GET | `/api/stats` | Admin | Dashboard analytics |

## Data compatibility

No destructive migration is required. Existing notices without `status` or `audience` remain visible as published campus-wide notices. New notice reads, bookmarks, notifications, events, and audit actions use separate MongoDB collections. Existing users without a department or academic year can still sign in and see campus-wide notices; targeted notices require matching profile groups.

## Current scope and limitations

- Attachments and a document library are not included because no storage provider is configured.
- AI summaries are not included because no server-side AI provider or API key is configured.
- Calendar views include a month grid and selected-day agenda; event editing and week view remain future enhancements.
- Approval workflows, scheduled publishing, email notifications, and detailed read-percentage analytics remain future enhancements.
- Run `npm run build` from `client` to build the web app. The server currently has no dedicated test or lint script.
