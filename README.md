# Near Connect

Near Connect is a two-sided nearby discovery app: people see profiles inside a
chosen radius, privately pass or request a connection, match only when both
people choose each other, and then chat.

This rebuild completes the original unfinished MVP while preserving its
Spring Boot + React direction.

## What works now

- Account registration and sign-in with PBKDF2 password hashing
- Random 30-day bearer sessions and protected user actions
- Browser geolocation plus a Bhubaneswar sample-location option
- Radius-based discovery (5, 10, 25, or 50 km)
- Pass and Connect actions, including drag gestures
- Idempotent mutual matching without duplicate match records
- Connection list sorted by latest activity
- Private messaging restricted to mutual connections
- Editable name, bio, mood, and discovery location
- Responsive desktop/mobile UI with accessible controls
- Persistent zero-configuration H2 database for local development
- Optional MySQL configuration through environment variables
- Seeded demo profiles for immediate testing

## Where the old project had stopped

The uploaded project had controllers and tables for users, swipes, matches, and
messages, plus basic login/register/discovery screens. It was not yet a working
end-to-end product:

- the frontend's nearby request omitted the required `userId`;
- every user was placed at one hard-coded coordinate;
- created matches could not be listed or opened;
- message APIs had no frontend chat experience;
- swipe results were not shown and duplicate matches were possible;
- plain-text passwords and a real MySQL password were stored in source;
- the app required a separately configured MySQL database to start; and
- there were no usable project-level run instructions.

Those gaps are addressed in this version. The previously committed database
password has been removed; change that database password anywhere else it may
have been reused.

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite 8, Framer Motion, CSS |
| Backend | Java 17, Spring Boot 4, Spring MVC, Spring Data JPA |
| Local database | H2 file database |
| Optional database | MySQL |
| Authentication | Random bearer session + PBKDF2-HMAC-SHA256 password hash |

## Run locally

Requirements: Java 17+, Maven 3.9+, Node.js 20+, and npm.

### 1. Start the backend

```bash
cd backend
mvn spring-boot:run
```

The API starts on `http://localhost:8080`. Local data is stored under
`backend/data/` and is ignored by Git.

### 2. Start the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the address Vite prints (normally `http://localhost:5173`).

### Demo account

- Email: `aditi@nearconnect.app`
- Password: `demo1234`

Other seeded accounts use the same password. For a true mutual-match test, sign
in as Aditi in one browser and Rohan (`rohan@nearconnect.app`) in a private
window, then have both profiles choose Connect on each other.

To reset the local demo after testing, stop the backend, remove the
`backend/data/` directory, and start the backend again.

## Configuration

The defaults need no `.env` file. Set these environment variables only when
required:

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `8080` | Backend port |
| `DB_URL` | local H2 file | JDBC database URL |
| `DB_USERNAME` | `sa` | Database user |
| `DB_PASSWORD` | empty | Database password |
| `ALLOWED_ORIGINS` | local Vite URLs | Comma-separated CORS origins |
| `DEMO_SEED` | `true` | Seed local demo profiles |
| `VITE_API_URL` | `http://localhost:8080/api` | Frontend API base URL |

Example MySQL values:

```text
DB_URL=jdbc:mysql://localhost:3306/nearconnect
DB_USERNAME=nearconnect_app
DB_PASSWORD=use-a-secret-environment-value
DEMO_SEED=false
```

## API summary

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/api/users/register` | Create account and session |
| `POST` | `/api/users/login` | Sign in |
| `POST` | `/api/users/logout` | End current session |
| `GET` | `/api/users/me` | Read current profile |
| `PUT` | `/api/users/me/profile` | Update public profile |
| `PUT` | `/api/users/me/location` | Update discovery location |
| `GET` | `/api/users/nearby?radius=10` | Find unseen nearby profiles |
| `POST` | `/api/swipes` | Pass or request connection |
| `GET` | `/api/matches` | List mutual connections |
| `GET` | `/api/messages?withUserId=…` | Read a matched conversation |
| `POST` | `/api/messages` | Send a matched conversation message |

Authenticated routes require `Authorization: Bearer <token>`.

## Validation commands

```bash
cd backend && mvn test
cd frontend && npm run lint && npm run build
```

## Before a public launch

This is a functional local MVP, not yet a public-production social platform.
The next release should add email verification/password reset, secure HTTP-only
cookie authentication, profile photos/object storage, report/block/moderation
flows, rate limiting, WebSocket chat, database migrations, privacy/terms pages,
and a deployment/monitoring pipeline.
