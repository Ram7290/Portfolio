import "server-only";

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { withDb } from "@/lib/mongodb";
import { AdminModel } from "@/models";

/**
 * Auth.js (NextAuth v5) configuration.
 * - Credentials provider backed by the Admin collection in MongoDB.
 * - ADMIN_EMAIL/ADMIN_PASSWORD env vars seed the admin user.
 * - Route protection happens in proxy.ts + layout-level auth() checks.
 */

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Dev-only fallback so the app runs before AUTH_SECRET is configured;
  // production builds still require a real AUTH_SECRET.
  secret:
    process.env.AUTH_SECRET ||
    (process.env.NODE_ENV !== "production"
      ? "dev-only-insecure-secret-do-not-use-in-production"
      : undefined),
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  trustHost: true,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "")
          .trim()
          .toLowerCase();
        const password = String(credentials?.password ?? "");

        if (!email || !password) return null;

        let admin = await withDb(async () =>
          AdminModel.findOne({ email }).lean(),
        );

        // Bootstrap: if no admin exists yet, create the first one from
        // ADMIN_EMAIL/ADMIN_PASSWORD env vars on matching login attempt.
        if (!admin) {
          const envEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
          const envPassword = process.env.ADMIN_PASSWORD;
          if (envEmail && envPassword && email === envEmail) {
            const created = await withDb(async () =>
              AdminModel.create({
                email: envEmail,
                name: "Ramduth Rajesh",
                passwordHash: await bcrypt.hash(envPassword, 12),
              }),
            );
            if (created) {
              admin = created;
            }
          }
        }
        if (!admin) return null;

        const ok = await bcrypt.compare(password, admin.passwordHash);
        if (!ok) return null;

        return { id: String(admin._id), name: admin.name, email: admin.email };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id ?? null;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && typeof token.id === "string") {
        session.user.id = token.id;
      }
      return session;
    },
  },
});
