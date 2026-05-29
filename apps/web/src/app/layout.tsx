import '@org/ui/global.css';
import { ThemeProvider } from '../components/theme-provider';
import { Toaster } from '@org/ui';
import { SessionProvider } from 'next-auth/react';

export const metadata = {
  title: 'Lynq - All your links in one place',
  description:
    'Lynq is a platform that helps you manage all your links in one place.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            {children}
            <Toaster richColors position="bottom-right" />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
