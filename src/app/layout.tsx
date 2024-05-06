import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SnackBarProvider } from "./components/snackbar-provider";

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
        <body className={inter.className}>{children}</body>
      </SnackBarProvider>
    </html>
  );
}
