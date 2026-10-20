import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";
import { createAppTheme } from "./theme";
import { THEME_STORAGE_KEY } from "@/constants";
import type { ThemeContextType, ThemeMode } from "@/types";

const ThemeContext = createContext<ThemeContextType>({
  mode: "dark",
  toggleTheme: () => {},
});

export const useThemeMode = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    
return saved === "light" || saved === "dark" ? saved : "dark";
  });

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
    document.documentElement.className = mode;
  }, [mode]);

  const toggleTheme = () =>
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  const theme = createAppTheme(mode);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
