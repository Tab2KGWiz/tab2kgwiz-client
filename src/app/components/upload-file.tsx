"use client";

import React from "react";
import UploadFile from "../ui/file-input/upload-file";

const UploadFileComp = () => {
  const [file, setFile] = React.useState<File | null>(null);

  const handleChange = (newFile: File | null) => {
    setFile(newFile);
  };

  return <UploadFile />;
};

export default UploadFileComp;
