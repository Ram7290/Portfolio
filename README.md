# Ramduth Rajesh — Developer Portfolio

A modern, premium, full stack developer portfolio with a complete admin panel.

- **Public site** — hero, about, skills, experience timeline, featured & filterable projects, project case studies, services, education, resume CTA, and a working contact form.
- **Admin panel** (`/admin`) — SaaS-style dashboard to manage every piece of content without touching code: profile, skills, experience, projects, services, education, resume, messages inbox, social links, and site settings.
- **Free-tier stack** — runs entirely on free services (Vercel, MongoDB Atlas, Cloudinary).

---

## Tech Stack

| Layer      | Technology                                             |
| ---------- | ------------------------------------------------------ |
| Framework  | Next.js (App Router) + TypeScript                      |
| Styling    | Tailwind CSS v4 + shadcn/ui + Lucide icons             |
| Animation  | Motion (Framer Motion), reduced-motion aware           |
| Database   | MongoDB Atlas + Mongoose                               |
| Auth       | Auth.js (NextAuth v5), credentials + bcrypt hashing    |
| Forms      | React Hook Form + custom server-side validation        |
| Images     | Cloudinary (profile picture & project thumbnails only) |
| Theming    | next-themes — dark (default) / light / system          |

## Project Structure

```
src/
├── app/
│   ├── (public)/            # Public site (shared header/footer layout)
│   │   ├── page.tsx         # Homepage (all major sections)
│   │   ├── about/           # /about
│   │   ├── projects/        # /projects, /projects/[slug]
│   │   ├── contact/         # /contact
│   │   └── resume/          # /resume
│   ├── admin/
│   │   ├── login/           # /admin/login
│   │   └── (protected)/     # Session-gated admin pages + sidebar layout
│   ├── api/                 # REST API (admin + /api/public), see "REST API" below
│   ├── layout.tsx           # Root layout, fonts, metadata, providers
│   ├── sitemap.ts / robots.ts
│   └── globals.css          # Design tokens (dark-first) + utilities
├── components/
│   ├── ui/                  # shadcn/ui primitives
│   ├── public/              # Public site components
│   └── admin/               # Admin tables, dialogs, forms
├── models/                  # Mongoose models
├── lib/                     # db, auth, API helpers + clients, cloudinary, notify
├── types/                   # Shared content types
└── proxy.ts                 # Edge guard for /admin (Next 16 middleware)
```

## Getting Started

```bash
npm install
npm run dev          # http://localhost:3000
```

Other commands:

```bash
npm run build        # production build
npm run start        # run the production build
npm run lint         # eslint
npm run seed         # seed MongoDB with placeholder content + admin user
```

> **Works without any setup:** with no environment variables configured the
> public site renders from clearly-marked placeholder data. Add MongoDB (and
> optionally Cloudinary) below to enable the admin panel and persistence.

## Environment Setup

Copy `.env.example` → `.env.local` (or `.env`) and fill in:

```env
MONGODB_URI=            # MongoDB Atlas connection string
MONGODB_DB=portfolio
AUTH_SECRET=            # generate: openssl rand -base64 32
AUTH_URL=http://localhost:3000
ADMIN_EMAIL=            # first admin login (auto-created on first login or via seed)
ADMIN_PASSWORD=
CLOUDINARY_CLOUD_NAME=  # optional — image uploads
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Never commit real credentials. `.gitignore` already excludes `.env*` files.

### MongoDB Atlas (free tier)

1. Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. Create a database user and allow your IP (or `0.0.0.0/0` for serverless).
3. Copy the connection string into `MONGODB_URI`.
4. Run `npm run seed` to populate placeholder content + your admin user.

### Cloudinary (free tier)

1. Create a free account at [cloudinary.com](https://cloudinary.com).
2. Copy the Cloud name, API key, and API secret into the env vars.
3. Uploads appear in the `portfolio/profile` and `portfolio/projects` folders;
   MongoDB stores only the hosted URLs.

### Admin access

- Set `ADMIN_EMAIL` + `ADMIN_PASSWORD`, then either run `npm run seed` or
  simply log in once at `/admin/login` — the account is created automatically
  from those env vars (and never committed anywhere).
- All admin routes are protected twice: an edge proxy check plus a server-side
  `auth()` gate in the admin layout.

## REST API

The site, the web admin and the mobile admin app all go through `src/app/api`:

- `/api/public/*` — read-only content for the public site, no sign-in.
- Everything else under `/api` is admin-only, except `POST /api/messages`
  (the public contact form) and the sign-in routes.

Every response is JSON in one shape, with a matching HTTP status:

```json
{ "ok": true, "data": { } }
{ "ok": false, "error": "Project title is required." }
```

`400` invalid input · `401` not signed in or bad token · `404` not found ·
`409` slug already taken · `500` server or configuration problem.

### Signing in

| Client     | How                                                                                                                                                                     |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Web admin  | `POST /api/auth/login` sets the Auth.js session cookie; `POST /api/auth/logout` clears it.                                                                              |
| Mobile app | `POST /api/auth/token` with `{ "email", "password" }` returns `{ token, expiresAt, admin }`. Send `Authorization: Bearer <token>` with every admin request. |

- Tokens last 30 days, like a web session. The app signs out by deleting its
  stored token.
- `GET /api/auth/me` returns the signed-in admin — the app calls it on launch
  and shows the login screen on `401`.
- Tokens are signed with a key derived from `AUTH_SECRET` (no extra env vars).
  Changing `AUTH_SECRET` signs out every app and browser at once.

### Admin endpoints

| Resource                                         | Endpoints                                                                                                   |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| `projects`, `experience`, `education`, `services`, `skills` | `GET`/`POST /api/<resource>` · `PUT`/`DELETE /api/<resource>/[id]` · `POST /api/<resource>/reorder` with `{ "ids": [...] }` |
| Social links                                     | Same pattern under `/api/settings/social-links`                                                             |
| Skills (extra)                                   | `PATCH /api/skills/[id]` with `{ "active": true }`                                                          |
| Profile                                          | `GET`/`PUT /api/profile`                                                                                    |
| Site settings, résumé                            | `GET`/`PUT /api/settings/site`, `GET`/`PUT /api/settings/resume`                                            |
| Messages                                         | `GET /api/messages` · `PATCH /api/messages/[id]` with `{ "read": true }` · `DELETE /api/messages/[id]` · `GET /api/messages/unread-count` · `GET /api/messages/stream` (live feed for the web admin) |
| Images                                           | `POST /api/upload` (multipart: `file`, `folder` = `profile` or `projects`) · `DELETE /api/upload` with `{ "publicId" }` |
| Alerts                                           | `GET /api/notifications` (configured channels) · `POST /api/notifications` (send a test alert)             |

Request bodies match the input types exported from each `route.ts`.

## Deployment (Vercel free tier)

1. Push the repository to GitHub.
2. Import it on [vercel.com](https://vercel.com) (Next.js is auto-detected).
3. Add the environment variables from above in **Project → Settings →
   Environment Variables** (`NEXT_PUBLIC_SITE_URL` = your final domain).
4. Deploy. MongoDB Atlas and Cloudinary free tiers cover the runtime needs.

## Notes

- **Placeholder content** — seeded/experience/education entries are clearly
  marked `[Placeholder]` and meant to be replaced from the admin panel; no
  fake achievements, employers, or statistics are presented as real.
- **Caching** — public pages use ISR (60s revalidate); admin mutations call
  `revalidatePath`, so edits appear on the public site promptly.
- **Contact form** — stores messages in MongoDB (visible in the admin inbox);
  no email service required. Includes honeypot + basic IP rate limiting.
- **Accessibility** — semantic HTML, labelled forms, focus states, keyboard
  navigation, and `prefers-reduced-motion` support throughout.
