import { Inter } from "next/font/google";
import "./globals.css";
import { SnackBarProvider } from "./components/snackbar-provider";
import { FileProvider } from "./components/file-provider";
import { ThemeProvider } from "@mui/material/styles";
import { CustomTheme } from "./theme";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <ThemeProvider theme={CustomTheme}>
        <SnackBarProvider>
          <FileProvider>
            <body className={`${inter.className} fixed inset-0 bg-gray-100`}>
              {children}
            </body>
          </FileProvider>
        </SnackBarProvider>
      </ThemeProvider>
    </html>
  );
};

export default RootLayout;
