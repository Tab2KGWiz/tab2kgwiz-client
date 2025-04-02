"use client";

import React, { useEffect, useState } from "react";
import { useSnackBar } from "../../components/snackbar-provider";
import { useFile } from "../../components/file-provider";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import axios from "axios";
import Cookies from "js-cookie";
import convertToCSV from "@/app/utils/convertToCSV";

interface Props {}

interface MappingResponseData {
  uri: string;
  title: string;
  fileContent: string;
}

const useCreateMappingSWR = (file: File | null) => {
  const url = `${process.env.NEXT_PUBLIC_TAB2KGWIZ_API_URL}/mappings`;
  const shouldFetch = !!file; // Only fetch if a file is available
  const { showSnackBar } = useSnackBar();

  const { data, error } = useSWR(
    shouldFetch ? url : null,
    async () => {
      if (!file) return;

      try {
        // Use the convertToCSV helper for all supported file types
        const csvContent = await convertToCSV(file);

        const mappingData = {
          title: file.name.replace(/\s+/g, ""),
          fileContent: csvContent,
          fileFormat: "csv",
          fileName: file.name.replace(/\s+/g, ""),
          isAccessible: false,
        };

        axios.defaults.headers.common["Authorization"] =
          `Bearer ${Cookies.get("accessToken")}`;

        const response = await axios.post(url, mappingData);

        if (response.status === 201) {
          const data: MappingResponseData = response.data;
          // Extract the mapping ID from the URI
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

const MappingPage: React.FC<Props> = (): JSX.Element => {
  const { file, setFile } = useFile();
  const router = useRouter();
  const { showSnackBar } = useSnackBar();
  const { data, error } = useCreateMappingSWR(file);

  // Local flag to ensure we handle navigation only once
  const [hasHandled, setHasHandled] = useState(false);

  useEffect(() => {
    // Only run if we haven't handled the result yet and a file exists
    if (hasHandled || !file) return;

    if (data === -1 || error) {
      setHasHandled(true);
      showSnackBar(
        "Error occurred while creating the mapping. Please try again.",
        "error",
      );
      setFile(null);
      router.push("/home/upload");
    } else if (data && data !== -1) {
      setHasHandled(true);
      showSnackBar(`Mapping ID ${data} created successfully.`, "success");
      router.push(`/home/mappings/${data}`);
    }
  }, [data, error, file, hasHandled, router, setFile, showSnackBar]);

  return <></>;
};

export default MappingPage;
