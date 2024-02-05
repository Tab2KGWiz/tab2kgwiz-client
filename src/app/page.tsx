import React from "react";
import UploadFileComp from "./components/upload-file";

const Home = () => {
  return (
    <main className="flex min-h-screen flex-col p-6 bg-white">
      <h1 className={`font-normal text-gray-500 dark:text-gray-400`}>
        Tab2KGWiz
      </h1>

      <UploadFileComp />
    </main>
  );
};

export default Home;
