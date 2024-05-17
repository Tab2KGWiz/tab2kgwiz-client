import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SnackBarProvider } from "./components/snackbar-provider";
import { FileProvider } from "./components/file-provider";
import { ThemeProvider } from "@mui/material/styles";
import { CustomTheme } from "./theme";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
}
