import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyAdminCredentials } from "./services/adminService";

export const authOptions: NextAuthOptions = {
  debug: true, // Enable debugging to see what's happening
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        try {
          console.log("AuthOptions - authorize called with username:", credentials?.username);
          
          if (!credentials?.username || !credentials.password) {
            console.log("Missing credentials");
            return null;
          }
          
          const user = await verifyAdminCredentials(
            credentials.username,
            credentials.password
          );
          
          console.log("Authorization result:", user ? "User found" : "User not found");
          
          if (!user) {
            return null;
          }
          
          // Return user data
          return {
            id: user._id?.toString() || "",
            name: user.name || user.username,
            email: user.email || "",
            username: user.username,
            role: user.role || "admin"
          };
        } catch (error) {
          console.error("Error in authorize function:", error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: "/admin",
    signOut: "/admin",
    error: "/admin",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      // Add user data to token when signing in
      if (user) {
        console.log("JWT callback - Adding user data to token");
        token.username = user.username;
        token.role = user.role;
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Add custom user data to session
      if (token && session.user) {
        console.log("Session callback - Adding token data to session");
        session.user.username = token.username as string;
        session.user.role = token.role as string;
        session.user.id = token.userId as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development",
};
