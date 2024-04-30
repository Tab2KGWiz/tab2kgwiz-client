"use client";

import React, { useEffect } from "react";
import UploadFile from "../ui/file-input/upload-file";
import Table from "../components/table";
import { formatAssigner } from "../lib/formatAssigner";
import { LoadingSkeleton } from "../ui/loading-skeleton";
import Alerts from "../components/alerts";
import { createNewMapping } from "../services/createNewMapping";
import { createNewColumn } from "../services/createNewColumn";

const UploadFileComp = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [header, setHeader] = React.useState<string[] | undefined>();
  const [row, setRow] = React.useState<string[][]>([]);

  const [currentPage, setCurrentPage] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);

  const [isLoading, setIsLoading] = React.useState(false);

  const [headerMapping, setHeaderMapping] = React.useState<Map<string, string>>(
    new Map(),
  );

  const [alertState, setAlertState] = React.useState("");

  const [alertMessage, setAlertMessage] = React.useState("");

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
    setAlertState("");
  }, [file]);

  useEffect(() => {
    if (!file) return;

    if (file.type !== "text/csv") {
      setAlertState("Error");
      setAlertMessage("Invalid file type. Please upload a CSV file.");
      return;
    } else if (file.size > 10000000) {
      // Allow only files less than 10MB
      setAlertState("Error");
      setAlertMessage("File size too large");
      return;
    }

    const processFile = async () => {
      setIsLoading(true);
      setAlertState("Success");
      setAlertMessage("File uploaded successfully. Processing...");

      const columnsData = {
        title: "",
        dataType: "",
        ontologyType: "",
      };

      try {
        const dfd = await import("danfojs");
        const df = await dfd.readCSV(file, {
          // @ts-ignore - Property 'dynamicTyping' does not exist on type 'CsvOptions', error happens in Next.js app but not in Node.js app
          dynamicTyping: false,
        });

        if ((await createNewMapping(file, df)) === -1) {
          setAlertState("Error");
          setAlertMessage(
            "Error occurred while creating the mapping. Please try again.",
          );
          setFile(null);
          return;
        }

        const headers = df.head().columns;
        // Replace all null (blank) ceil with a "-"
        const rowsWithoutNull = df.fillNa("-").values as string[][];
        setHeader(headers);
        setRow(rowsWithoutNull);

        const headerMapping = new Map<string, string>();
        headers.forEach(async (header, index) => {
          // Remove all blank spaces and convert to lowercase
          const ontologyType = header.split(" ").join("").toLowerCase();
          columnsData.title = header;
          columnsData.ontologyType = ontologyType;

          // Check and assign the format of the data and set the format to the Map
          formatAssigner(rowsWithoutNull, index, headerMapping, header);
          columnsData.dataType =
            "xsd:" + headerMapping.get(header) || "undefined";

          if ((await createNewColumn(columnsData)) === -1) {
            setAlertState("Error");
            setAlertMessage(
              "Error occurred while creating the column. Please try again.",
            );
            setFile(null);
            return;
          }
        });
        setHeaderMapping(headerMapping);
      } catch (error) {
        setAlertState("Error");
        setAlertMessage(
          "An error occurred while processing the file. Please try again.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    processFile();
  }, [file]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = event.target.files && event.target.files[0];
    setFile(newFile);
  };

  return (
    <div className="fixed inset-0 bg-gray-100">
      <UploadFile handleChange={handleChange} />
      <br />

      {alertState && (
        <Alerts
          message={alertMessage}
          type={alertState}
          setAlertState={setAlertState}
        />
      )}

      {isLoading ? (
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
