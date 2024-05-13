"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import { useSnackBar } from "../../components/snackbar-provider";
import UploadFile from "../../ui/file-input/upload-file";
import React from "react";
import { useFile } from "../../components/file-provider";

interface Props {}

const UploadFilePage: React.FC<Props> = (props): JSX.Element => {
  const { showSnackBar } = useSnackBar();
  const router = useRouter();

  const { file, setFile } = useFile();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = event.target.files && event.target.files[0];
    setFile(newFile);
  };

  useEffect(() => {
    if (!file) return;

    if (file.type !== "text/csv") {
      showSnackBar("Invalid file type. Please upload a CSV file.", "error");
      setFile(null);
      return;
    } else if (file.size > 10000000) {
      // Allow only files less than 10MB
      showSnackBar("File size too large", "error");
      setFile(null);
      return;
    }
    showSnackBar("File uploaded successfully. Processing...", "info");
    router.push("/home/mapping");
  }, [file]);

  return <UploadFile handleChange={handleChange} />;
};

export default UploadFilePage;
