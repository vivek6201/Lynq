'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@org/ui/components/ui/button';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch by rendering only after mounting on client
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9" />;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="w-9 h-9 text-zinc-500 hover:text-yellow-500 dark:hover:text-yellow-400 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
    >
      {theme === 'dark' ? (
        <Sun className="w-[1.2rem] h-[1.2rem]" />
      ) : (
        <Moon className="w-[1.2rem] h-[1.2rem]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
