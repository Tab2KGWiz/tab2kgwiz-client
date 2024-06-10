"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSnackBar } from "@/app/components/snackbar-provider";

import useSWR from "swr";
import axios from "axios";
import Cookies from "js-cookie";

import List from "@mui/material/List";
import { Button } from "@mui/material";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import Divider from "@mui/material/Divider";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import SendIcon from "@mui/icons-material/Send";

import {
  Card,
  CardContent,
  CardHeader,
  Collapse,
  Grid,
  ListItem,
  ListItemText,
  Stack,
  Typography,
  Chip,
  Box,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

interface MappingResponseData {
  fileContent: string;
  fileName: string;
  id: number;
  yamlFile: string;
  title: string;
  fileFormat: string;
  providedBy: string;
  accessible: boolean;
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
  const [csvFile, setCsvFile] = React.useState<File | null>(null);
  const [customYamlFile, setCustomYamlFile] = React.useState<File | null>(null);
  const [loadingRDF, setLoadingRDF] = React.useState(false);
  const [rdfFile, setRdfFile] = React.useState("");
  const [isRDFGenerated, setIsRDFGenerated] = React.useState(false);

  const { data, error } = useGetMappingSWR(showSnackBar, router, mappingIdHook);

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

  const handleDownloadRDF = () => {
    const element = document.createElement("a");
    const file = new Blob([rdfFile as BlobPart], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "rdf.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  const handleUploadCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = event.target.files && event.target.files[0];
    setCsvFile(newFile);
    if (newFile) {
      if (newFile.type !== "text/csv") {
        showSnackBar("Invalid file type. Please upload a CSV file.", "error");
        setCsvFile(null);
        return;
      } else if (newFile.size > 10000000) {
        // Allow only files less than 10MB
        showSnackBar("CSV file size too large", "error");
        setCsvFile(null);
        return;
      }
      showSnackBar("CSV file uploaded successfully.", "info");
    }
  };

  const handleUploadYAML = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = event.target.files && event.target.files[0];

    setCustomYamlFile(newFile);
    if (newFile) {
      if (newFile.name.split(".").pop() !== "yml") {
        showSnackBar("Invalid file type. Please upload a YAML file.", "error");
        setCustomYamlFile(null);
        return;
      } else if (newFile.size > 10000000) {
        // Allow only files less than 10MB
        showSnackBar("YAML file size too large", "error");
        setCustomYamlFile(null);
        return;
      }
      showSnackBar("YAML file uploaded successfully.", "info");
    }
  };

  const handleDeleteCSV = () => {
    setCsvFile(null);
    showSnackBar("CSV file deleted.", "info");
  };

  const handleDeleteYAMl = () => {
    setCustomYamlFile(null);
    showSnackBar("YAML file deleted.", "info");
  };

  const handlePostRDF = async () => {
    setLoadingRDF(true);

    if (csvFile !== null && customYamlFile !== null) {
      const data: { csvFile: File; yamlFile: File } = {
        csvFile: csvFile,
        yamlFile: customYamlFile,
      };

      try {
        const response = await axios.post(
          "http://165.232.127.94:8081/generateLinkedData",
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        if (response.status === 200) {
          setRdfFile(response.data);
          setIsRDFGenerated(true);
          setLoadingRDF(false);
          showSnackBar("RDF generated successfully.", "success");
        } else {
          showSnackBar("Error occurred while generating RDF.", "error");
        }
      } catch {
        showSnackBar("Error occurred while generating RDF.", "error");
      }
    }
  };

  useEffect(() => {
    if (data?.yamlFile) {
      setYamlFile(data?.yamlFile);
      const yamlData = new File([data?.yamlFile], "original.yml");
      setCustomYamlFile(yamlData);
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
        spacing={1}
        sx={{
          marginLeft: "10vh",
          marginRight: "5vh",
        }}
      >
        <Stack spacing={1}>
          <Card sx={{ width: "30vw", height: "34.2vh" }}>
            <CardHeader title="Mapping info" />

            <List
              sx={{
                width: "100%",
                maxWidth: 360,
                bgcolor: "background.paper",
              }}
              aria-label="mailbox folders"
            >
              <ListItem>
                <Typography variant="subtitle2" gutterBottom>
                  <Box fontWeight="fontWeightBold" display="inline">
                    ID: &nbsp;&nbsp;
                  </Box>
                  {data?.id}
                </Typography>
              </ListItem>
              <ListItem>
                <Typography variant="subtitle2" gutterBottom>
                  <Box fontWeight="fontWeightBold" display="inline">
                    Title: &nbsp;&nbsp;
                  </Box>
                  {data?.title}
                </Typography>
              </ListItem>
              <ListItem>
                <Typography variant="subtitle2" gutterBottom>
                  <Box fontWeight="fontWeightBold" display="inline">
                    File format: &nbsp;&nbsp;
                  </Box>
                  {data?.fileFormat}
                </Typography>
              </ListItem>
              <ListItem>
                <Typography variant="subtitle2" gutterBottom>
                  <Box fontWeight="fontWeightBold" display="inline">
                    Created by: &nbsp;&nbsp;
                  </Box>
                  {data?.providedBy.split("/")[2]}
                </Typography>
              </ListItem>
              <ListItem>
                <Typography variant="subtitle2" gutterBottom>
                  <Box fontWeight="fontWeightBold" display="inline">
                    Availability: &nbsp;&nbsp;
                  </Box>
                  {data?.accessible ? "Public" : "Private"}
                </Typography>
              </ListItem>
            </List>
          </Card>

          <Card sx={{ width: "30vw", height: "48vh" }}>
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
                    <ListItem
                      key={`item-${id}-${title}`}
                      onClick={handleIsOpen}
                    >
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
        </Stack>

        <Grid container>
          <Grid item xs={12} marginBottom={1}>
            <Card sx={{ width: "59vw", height: "32.2vh" }}>
              <CardHeader title="Yaml File and CSV" />
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
            <Card sx={{ width: "59vw", height: "50vh" }}>
              <CardHeader title="RDF" />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Generate RDF with direct endpoint post request.
                </Typography>
                <br />
                <br />

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
                      component="label"
                      variant="contained"
                      tabIndex={-1}
                      startIcon={<CloudUploadIcon />}
                    >
                      Upload CSV
                      <VisuallyHiddenInput
                        type="file"
                        onChange={handleUploadCSV}
                      />
                    </Button>

                    <Chip
                      label={csvFile ? csvFile.name : "Empty"}
                      variant="outlined"
                      onDelete={handleDeleteCSV}
                      disabled={!csvFile}
                    ></Chip>
                  </Stack>

                  <Stack spacing={2}>
                    <Button
                      component="label"
                      variant="contained"
                      tabIndex={-1}
                      startIcon={<CloudUploadIcon />}
                    >
                      Upload YAML
                      <VisuallyHiddenInput
                        type="file"
                        onChange={handleUploadYAML}
                      />
                    </Button>

                    <Chip
                      label={customYamlFile ? customYamlFile.name : "Empty"}
                      variant="outlined"
                      onDelete={handleDeleteYAMl}
                      disabled={!customYamlFile}
                    />
                  </Stack>
                </Stack>
                <br />

                <Stack
                  spacing={2}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Card
                    sx={{
                      height: 50,
                      width: 400,
                      // marginTop: "2vh",
                      // marginLeft: "17vh",
                    }}
                  >
                    <Typography
                      variant="body1"
                      color="text.primary"
                      sx={{ marginTop: "1.5vh", marginLeft: "2vh" }}
                    >
                      http://165.232.127.94:8081/generateLinkedData
                    </Typography>
                  </Card>

                  <Stack direction="row" spacing={2}>
                    <LoadingButton
                      onClick={handlePostRDF}
                      className="bg-blue-600"
                      endIcon={<SendIcon />}
                      loading={loadingRDF}
                      loadingPosition="end"
                      variant="contained"
                      disabled={!csvFile || !customYamlFile}
                    >
                      <span>POST</span>
                    </LoadingButton>

                    <Button
                      variant="outlined"
                      startIcon={<DownloadRoundedIcon />}
                      onClick={handleDownloadRDF}
                      disabled={!isRDFGenerated}
                    >
                      <span>RDF file</span>
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    </>
  );
};

const useGetMappingSWR = (
  showSnackBar: (message: string, type: "success" | "error") => void,
  router: ReturnType<typeof useRouter>,
  mappingIdHook: number,
) => {
  const { data, error } = useSWR(
    // If URL is blank with space, sometimes it will not enter the fetch function
    "http://localhost:8080/mappings/",
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
