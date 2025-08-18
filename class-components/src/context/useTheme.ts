import { useContext } from 'react';
import type { ThemeContextProps } from './ThemeContextBase';
import { ThemeContext } from './ThemeContextBase';

export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
