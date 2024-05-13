import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SnackBarProvider } from "./components/snackbar-provider";
import { FileProvider } from "./components/file-provider";
import AppLayout from "./components/Layout/app-layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tab2KGWiz",
  description: "Tabular Data to Knowledge Graph Wizard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SnackBarProvider>
        <FileProvider>
          <body className={`${inter.className} fixed inset-0 bg-gray-100`}>
            {children}
          </body>
        </FileProvider>
      </SnackBarProvider>
    </html>
  );
}
