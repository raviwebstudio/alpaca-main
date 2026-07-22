import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        if (credentials.email === "admin@alpaca.com" && credentials.password === "admin123") {
          return { id: "1", name: "Admin", email: "admin@alpaca.com", role: "ADMIN" };
        }

        if (credentials.email === "user@alpaca.com" && credentials.password === "user123") {
          return { id: "2", name: "User", email: "user@alpaca.com", role: "USER" };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
