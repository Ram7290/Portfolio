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
│   ├── api/auth/[...nextauth]/
│   ├── layout.tsx           # Root layout, fonts, metadata, providers
│   ├── sitemap.ts / robots.ts
│   └── globals.css          # Design tokens (dark-first) + utilities
├── components/
│   ├── ui/                  # shadcn/ui primitives
│   ├── public/              # Public site components
│   └── admin/               # Admin tables, dialogs, forms
├── actions/                 # Server actions (all CRUD + contact + uploads)
├── models/                  # Mongoose models
├── lib/                     # db, auth, content, cloudinary, settings
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
