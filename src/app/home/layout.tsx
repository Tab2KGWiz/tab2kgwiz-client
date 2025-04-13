"use client";

import { Box, CssBaseline } from "@mui/material";
import PageAppBar from "../components/app-bar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageAppBar></PageAppBar>
      {/* <MiniDrawer></MiniDrawer> */}
      {children}
    </>
  );
}
