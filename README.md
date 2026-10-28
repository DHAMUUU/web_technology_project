# Digital Notice Board

A responsive campus notice board built with React, Vite, Bootstrap, Express, JWT authentication and MongoDB. Administrators publish and manage notices and members; campus users can search and read active notices.

## Requirements

- Node.js 18 or newer
- MongoDB running locally, or a MongoDB Atlas connection string

## Run locally

Open two terminals from the project folder.

1. Configure the API:

```bash
cd server
npm install
cp .env.example .env
```

Edit `server/.env` if your MongoDB connection is different. Set a private `JWT_SECRET` before using the app outside a local demo.

2. Add demo data (MongoDB must be running):

```bash
npm run seed
```

3. Start the API:

```bash
npm run dev
```

The API listens at `http://localhost:5000`. In the second terminal:

```bash
cd client
npm install
npm run dev
```

Open the Vite URL shown in the terminal (normally `http://localhost:5173`). The client defaults to `http://localhost:5000/api`; set `VITE_API_URL` in `client/.env` to change it.

### Demo accounts

- Admin: `admin@example.com` / `Admin@123`
- User: `aarav@example.com` / `User@1234`
- User: `maya@example.com` / `User@1234`

`npm run seed` resets the database collections for users and notices before recreating this demo data.

## API overview

All successful responses use `{ success, message, data }` (message may be omitted on list responses). Protected endpoints expect `Authorization: Bearer <token>`.

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Public | Register an account |
| POST | `/api/auth/login` | Public | Sign in and receive a JWT |
| PUT | `/api/auth/change-password` | Signed in | Change password |
| GET | `/api/notices?search=&category=&priority=` | Signed in | Search/filter notices |
| GET | `/api/notices/:id` | Signed in | Notice details |
| POST, PUT, DELETE | `/api/notices` and `/api/notices/:id` | Admin | Manage notices |
| GET, POST | `/api/users` | Admin | List or add members |
| PUT, DELETE | `/api/users/:id` | Admin | Update or remove members |
| GET | `/api/stats` | Admin | Dashboard summary and recent notices |

## How it works

1. A user signs in; the server verifies the password hash and returns a signed JWT.
2. The React auth context stores the token and profile in local storage. Axios sends the token on API requests.
3. Express middleware verifies the token and checks admin role for management routes. Role-based React routes provide matching navigation and screen access.
4. Notices are stored in MongoDB with category, priority, author, optional expiry and pin status. Expired notices are hidden from regular users.

For the demo: sign in as the admin, publish a notice, sign out, and sign in as the campus user to see it on the board.
