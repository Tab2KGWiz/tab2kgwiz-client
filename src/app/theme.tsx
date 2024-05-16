"use client";

import { createTheme } from "@mui/material/styles";

export const CustomTheme = createTheme({
  palette: {
    primary: {
      main: "#556cd6",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: "#f44336",
    },
    background: {
      default: "#f3f4f6",
    },
  },
});
