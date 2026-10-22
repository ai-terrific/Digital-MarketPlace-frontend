import { createTheme, Theme } from "@mui/material/styles";
import { FONT_FAMILIES } from "@/constants";

export const createAppTheme = (mode: "light" | "dark"): Theme => {
  const isDark = mode === "dark";

  return createTheme({
    palette: {
      mode,
      primary: {
        main: "#0EA5E9",
        light: "#38BDF8",
        dark: "#0284C7",
      },
      secondary: {
        main: "#06B6D4",
      },
      background: {
        default: isDark ? "#0A0F1C" : "#F0F9FF",
        paper: isDark ? "#0F172A" : "#FFFFFF",
      },
      text: {
        primary: isDark ? "#E0F2FE" : "#0C4A6E",
        secondary: isDark ? "#7DD3FC" : "#475569",
      },
      divider: isDark ? "rgba(14, 165, 233, 0.12)" : "rgba(14, 165, 233, 0.1)",
      error: { main: "#EF4444" },
      success: { main: "#10B981" },
      warning: { main: "#F59E0B" },
      info: { main: "#0EA5E9" },
    },
    typography: {
      fontFamily: FONT_FAMILIES.body,
      h1: {
        fontFamily: FONT_FAMILIES.heading,
        fontWeight: 700,
        letterSpacing: "-0.02em",
      },
      h2: {
        fontFamily: FONT_FAMILIES.heading,
        fontWeight: 700,
        letterSpacing: "-0.02em",
      },
      h3: {
        fontFamily: FONT_FAMILIES.heading,
        fontWeight: 600,
        letterSpacing: "-0.01em",
      },
      h4: {
        fontFamily: FONT_FAMILIES.heading,
        fontWeight: 600,
        letterSpacing: "-0.01em",
      },
      h5: { fontFamily: FONT_FAMILIES.heading, fontWeight: 600 },
      h6: { fontFamily: FONT_FAMILIES.heading, fontWeight: 600 },
      subtitle2: { fontFamily: FONT_FAMILIES.heading, fontWeight: 600 },
      button: {
        fontFamily: FONT_FAMILIES.body,
        fontWeight: 600,
        textTransform: "none",
      },
    },
    shape: { borderRadius: 14 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            padding: "10px 24px",
            fontWeight: 600,
            fontSize: "0.9rem",
            "&.MuiButton-containedPrimary": {
              background: "linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)",
              boxShadow: "0 4px 14px rgba(14, 165, 233, 0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #0284C7 0%, #0891B2 100%)",
                boxShadow: "0 6px 20px rgba(14, 165, 233, 0.4)",
              },
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            border: `1px solid ${isDark ? "rgba(14, 165, 233, 0.1)" : "rgba(14, 165, 233, 0.08)"}`,
            boxShadow: isDark
              ? "0 4px 24px rgba(0,0,0,0.3)"
              : "0 2px 12px rgba(14, 165, 233, 0.08)",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: 8, fontWeight: 500 },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: { borderRadius: 12 },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderColor: isDark
              ? "rgba(14, 165, 233, 0.08)"
              : "rgba(14, 165, 233, 0.06)",
          },
        },
      },
    },
  });
};
