import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

// Helper to decode signed JWT payload in client-safe JavaScript
const parseJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

const {
  handlers: authHandlers,
  signIn: authSignIn,
  signOut: authSignOut,
  auth,
} = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        sessionToken: { label: 'Session Token', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.sessionToken) return null;

        const claims = parseJwt(credentials.sessionToken as string);
        if (claims && claims.user_id) {
          return {
            id: claims.user_id,
            sessionToken: credentials.sessionToken as string,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.sessionToken = (user as any).sessionToken;
      }
      if (trigger === 'update' && session?.sessionToken) {
        token.sessionToken = session.sessionToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).sessionToken = token.sessionToken;
      }
      (session as any).sessionToken = token.sessionToken;
      return session;
    },
  },
  pages: {
    signIn: '/auth',
  },
  session: {
    strategy: 'jwt',
  },
  secret:
    process.env.AUTH_SECRET ||
    'development-only-fallback-secret-for-lynq-frontend-app',
});

export const handlers = authHandlers;
export const signIn = authSignIn as any;
export const signOut = authSignOut as any;
