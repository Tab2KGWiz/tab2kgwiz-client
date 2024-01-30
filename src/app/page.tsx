import React from "react";
import { lusitana } from "@/app/ui/fonts";
import UploadFileComp from "./components/upload-file";

const Home = () => {
  return (
    <main className="flex min-h-screen flex-col p-6 bg-white">
      <h1
        className={`${lusitana.className} mb-4 text-xl text-black md:text-2xl`}
      >
        Home
      </h1>
      <UploadFileComp />
    </main>
  );
};

export default Home;
