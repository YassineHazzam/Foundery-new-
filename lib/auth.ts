// lib/auth.ts — NextAuth config. Credentials provider checks against the
// same bcrypt-hashed passwords migrated from the legacy app, so existing
// users can log in without a password reset.
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import type { SessionUser, SessionRole } from "@/lib/permissions";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/connexion" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { roles: true },
        });
        if (!user?.passwordHash) return null;
        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) return null;
        if (user.status !== "active") return null;

        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
          roles: user.roles.map((r): SessionRole => ({
            role: r.role as SessionRole["role"],
            scopeType: r.scopeType as SessionRole["scopeType"],
            scopeId: r.scopeId,
            status: r.status as SessionRole["status"],
          })),
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.roles = (user as any).roles;
      return token;
    },
    async session({ session, token }) {
      (session.user as any).id = token.sub;
      (session.user as any).roles = token.roles;
      return session;
    },
  },
};

// Helper to turn a NextAuth session into the SessionUser shape permissions.ts expects.
export function toSessionUser(session: { user: { id: string; roles: SessionRole[] } } | null): SessionUser | null {
  if (!session?.user) return null;
  return { id: session.user.id, roles: session.user.roles || [] };
}
