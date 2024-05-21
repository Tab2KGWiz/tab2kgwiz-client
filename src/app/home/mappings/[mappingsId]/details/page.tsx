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
import { title } from "process";
import FavoriteIcon from "@mui/icons-material/Favorite";
import List from "@mui/material/List";
import { Button } from "@mui/material";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import Divider from "@mui/material/Divider";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";

import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  Grid,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
  ListItemIcon,
  Chip,
} from "@mui/material";

interface MappingResponseData {
  fileContent: string;
  fileName: string;
  id: number;
  yamlFile: string;
  columns: {
    id: number;
    title: string;
    dataType: string;
    ontologyURI: string;
  }[];
}
interface Props {}

const MappingDetailsPage: React.FC<{
  params: { mappingsId: string };
}> = ({ params }): JSX.Element => {
  const router = useRouter();
  const [mappingIdHook, setMappingIdHook] = React.useState<number>(
    Number(params.mappingsId),
  );
  const { showSnackBar } = useSnackBar();
  const [isOpen, setIsOpen] = React.useState(false);
  const [yamlFile, setYamlFile] = React.useState<string>();

  const { data, error } = useCreateMappingSWR(
    showSnackBar,
    router,
    mappingIdHook,
  );

  const handleIsOpen = () => {
    setIsOpen((prev) => !prev);
  };

  const handleEdit = () => {
    router.push(`/home/mappings/${mappingIdHook}`);
  };

  const handleDownloadYAML = () => {
    const element = document.createElement("a");
    const file = new Blob([data?.yamlFile as BlobPart], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = `file.yaml`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  const handleDownloadCSV = () => {
    const element = document.createElement("a");
    const file = new Blob([data?.fileContent as BlobPart], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = `${data?.fileName}`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  useEffect(() => {
    if (data?.yamlFile) {
      setYamlFile(data?.yamlFile);
    }
  }, [data?.yamlFile]);

  return (
    <>
      <Typography
        variant="h5"
        sx={{
          marginTop: "3vh",
          marginLeft: "10vh",
          marginRight: "5vh",
          color: "#000000",
        }}
      >
        Mapping Details
      </Typography>
      <br />
      <Stack
        direction="row"
        spacing={2}
        sx={{
          marginLeft: "10vh",
          marginRight: "5vh",
        }}
      >
        <Card sx={{ width: 345, height: 800 }}>
          <CardHeader title="Columns" />
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Show list of columns in the mapping.
            </Typography>
          </CardContent>

          <Button
            size="small"
            variant="outlined"
            startIcon={<EditNoteOutlinedIcon />}
            onClick={handleEdit}
            sx={{
              marginLeft: 2,
            }}
          >
            <span>Edit</span>
          </Button>

          <List
            sx={{
              width: "100%",
              maxWidth: 400,
              bgcolor: "background.paper",
              position: "relative",
              overflow: "auto",
              maxHeight: 700,
              "& ul": { padding: 0 },
            }}
          >
            {data?.columns.map(({ id, title, dataType, ontologyURI }) => (
              <li key={`section-${id}`}>
                <ul>
                  <ListItem key={`item-${id}-${title}`} onClick={handleIsOpen}>
                    <ListItemText primary={`${title}`} />
                  </ListItem>
                  <Collapse in={isOpen}>
                    <List>
                      <ListItem>
                        <ListItemText primary={" • " + `${dataType}`} />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary={" • " + `${ontologyURI}`} />
                      </ListItem>
                    </List>
                  </Collapse>
                </ul>
              </li>
            ))}
          </List>
        </Card>

        <Grid container>
          <Grid item xs={12} marginBottom={1}>
            <Card sx={{ maxWidth: 1300, height: 390 }}>
              <CardHeader title="Mapping details" />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Indicate the details of the mapping, including the generated
                  Yaml File and uploaded CSV File.
                </Typography>
              </CardContent>
              <Stack
                display="flex"
                alignItems="center"
                justifyContent="center"
                spacing={2}
                direction="row"
                divider={<Divider orientation="vertical" flexItem />}
              >
                <Stack spacing={2}>
                  <Button
                    variant="outlined"
                    startIcon={<DownloadRoundedIcon />}
                    onClick={handleDownloadYAML}
                    disabled={!yamlFile}
                  >
                    <span>Yaml file</span>
                  </Button>
                  <Chip
                    label={yamlFile ? "YAML Generated" : "YAML Not Generated"}
                    color={yamlFile ? "success" : "warning"}
                    variant="filled"
                    icon={yamlFile ? <DoneIcon /> : <CloseIcon />}
                    clickable={false}
                  />
                </Stack>

                <Stack spacing={2}>
                  <Button
                    variant="outlined"
                    startIcon={<DownloadRoundedIcon />}
                    onClick={handleDownloadCSV}
                    disabled={!data?.fileContent}
                  >
                    <span>CSV file</span>
                  </Button>
                  <Chip
                    label={
                      data?.fileContent
                        ? `${data.fileName}`
                        : "No existent CSV data"
                    }
                    color={data?.fileContent ? "success" : "warning"}
                    variant="filled"
                    icon={data?.fileContent ? <DoneIcon /> : <CloseIcon />}
                    clickable={false}
                  />
                </Stack>
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card sx={{ maxWidth: 1300, height: 400 }}>
              <CardHeader title="RDF" />
              <CardContent>
                <Typography variant="body2" color="text.secondary"></Typography>
              </CardContent>
              <CardActions disableSpacing>
                <IconButton aria-label="share">
                  <FavoriteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    </>
  );
};

const useCreateMappingSWR = (
  showSnackBar: (message: string, type: "success" | "error") => void,
  router: ReturnType<typeof useRouter>,
  mappingIdHook: number,
) => {
  const { data, error } = useSWR(
    ` `,
    async () => {
      axios.defaults.headers.common["Authorization"] =
        `Bearer ${Cookies.get("accessToken")}`;
      const response = await axios.get(
        `http://localhost:8080/mappings/${mappingIdHook}`,
      );

      if (response.status !== 200) {
        showSnackBar(
          `Error occurred while fetching the mapping with ID ${mappingIdHook}.`,
          "error",
        );
        router.push("/home/board");
        return;
      }

      const data = response.data as MappingResponseData;

      return data;
    },
    {
      revalidateOnFocus: false, // Avoid unnecessary refetches on focus
    },
  );

  return { data, error };
};

export default MappingDetailsPage;
