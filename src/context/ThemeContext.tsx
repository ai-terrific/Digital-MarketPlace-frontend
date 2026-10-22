import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";
import { createAppTheme } from "../theme";
import { THEME_STORAGE_KEY } from "@/constants";
import { ThemeMode, type ThemeContextType } from "@/types";

const ThemeContext = createContext<ThemeContextType>({
  mode: ThemeMode.Dark,
  toggleTheme: () => {},
});

const getSavedThemeMode = (): ThemeMode => {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);

    return saved === ThemeMode.Light ? ThemeMode.Light : ThemeMode.Dark;
  } catch {
    return ThemeMode.Dark;
  }
};

export const useThemeMode = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [mode, setMode] = useState<ThemeMode>(getSavedThemeMode);

  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {
      // Theme remains available for the current session when storage is blocked.
    }
    document.documentElement.className = mode;
  }, [mode]);

  const toggleTheme = () =>
    setMode((prev) =>
      prev === ThemeMode.Dark ? ThemeMode.Light : ThemeMode.Dark,
    );
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
