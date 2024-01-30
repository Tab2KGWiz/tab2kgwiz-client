"use client";

import React from "react";
import UploadFile from "../ui/file-input/upload-file";
import { read } from "fs";

const UploadFileComp = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const reader = new FileReader();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = event.target.files && event.target.files[0];
    setFile(newFile);
  };

  if (file) {
    const blob = new Blob([file], { type: file?.type });
    reader.readAsText(blob);

    reader.onload = () => {
      console.log(reader.result);
    };

    reader.onerror = () => {
      console.log(reader.error);
    };
  }

  return <UploadFile handleChange={handleChange} />;
};

export default UploadFileComp;
