import React, { createContext, useContext, useMemo } from 'react';
import { LightColors, DarkColors } from './colors';
import type { ColorScheme } from './colors';

interface ThemeContextValue {
  isDark: boolean;
  colors: ColorScheme;
}

const ThemeContext = createContext<ThemeContextValue>({
  isDark: false,
  colors: LightColors,
});

export function ThemeProvider({
  isDark,
  children,
}: {
  isDark: boolean;
  children: React.ReactNode;
}) {
  const value = useMemo<ThemeContextValue>(
    () => ({
      isDark,
      colors: isDark ? DarkColors : LightColors,
    }),
    [isDark]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
