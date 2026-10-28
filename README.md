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

## Deploy on Vercel

The root `vercel.json` defines a Vite `client` service and an Express `server` service. The client is public at `/`; requests under `/api/*` are routed to the API service on the same domain. The browser uses the relative `/api` URL, so do not set `VITE_API_URL` on Vercel. The client calls the public API path from the browser; no service-to-service binding is needed.

Import this repository as a Vercel multi-service project and add these server environment variables for Production and Preview:

- `MONGO_URI`: a MongoDB Atlas connection string.
- `JWT_SECRET`: a unique random value with at least 32 characters.

`CLIENT_ORIGIN` is only needed if you intentionally call the API cross-origin; same-origin `/api` requests are allowed automatically. `VITE_API_URL` is only needed when using a separate API URL outside the Vite development proxy.

## Demo data

`npm run seed:demo` inserts or updates 15 clearly labeled illustrative sample notices and creates one linked calendar event for each notice. Sample event dates are generated relative to the seeding date and labeled as illustrative in the notice details and calendar. Run it from `server/` after configuring `MONGO_URI` and creating an active account. The notices and events are attributed to an existing active account; the script does not create accounts, delete records, or reset the database. Each sample uses a stable demo key, so rerunning the command updates those samples instead of duplicating them. Sample poster artwork is stored locally in `client/public/images/demo-notices/` and served at `/images/demo-notices/`.

## Features

- Responsive CampusHub layout, persistent light/dark theme, searchable notices, category/priority filters, pagination, and list/grid views.
- Notice drafts, archive/publish state, expiry, pins, department/year targeting, server-side audience filtering, summaries, issuing departments, and local cover artwork.
- Profile group preferences, per-user bookmarks, unique read receipts, unread filtering, persistent in-app notifications, and a private task planner for assignments and study goals.
- Academic calendar shows the full upcoming event list and month view; members can mark important events privately, and administrators can create or remove events.
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
| GET | `/api/notices/featured` | Signed in | Get the newest visible pinned notice for the featured board section |
| GET | `/api/notices/:id` | Signed in | Read a notice and create its read receipt |
| POST | `/api/notices/:id/read` | Signed in | Mark a notice read |
| PUT | `/api/notices/:id/bookmark` | Signed in | Toggle a bookmark |
| GET | `/api/notices/bookmarks`, `/api/notices/unread/count` | Signed in | Read personal bookmarks and unread count |
| POST, PUT, DELETE | `/api/notices` and `/api/notices/:id` | Admin | Manage notices |
| GET, POST, PUT, DELETE | `/api/events` | Read signed in; writes admin | Academic calendar |
| GET, POST | `/api/tasks` | Signed in | List or create personal planner tasks |
| PATCH, DELETE | `/api/tasks/:id` | Signed in, task owner | Complete or remove a personal task |
| GET | `/api/events/important` | Signed in | List event IDs marked important by the current user |
| PUT | `/api/events/:id/important` | Signed in | Mark a visible campus event important or remove the mark |
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
