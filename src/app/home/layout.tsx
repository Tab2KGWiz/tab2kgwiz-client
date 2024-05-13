"use client";

import PageAppBar from "../components/app-bar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageAppBar></PageAppBar>
      {children}
    </>
  );
}
