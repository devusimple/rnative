import React, { createContext, useContext, useMemo, useState } from "react";
import { colors, type ColorScheme } from "@rnative/tokens";

export type Theme = {
  scheme: ColorScheme;
  colors: (typeof colors)[ColorScheme];
};

export type ThemeContextValue = {
  theme: Theme;
  setScheme: (scheme: ColorScheme) => void;
  toggleScheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export type ThemeProviderProps = {
  initialScheme?: ColorScheme;
  children: React.ReactNode;
};

export function ThemeProvider({ initialScheme = "light", children }: ThemeProviderProps) {
  const [scheme, setScheme] = useState<ColorScheme>(initialScheme);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: { scheme, colors: colors[scheme] },
      setScheme,
      toggleScheme: () => setScheme((s) => (s === "light" ? "dark" : "light")),
    }),
    [scheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeContext(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}