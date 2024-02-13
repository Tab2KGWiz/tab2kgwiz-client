"use client";

import React, { useEffect } from "react";
import UploadFile from "../ui/file-input/upload-file";
import Table from "../ui/table/table";
import { detectXSD } from "../lib/XSDDetector";

import * as dfd from "danfojs";

const UploadFileComp = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [header, setHeader] = React.useState<string[] | undefined>();
  //const [row, setRow] = React.useState<ArrayType2D | ArrayType1D>([]);
  const [row, setRow] = React.useState<string[][]>([]);

  const [currentPage, setCurrentPage] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);

  const [headerMapping, setHeaderMapping] = React.useState<Map<string, string>>(
    new Map(),
  );

  //const [xsdDataType, setXSD] = React.useState<string[]>();
  const xsdDataType = [
    "anyURI",
    "time",
    "dateTime",
    "date",
    "boolean",
    "integer",
    "decimal",
    "float",
    "double",
    "string",
  ];

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    setTotalPages(Math.ceil(row.length / pageSize));
  }, [row, pageSize]);

  useEffect(() => {
    if (file) {
      dfd
        .readCSV(file, {
          // @ts-ignore - Property 'dynamicTyping' does not exist on type 'CsvOptions', error happens in Next.js app but not in Node.js app
          dynamicTyping: false,
        })
        .then((df) => {
          const headers = df.head().columns;
          // Replace all null (blank) ceil with a "-"
          const rowsWithoutNull = df.fillNa("-").values as string[][];
          setHeader(headers);
          setRow(rowsWithoutNull);

          const headerMapping = new Map<string, string>();
          headers.forEach((header, index) =>
            headerMapping.set(header, detectXSD(rowsWithoutNull[0][index])),
          );
          setHeaderMapping(headerMapping);
        })
        .catch((error) => {
          console.log(error);
        });
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
      {header && (
        <Table
          header={header}
          body={row.slice(currentPage * pageSize, (currentPage + 1) * pageSize)}
          page={currentPage}
          pages={totalPages}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          previousText="Previous"
          nextText="Next"
          headerMapping={headerMapping}
          setHeaderMapping={setHeaderMapping}
          xsdDataType={xsdDataType}
        />
      )}
    </div>
  );
};

export default UploadFileComp;
