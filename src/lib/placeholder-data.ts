import type {
  Education,
  Experience,
  Profile,
  Project,
  Service,
  Skill,
  SocialLinkItem,
} from "@/types/portfolio";

/**
 * Placeholder content for the public site (Phases 1–2).
 * Anything unavailable is clearly marked as placeholder so it can be
 * replaced from the Admin Panel once MongoDB is connected (Phase 3+).
 */

export const placeholderProfile: Profile = {
  name: "Ramduth Rajesh",
  role: "Full Stack Developer",
  tagline:
    "Building modern, scalable and user-focused web applications with clean architecture and powerful technologies.",
  bio: [
    "I'm Ramduth Rajesh, a Full Stack Developer who enjoys turning complex problems into clean, maintainable software. I care about the details — from database schema design to the last pixel of a UI.",
    "My focus is the modern JavaScript ecosystem: React and Next.js on the frontend, Node.js and REST APIs on the backend, with MongoDB and SQL databases underneath. I value clear architecture, typed code, and shipping things that actually work.",
    "Beyond writing code, I'm interested in developer experience, performance, and building products that feel effortless to use.",
  ],
  imageUrl: null,
  location: "Available Worldwide (Remote)",
  email: "ramduth.rajesh@example.com",
  available: true,
  availabilityLabel: "Open to Opportunities",
  stats: [
    { value: "2+", label: "Years of Experience" },
    { value: "10+", label: "Projects Built" },
    { value: "15+", label: "Technologies Used" },
    { value: "100%", label: "Commitment to Quality" },
  ],
};

export const placeholderSkills: Skill[] = [
  // Frontend
  { name: "React", category: "Frontend", proficiency: "Advanced", order: 1, active: true },
  { name: "Next.js", category: "Frontend", proficiency: "Advanced", order: 2, active: true },
  { name: "TypeScript", category: "Frontend", proficiency: "Advanced", order: 3, active: true },
  { name: "JavaScript", category: "Frontend", proficiency: "Advanced", order: 4, active: true },
  { name: "HTML", category: "Frontend", proficiency: "Advanced", order: 5, active: true },
  { name: "CSS", category: "Frontend", proficiency: "Advanced", order: 6, active: true },
  { name: "Tailwind CSS", category: "Frontend", proficiency: "Advanced", order: 7, active: true },
  { name: "Material UI", category: "Frontend", proficiency: "Intermediate", order: 8, active: true },
  // Backend
  { name: "Node.js", category: "Backend", proficiency: "Advanced", order: 9, active: true },
  { name: "Express.js", category: "Backend", proficiency: "Advanced", order: 10, active: true },
  { name: "PHP", category: "Backend", proficiency: "Intermediate", order: 11, active: true },
  { name: "CodeIgniter", category: "Backend", proficiency: "Intermediate", order: 12, active: true },
  { name: "REST APIs", category: "Backend", proficiency: "Advanced", order: 13, active: true },
  // Databases
  { name: "MongoDB", category: "Databases", proficiency: "Advanced", order: 14, active: true },
  { name: "PostgreSQL", category: "Databases", proficiency: "Intermediate", order: 15, active: true },
  { name: "MySQL", category: "Databases", proficiency: "Advanced", order: 16, active: true },
  // Tools
  { name: "Git", category: "Tools", proficiency: "Advanced", order: 17, active: true },
  { name: "GitHub", category: "Tools", proficiency: "Advanced", order: 18, active: true },
  { name: "Bitbucket", category: "Tools", proficiency: "Intermediate", order: 19, active: true },
  { name: "VS Code", category: "Tools", proficiency: "Advanced", order: 20, active: true },
  { name: "Postman", category: "Tools", proficiency: "Advanced", order: 21, active: true },
  { name: "Docker", category: "Tools", proficiency: "Intermediate", order: 22, active: true },
];

export const placeholderExperience: Experience[] = [
  {
    company: "Placeholder Company",
    role: "Placeholder Role — Full Stack Developer",
    location: "Remote",
    startDate: "2024-01",
    endDate: null,
    current: true,
    description:
      "[Placeholder] Add your real experience here from the Admin Panel → Experience.",
    responsibilities: [
      "[Placeholder] Describe what you own and build day to day.",
    ],
    technologies: ["Next.js", "TypeScript", "Node.js", "MongoDB"],
    achievements: [],
    order: 1,
  },
];

export const placeholderProjects: Project[] = [
  {
    title: "Portfolio & Admin Platform",
    slug: "portfolio-admin-platform",
    shortDescription:
      "This very site — a full stack portfolio with a MongoDB-backed admin panel.",
    description:
      "A developer portfolio built with Next.js App Router, TypeScript, and Tailwind CSS, paired with a secure admin panel backed by MongoDB Atlas. Content — profile, skills, experience, projects, services, education — is fully editable without touching code. Images are served through Cloudinary.",
    problem:
      "Static portfolios go stale: every content change means a code edit and redeploy.",
    solution:
      "Model all content in MongoDB and manage it through a protected admin dashboard. The public site renders from the database with proper caching and revalidation.",
    features: [
      "Server-rendered public pages with dynamic metadata",
      "Admin CRUD for every content type",
      "Image uploads via Cloudinary (profile picture & project thumbnails only)",
      "Contact form storing messages to MongoDB",
      "Dark/light/system theming",
      "Responsive, accessible UI built with shadcn/ui",
    ],
    challenges:
      "Balancing freshness with performance: using revalidation so admin edits appear quickly without making the public site dynamic on every request.",
    results: null,
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "MongoDB", "Mongoose", "Auth.js"],
    category: "Full Stack",
    thumbnailUrl: null,
    githubUrl: "https://github.com/ramduth-rajesh",
    liveUrl: null,
    featured: true,
    order: 1,
  },
  {
    title: "REST API Task Manager",
    slug: "rest-api-task-manager",
    shortDescription:
      "[Placeholder] A task management API with auth, roles, and filtering.",
    description:
      "[Placeholder] Describe a real backend project here — endpoints, auth strategy, data model, and what it does. Replace this from the Admin Panel.",
    problem: null,
    solution: null,
    features: [
      "[Placeholder] JWT authentication",
      "[Placeholder] CRUD endpoints with validation",
      "[Placeholder] Pagination and filtering",
    ],
    challenges: null,
    results: null,
    technologies: ["Node.js", "Express.js", "MongoDB", "REST"],
    category: "Backend",
    thumbnailUrl: null,
    githubUrl: "https://github.com/ramduth-rajesh",
    liveUrl: null,
    featured: false,
    order: 2,
  },
  {
    title: "Analytics Dashboard UI",
    slug: "analytics-dashboard-ui",
    shortDescription:
      "[Placeholder] A responsive analytics dashboard with charts and dark mode.",
    description:
      "[Placeholder] Describe a real frontend project here — the goal, the UI challenges, and the outcome. Replace this from the Admin Panel.",
    problem: null,
    solution: null,
    features: [
      "[Placeholder] Interactive charts",
      "[Placeholder] Responsive layout",
      "[Placeholder] Theme switching",
    ],
    challenges: null,
    results: null,
    technologies: ["React", "TypeScript", "Tailwind CSS", "Recharts"],
    category: "Frontend",
    thumbnailUrl: null,
    featured: false,
    order: 3,
  },
];

// (placeholder content — replaced via Admin Panel once MongoDB is connected)

export const placeholderServices: Service[] = [
  {
    title: "Full Stack Web Development",
    description:
      "End-to-end web applications — from database schema to deployed UI — built on the modern JavaScript stack.",
    icon: "layers",
    order: 1,
    active: true,
  },
  {
    title: "Frontend Development",
    description:
      "Responsive, accessible, fast interfaces with React, Next.js, and Tailwind CSS.",
    icon: "palette",
    order: 2,
    active: true,
  },
  {
    title: "Backend & API Development",
    description:
      "Well-documented REST APIs and server-side logic with Node.js and Express.",
    icon: "server",
    order: 3,
    active: true,
  },
  {
    title: "Database Design",
    description:
      "Practical MongoDB and SQL data models, tuned for the queries your app actually makes.",
    icon: "database",
    order: 4,
    active: true,
  },
  {
    title: "Web Application Development",
    description:
      "From idea to production: architecture, implementation, deployment, and iteration.",
    icon: "rocket",
    order: 5,
    active: true,
  },
  {
    title: "Website Maintenance",
    description:
      "Dependency updates, performance passes, bug fixes, and content changes for existing sites.",
    icon: "wrench",
    order: 6,
    active: true,
  },
];

export const placeholderEducation: Education[] = [
  {
    degree: "[Placeholder] Your Degree",
    institution: "[Placeholder] Institution",
    startYear: 2019,
    endYear: 2023,
    description:
      "[Placeholder] Add your education details from the Admin Panel → Education.",
    order: 1,
  },
];

export const placeholderSocialLinks: SocialLinkItem[] = [
  { platform: "GitHub", url: "https://github.com/ramduth-rajesh", order: 1, active: true },
  { platform: "LinkedIn", url: "https://www.linkedin.com/in/ramduth-rajesh", order: 2, active: true },
  { platform: "Email", url: "mailto:ramduth.rajesh@example.com", order: 3, active: true },
];
