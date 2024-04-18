"use client";

import React, { useEffect } from "react";
import UploadFile from "../ui/file-input/upload-file";
import Table from "../components/table";
import { formatAssigner } from "../lib/formatAssigner";
import { LoadingSkeleton } from "../ui/loading-skeleton";
import Alerts from "../components/alerts";
import CreateMapping from "../services/create-mapping";

const UploadFileComp = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [header, setHeader] = React.useState<string[] | undefined>();
  const [row, setRow] = React.useState<string[][]>([]);

  const [currentPage, setCurrentPage] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);

  const [isLoading, setIsLoading] = React.useState(false);

  const [isError, setIsError] = React.useState(false);

  const [headerMapping, setHeaderMapping] = React.useState<Map<string, string>>(
    new Map(),
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    setTotalPages(Math.ceil(row.length / pageSize));
  }, [row, pageSize]);

  useEffect(() => {
    setHeader(undefined);
    setRow([]);
    setHeaderMapping(new Map());
    setIsError(false);
  }, [file]);

  useEffect(() => {
    if (file) {
      if (file?.type !== "text/csv") {
        setIsError(true);
        return console.log("Invalid file type");
      }

      (async () => {
        try {
          const mappingData = {
            title: file.name,
          };

          const newMapping = await CreateMapping.createMapping(mappingData);

          console.log("Mapping created: ", newMapping);
        } catch (error) {
          console.error("Error creating mapping: ", error);
        }
      })();

      (async () => {
        setIsLoading(true);
        const dfd = await import("danfojs");

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
            headers.forEach((header, index) => {
              // Check and assign the format of the data and set the format to the Mapç
              formatAssigner(rowsWithoutNull, index, headerMapping, header);
            });
            setHeaderMapping(headerMapping);
          })
          .catch((error) => {
            console.log(error);
          })
          .finally(() => {
            setIsLoading(false);
          });
      })();
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

      {isError ? (
        <Alerts
          message="Invalid file type. Please upload a CSV file"
          type="error"
        />
      ) : isLoading ? (
        <LoadingSkeleton />
      ) : (
        <>
          {header && (
            <Table
              header={header}
              body={row.slice(
                currentPage * pageSize,
                (currentPage + 1) * pageSize,
              )}
              page={currentPage}
              pages={totalPages}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              previousText="Previous"
              nextText="Next"
              headerMapping={headerMapping}
              setHeaderMapping={setHeaderMapping}
              totalRows={row.length}
            />
          )}
        </>
      )}
    </div>
  );
};

export default UploadFileComp;
