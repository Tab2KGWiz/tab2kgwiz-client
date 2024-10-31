"use client";

import React, { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  Box,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import axios from "axios";
import Cookies from "js-cookie";
import { extractOntologyAndValues } from "@/app/lib/extractOntologyAndValues";
import { useSnackBar } from "@/app/components/snackbar-provider";

const UserOntology: React.FC = (): JSX.Element => {
  const [ontologyURIData, setOntologyURIData] = useState<
    {
      uri: string;
      prefix: string;
      label: string;
      description: string;
    }[]
  >([]);
  const [uri, setURI] = useState<string>("");
  const [label, setLabel] = useState<string>("");
  const [uriFieldError, setFieldURIError] = useState<boolean>(false);
  const [labelFieldActive, setLabelFieldActive] = useState<boolean>(false);
  const [saveButtonDisabled, setSaveButtonDisabled] = useState<boolean>(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const accessToken = Cookies.get("accessToken");

  const { showSnackBar } = useSnackBar();

  useEffect(() => {
    const fetchOntologyList = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_TAB2KGWIZ_API_URL}/userontologylists`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );

        if (response.status === 200) {
          setOntologyURIData(response.data);
        }
      } catch (error) {
        showSnackBar("Failed to load ontology list", "error");
      }
    };

    fetchOntologyList();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith(".owl")) {
      setSelectedFile(file);
    } else {
      showSnackBar("Please select a valid .owl file", "error");
    }
  };

  const handleUploadFile = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_TAB2KGWIZ_API_URL}/ontology/load`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.status === 200) {
        response.data.forEach(
          (item: {
            URI: string;
            Prefix: string;
            Term: string;
            Description: string;
          }) => {
            setOntologyURIData((prev) => [
              ...(prev || []),
              {
                uri: item.URI,
                prefix: item.Prefix,
                label: item.Term,
                description: item.Description,
              },
            ]);
          },
        );

        setSaveButtonDisabled(false);
        showSnackBar("Ontology loaded successfully", "success");
      }
    } catch (error) {
      showSnackBar("Failed to upload ontology file", "error");
    }
  };

  const handleAddOntology = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (
      event.target.value.match(
        /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
      )
    ) {
      setLabelFieldActive(true);
    } else {
      setLabelFieldActive(false);
    }
    if (event.target.validity.valid) setURI(event.target.value);
  };

  const handleAddLabel = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(event.target.value);
  };

  const handleAddClick = () => {
    if (uri === "") {
      setFieldURIError(true);
    } else {
      setFieldURIError(false);
    }

    if (uri !== "" && label === "") {
      if (
        uri.match(
          /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
        )
      ) {
        const { ontologyURI, ontologyPrefix, value } =
          extractOntologyAndValues(uri);

        if (value === "") {
          setFieldURIError(true);
          showSnackBar("Missing label in URI", "error");
          return;
        }

        setOntologyURIData((prev) => [
          ...(prev || []),
          {
            uri: ontologyURI,
            prefix: ontologyPrefix,
            label: value,
            description: "",
          },
        ]);
        setSaveButtonDisabled(false);
        setURI("");
        setLabel("");
      } else {
        setOntologyURIData((prev) => [
          ...(prev || []),
          {
            uri: `https://tab2kgwiz.udl.cat/${uri}`,
            prefix: "base",
            label: uri,
            description: "",
          },
        ]);
        setSaveButtonDisabled(false);
        setURI("");
        setLabel("");
      }
    } else if (uri !== "") {
      const { ontologyURI } = extractOntologyAndValues(uri);

      setOntologyURIData((prev) => [
        ...(prev || []),
        {
          uri: ontologyURI,
          prefix: getPrefixByURI(ontologyURI),
          label: label,
          description: "",
        },
      ]);
      setSaveButtonDisabled(false);
      setURI("");
      setLabel("");
    }
  };

  const getPrefixByURI = (uri: string) => {
    const hostName = new URL(uri).hostname;
    const prefix = hostName.split(".")[0];
    return prefix;
  };

  const handleOntologyListSave = async () => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_TAB2KGWIZ_API_URL}/userontologylists`,
      ontologyURIData,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    if (response.status === 200) {
      setSaveButtonDisabled(true);
      showSnackBar("Ontology list saved successfully", "success");
    } else {
      showSnackBar("Ontology list save failed", "error");
    }
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Paper
        sx={{
          height: "100%",
          marginTop: "32px",
          marginLeft: "32px",
          marginRight: "32px",
        }}
      >
        <Typography variant="h5">Add User Ontology</Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
            "& > :not(style)": {
              m: 3,
            },
          }}
        >
          <Paper
            component="form"
            sx={{
              height: "80%",
              width: "50%",
              "& .MuiTextField-root": {
                m: 1,
                marginTop: "16px",
                marginLeft: "16px",
              },
            }}
          >
            <TextField
              required
              id="outlined-required"
              label="URI"
              value={uri}
              error={uriFieldError}
              helperText={uriFieldError ? "URI field error" : ""}
              sx={{ width: "50%" }}
              onChange={handleAddOntology}
            />
            <TextField
              id="outlined-required"
              label="Label"
              value={label}
              sx={{ width: "30%" }}
              onChange={handleAddLabel}
              disabled={!labelFieldActive}
            />
            <IconButton
              color="primary"
              aria-label="add-ontology"
              sx={{ marginTop: "18px" }}
              onClick={() => {
                handleAddClick();
              }}
            >
              <AddCircleIcon sx={{ fontSize: 35 }} />
            </IconButton>
            <Box display="flex" gap={2} mt={2} ml={2}>
              <Button variant="contained" component="label" color="secondary">
                Select OWL File
                <input
                  type="file"
                  accept=".owl"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
              <Button
                variant="contained"
                color="secondary"
                disabled={!selectedFile}
                onClick={handleUploadFile}
              >
                Upload OWL File
              </Button>
            </Box>
          </Paper>
          <Paper
            sx={{
              maxHeight: "80%",
              height: "80%",
              width: "40%",
              overflow: "auto",
            }}
          >
            <Typography
              sx={{ mt: 2, mb: 2, ml: 2 }}
              variant="h6"
              component="div"
            >
              Added ontologies
              <Button
                variant="contained"
                color="secondary"
                size="small"
                sx={{
                  marginLeft: { xs: 0, sm: 2, md: "calc(100% - 250px)" },
                }}
                onClick={handleOntologyListSave}
                disabled={saveButtonDisabled}
              >
                Save
              </Button>
            </Typography>

            <List>
              {ontologyURIData?.map((item, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={item.uri}
                    secondary={`${item.label} (${item.description})`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
      </Paper>
    </React.Fragment>
  );
};

export default UserOntology;
