"use client";

import React, { useEffect } from "react";
import { createNewMapping } from "../../services/createNewMapping";
import { useSnackBar } from "../../components/snackbar-provider";
import { useFile } from "../../components/file-provider";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import axios from "axios";
import Cookies from "js-cookie";
import Box from "@mui/material/Box";
import { Container, Link, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

interface Props {}

interface MappingResponseData {
  uri: string;
  title: string;
  fileContent: string;
}

const UserBoard: React.FC<Props> = (props): JSX.Element => {
  const { file, setFile } = useFile();
  const router = useRouter();
  const { showSnackBar } = useSnackBar();
  const [mappingsIds, setMappingsIds] = React.useState<number[]>([]);
  const { data, error } = useGetAllMappingsSWR();

  useEffect(() => {
    if (data === "-1" || error) {
    }

    if (data && data !== "-1") {
      setMappingsIds(data);
    }
  }, [data]);

  return (
    <>
      <Container maxWidth="xl">
        <Box
          display="flex"
          sx={{
            height: "90vh",
            bgcolor: "#f3f4f6",
            marginTop: "2vh",
            borderRadius: "10px",
            boxShadow: 1,
          }}
        >
          <Stack spacing={2} sx={{ marginTop: "2vh", marginLeft: "2vh" }}>
            <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              Mapping ID
            </h2>
            <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
              {mappingsIds.length === 0 ? (
                <li>There are no mappings available.</li>
              ) : (
                <>
                  {mappingsIds.map((mappingId) => (
                    <li key={mappingId}>
                      <Link href={`/home/mappings/${mappingId}/details`}>
                        <a>Mapping ID: {mappingId}</a>
                      </Link>
                    </li>
                  ))}
                </>
              )}
            </ul>
          </Stack>
        </Box>
      </Container>
    </>
  );
};

const useGetAllMappingsSWR = () => {
  const { data, error } = useSWR(
    " ",
    async () => {
      axios.defaults.headers.common["Authorization"] =
        `Bearer ${Cookies.get("accessToken")}`;

      const response = await axios.get("http://localhost:8080/mappings");

      if (response.status === 200) {
        return response.data;
      }
      return "-1";
    },
    {
      revalidateOnFocus: false, // Avoid unnecessary refetches on focus
    },
  );

  return { data, error };
};

export default UserBoard;
