"use client";

import React from "react";
import UploadFile from "../ui/file-input/upload-file";

const UploadFileComp = () => {
  const [file, setFile] = React.useState<File | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = event.target.files && event.target.files[0];
    setFile(newFile);
  };

  console.log(file);
  return <UploadFile handleChange={handleChange} />;
};

export default UploadFileComp;
