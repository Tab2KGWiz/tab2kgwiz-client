"use client";

import { useFile } from "@/app/components/file-provider";
import { formatAssigner } from "@/app/lib/formatAssigner";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSnackBar } from "@/app/components/snackbar-provider";
import { LoadingSkeleton } from "@/app/ui/loading-skeleton";
import Table from "@/app/components/table/table";
import useSWR from "swr";
import axios from "axios";
import Cookies from "js-cookie";
import MappingResponseData from "@/app/utils/mappingResponseData";
import MeasurementColumnData from "@/app/utils/measurementColumnData";

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
  const [CSVFile, setCSVFile] = React.useState<File | null>(null);
  const [isAccessible, setIsAccessible] = React.useState(false);
  const [mappingTitle, setMappingTitle] = React.useState<string>("");
  const [columnsData, setColumnsData] = React.useState<MeasurementColumnData[]>(
    [],
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

  useGetMappingSWR(
    setIsLoading,
    setHeader,
    setRow,
    mappingIdHook,
    showSnackBar,
    router,
    setHeaderMapping,
    setCSVFile,
    setIsAccessible,
    setMappingTitle,
    setColumnsData,
    columnsData,
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
              mappingName={CSVFile?.name}
              mappingFile={CSVFile}
              mappingId={mappingIdHook}
              isAccessible={isAccessible}
              setIsAccessible={setIsAccessible}
              mappingTitle={mappingTitle}
              setMappingTitle={setMappingTitle}
              columnsData={columnsData}
              setColumnsData={setColumnsData}
            />
          )}
        </>
      )}
    </>
  );
};

export default MappingsPage;

const useGetMappingSWR = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setHeader: React.Dispatch<React.SetStateAction<string[] | undefined>>,
  setRow: React.Dispatch<React.SetStateAction<string[][]>>,
  mappingIdHook: number,
  showSnackBar: (message: string, type: "success" | "error") => void,
  router: ReturnType<typeof useRouter>,
  setHeaderMapping: React.Dispatch<React.SetStateAction<Map<string, string>>>,
  setCSVFile: React.Dispatch<React.SetStateAction<File | null>>,
  setIsAccessible: React.Dispatch<React.SetStateAction<boolean>>,
  setMappingTitle: React.Dispatch<React.SetStateAction<string>>,
  setColumnsData: React.Dispatch<
    React.SetStateAction<MappingResponseData["columns"]>
  >,
  columnsData: MappingResponseData["columns"],
) => {
  const { data, error } = useSWR(
    " ",
    async () => {
      setIsLoading(true);

      axios.defaults.headers.common["Authorization"] =
        `Bearer ${Cookies.get("accessToken")}`;
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_TAB2KGWIZ_API_URL}/mappings/${mappingIdHook}`,
      );

      if (response.status !== 200) {
        showSnackBar(
          `Error occurred while fetching the mapping with ID ${mappingIdHook}.`,
          "error",
        );
        router.push("/home/upload");
        return;
      }
      const responseData: MappingResponseData = response.data;

      const file: File = new File(
        [responseData.fileContent],
        `${responseData.fileName}`,
      );

      setIsAccessible(responseData.accessible);
      setMappingTitle(responseData.title);

      const username = Cookies.get("username");
      const mappingUser = responseData.providedBy.split("/")[2];

      if (username !== mappingUser) {
        showSnackBar("You do not have access to edit this mapping.", "error");
        router.push("/home/board");
      }

      setCSVFile(file);

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

        if (responseData.columns.length === 0) {
          const tempColumnsData: MappingResponseData["columns"] = [
            ...columnsData,
          ];
          headers.forEach(async (header, index) => {
            // Check and assign the format of the data and set the format to the Map
            formatAssigner(rowsWithoutNull, index, headerMapping, header);
            const data: MeasurementColumnData = {
              id: undefined,
              title: header,
              dataType: `xsd:${headerMapping.get(header)}`,
              ontologyPrefix: undefined,
              measurement: false,
              identifier: false,
              ontologyType: undefined,
              ontologyURI: undefined,
              label: undefined,
              prefix: undefined,
              isMeasurementOf: undefined,
              hasTimestamp: undefined,
              hasUnit: undefined,
              measurementMadeBy: undefined,
              relatedTo: undefined,
              relatesToProperty: undefined,
              relationShip: undefined,
            };

            tempColumnsData.push(data);
          });
          setColumnsData(tempColumnsData);
          setHeaderMapping(headerMapping);
        } else {
          responseData.columns.forEach((column) => {
            headerMapping.set(
              column.title,
              column.dataType ? column.dataType.split(":")[1] : "",
            );
          });
          setHeaderMapping(headerMapping);
          setColumnsData(responseData.columns);
        }
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
