import { useEffect, useState } from 'react';
import { ThemeContext } from './ThemeContextBase';
import type { Theme } from './ThemeContextBase';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  // eslint-disable-next-line react/prop-types
  children,
}) => {
  function getSystemTheme(): Theme {
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return 'dark';
    }
    return 'light';
  }

  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
    return getSystemTheme();
  });
  const [userSelected, setUserSelected] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'light' || saved === 'dark';
  });

  useEffect((): void => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    if (userSelected) {
      localStorage.setItem('theme', theme);
    } else {
      localStorage.removeItem('theme');
    }
  }, [theme, userSelected]);

  useEffect(() => {
    if (!userSelected) {
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
