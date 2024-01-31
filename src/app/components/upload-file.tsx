"use client";

import React, { useEffect } from "react";
import UploadFile from "../ui/file-input/upload-file";
import Table from "../ui/table/table";

const UploadFileComp = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [header, setHeader] = React.useState<string[] | undefined>();
  const [row, setRow] = React.useState<string[][]>([]);

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      const blob = new Blob([file], { type: file?.type });

      reader.readAsText(blob);

      reader.onload = () => {
        const result = reader.result?.toString();
        const lines = result?.split("\n");

        if (lines && lines.length > 1) {
          const headers = lines[0].split(",");
          const rows = lines.slice(1).map((line) => line.split(","));
          setHeader(headers);
          setRow(rows);
        }
      };

      reader.onerror = () => {
        console.log(reader.error);
      };
    }
  }, [file]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = event.target.files && event.target.files[0];
    setFile(newFile);
  };

  return (
    <div>
      <UploadFile handleChange={handleChange} />
      <br />
      {header && <Table header={header} body={row} />}
    </div>
  );
};

export default UploadFileComp;
