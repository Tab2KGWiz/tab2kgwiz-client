"use client";

import React, { useEffect } from "react";
import UploadFile from "../../ui/file-input/upload-file";
import Table from "../../components/table";
import { formatAssigner } from "../../lib/formatAssigner";
import { LoadingSkeleton } from "../../ui/loading-skeleton";
import { createNewMapping } from "../../services/createNewMapping";
import { createNewColumn } from "../../services/createNewColumn";
import { useSnackBar } from "../../components/snackbar-provider";
import { useFile } from "../../components/file-provider";
import PageAppBar from "../../components/app-bar";
import Button from "@mui/material/Button";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import Box from "@mui/material/Box";
import { Container, Grid, Stack } from "@mui/material";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import { useRouter } from "next/navigation";

interface Props {}

const MappingPage: React.FC<Props> = (props): JSX.Element => {
  const { file, setFile } = useFile();
  const [header, setHeader] = React.useState<string[] | undefined>();
  const [row, setRow] = React.useState<string[][]>([]);

  const [currentPage, setCurrentPage] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);

  const [isLoading, setIsLoading] = React.useState(false);

  const [headerMapping, setHeaderMapping] = React.useState<Map<string, string>>(
    new Map(),
  );

  const router = useRouter();

  const [mappingId, setMappingId] = React.useState<number>(-1);

  const { showSnackBar } = useSnackBar();

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
  }, [file]);

  useEffect(() => {
    if (!file) return;

    const processFile = async () => {
      setIsLoading(true);

      //showSnackBar("File uploaded successfully. Processing...", "info");

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

        const headers = df.head().columns;

        // Replace all null (blank) ceil with a "-" and get the first 20 rows
        const reformatedDf = df.head(20).fillNa("-");

        const id = await createNewMapping(file, reformatedDf);

        if (id === -1) {
          showSnackBar(
            "Error occurred while creating the mapping. Please try again.",
            "error",
          );
          setFile(null);
          router.push("/home/upload");
          return;
        }
        setMappingId(id);

        showSnackBar("Mapping created successfully.", "success");

        const rowsWithoutNull = reformatedDf.values as string[][];
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

          if ((await createNewColumn(id, columnsData)) === -1) {
            showSnackBar("Error occurred while creating the column.", "error");
            setFile(null);
            router.push("/home/upload");
            return;
          }
          showSnackBar("Column created successfully.", "success");
        });
        setHeaderMapping(headerMapping);
      } catch (error) {
        showSnackBar("An error occurred while processing the file.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    processFile();
  }, [file]);

  return (
    <>
      <br />
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
              mappingName={file?.name.replace(/\s+/g, "")}
              mappingFile={file}
              mappingId={mappingId}
            />
          )}
        </>
      )}
    </>
  );
};

export default MappingPage;
