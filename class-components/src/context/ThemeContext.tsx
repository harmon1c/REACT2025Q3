'use client';

import { useEffect, useState } from 'react';
import { useHasMounted } from '@/hooks/useHasMounted';
import { ThemeContext } from './ThemeContextBase';
import type { Theme } from './ThemeContextBase';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  // eslint-disable-next-line react/prop-types
  children,
}) => {
  const hasMounted = useHasMounted();

  function getSystemTheme(): Theme {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return 'dark';
    }
    return 'light';
  }

  const [theme, setThemeState] = useState<Theme>('light');
  const [userSelected, setUserSelected] = useState<boolean>(false);

  useEffect(() => {
    if (hasMounted && typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') {
        setThemeState(saved);
        setUserSelected(true);
      } else {
        setThemeState(getSystemTheme());
        setUserSelected(false);
      }
    }
  }, [hasMounted]);

  useEffect((): void => {
    if (typeof window !== 'undefined') {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);
      if (userSelected) {
        localStorage.setItem('theme', theme);
      } else {
        localStorage.removeItem('theme');
      }
    }
  }, [theme, userSelected]);

  useEffect(() => {
    if (typeof window !== 'undefined' && !userSelected) {
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = (): void => setThemeState(getSystemTheme());
      mql.addEventListener('change', handler);
      return (): void => {
        mql.removeEventListener('change', handler);
      };
    }
    return undefined;
  }, [userSelected]);

  const setTheme = (t: Theme): void => {
    setThemeState(t);
    setUserSelected(true);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, userSelected }}>
      {children}
    </ThemeContext.Provider>
  );
};
