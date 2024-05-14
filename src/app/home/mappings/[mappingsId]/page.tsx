"use client";

import { useFile } from "@/app/components/file-provider";
import { formatAssigner } from "@/app/lib/formatAssigner";
import { createNewColumn } from "@/app/services/createNewColumn";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSnackBar } from "@/app/components/snackbar-provider";
import { LoadingSkeleton } from "@/app/ui/loading-skeleton";
import Table from "@/app/components/table";
import useSWR from "swr";
import axios from "axios";
import Cookies from "js-cookie";

const MappingsPage: React.FC<{ params: { mappingsId: string } }> = ({
  params,
}): JSX.Element => {
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

  const { mappingsId } = params;

  const [mappingIdHook, setMappingIdHook] = React.useState<number>(
    Number(mappingsId),
  );

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

  useCreateMappingSWR(
    file,
    setIsLoading,
    setHeader,
    setRow,
    mappingIdHook,
    showSnackBar,
    setFile,
    router,
    setHeaderMapping,
  );

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
              mappingId={mappingIdHook}
            />
          )}
        </>
      )}
    </>
  );
};

export default MappingsPage;

const useCreateMappingSWR = (
  file: File | null,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setHeader: React.Dispatch<React.SetStateAction<string[] | undefined>>,
  setRow: React.Dispatch<React.SetStateAction<string[][]>>,
  mappingIdHook: number,
  showSnackBar: (message: string, type: "success" | "error") => void,
  setFile: React.Dispatch<React.SetStateAction<File | null>>,
  router: ReturnType<typeof useRouter>,
  setHeaderMapping: React.Dispatch<React.SetStateAction<Map<string, string>>>,
) => {
  const shouldFetch = !!file; // Only fetch if file available

  const { data, error } = useSWR(
    shouldFetch ? ` ` : null,
    async () => {
      if (!file) return;

      setIsLoading(true);
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

          try {
            axios.defaults.headers.common["Authorization"] =
              `Bearer ${Cookies.get("accessToken")}`;
            const response = await axios.post(
              `http://localhost:8080/mappings/${mappingIdHook}/columns`,
              columnsData,
            );

            if (response.status === 200) {
              showSnackBar("Column created successfully.", "success");
            } else {
              showSnackBar(
                "Error occurred while creating the column.",
                "error",
              );
              setFile(null);
              router.push("/home/upload");
              return;
            }
          } catch (error) {
            return -1;
          }
        });
        setHeaderMapping(headerMapping);
      } catch (error) {
        showSnackBar("An error occurred while processing the file.", "error");
      } finally {
        setIsLoading(false);
      }
    },
    {
      revalidateOnFocus: false, // Avoid unnecessary refetches on focus
    },
  );

  return { data, error };
};
