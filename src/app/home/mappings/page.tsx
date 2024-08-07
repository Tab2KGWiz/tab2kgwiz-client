"use client";

import React, { useEffect } from "react";
import { useSnackBar } from "../../components/snackbar-provider";
import { useFile } from "../../components/file-provider";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import axios from "axios";
import Cookies from "js-cookie";
import { toCSV } from "danfojs";

interface Props {}

interface MappingResponseData {
  uri: string;
  title: string;
  fileContent: string;
}

const MappingPage: React.FC<Props> = (): JSX.Element => {
  const { file, setFile } = useFile();
  const router = useRouter();
  const { showSnackBar } = useSnackBar();

  const { data, error } = useCreateMappingSWR(file);

  useEffect(() => {
    if (data === -1 || error) {
      showSnackBar(
        "Error occurred while creating the mapping. Please try again.",
        "error",
      );
      setFile(null);
      router.push("/home/upload");
    }

    if (data && data !== -1) {
      const mappingsId = data;
      showSnackBar(`Mapping ID ${mappingsId} created successfully.`, "success");
      router.push(`/home/mappings/${mappingsId}`);
    }
  }, [data]);

  return <></>;
};

const useCreateMappingSWR = (file: File | null) => {
  const url = `${process.env.NEXT_PUBLIC_TAB2KGWIZ_API_URL}/mappings`;
  const shouldFetch = !!file; // Only fetch if file available
  const { showSnackBar } = useSnackBar();

  const { data, error } = useSWR(
    shouldFetch ? url : null,
    async () => {
      if (!file) return;

      try {
        const dfd = await import("danfojs");
        const df = await dfd.readCSV(file, {
          // @ts-ignore - Property 'dynamicTyping' does not exist on type 'CsvOptions', error happens in Next.js app but not in Node.js app
          dynamicTyping: false,
        });

        // Replace all null (blank) ceil with a "-" and get the first 20 rows
        const reformatedDf = df.head(20).fillNa("-");
        const mappingData = {
          title: file.name.replace(/\s+/g, ""),
          fileContent: reformatedDf ? toCSV(reformatedDf) : "",
          fileFormat: file.type.split("/")[1],
          fileName: file.name.replace(/\s+/g, ""),
          isAccessible: false,
        };

        axios.defaults.headers.common["Authorization"] =
          `Bearer ${Cookies.get("accessToken")}`;

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_TAB2KGWIZ_API_URL}/mappings`,
          mappingData,
        );

        if (response.status === 201) {
          const data: MappingResponseData = response.data;

          // Obtain the ID of the mapping by extracting the last number from the URI
          return parseInt(data.uri.match(/\d+$/)?.[0] || "-1");
        }

        return -1;
      } catch (error) {
        showSnackBar("An error occurred while processing the file.", "error");
        return -1;
      }
    },
    {
      revalidateOnFocus: false, // Avoid unnecessary refetches on focus
    },
  );

  return { data, error };
};

export default MappingPage;
