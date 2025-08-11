import { createContext } from 'react';

export type Theme = 'light' | 'dark';

export interface ThemeContextProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  userSelected: boolean;
}

export const ThemeContext = createContext<ThemeContextProps | undefined>(
  undefined
);
