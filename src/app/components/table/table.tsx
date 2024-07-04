import React, { lazy, useEffect } from "react";
import Pagination from "./pagination";
import TableUI from "@/app/ui/table/table";
import { postYaml } from "../../services/post-yaml";
import { postYarrrml } from "../../services/post-yarrrml";
import { useSnackBar } from "../snackbar-provider";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Box from "@mui/material/Box";
import { useFile } from "../file-provider";
import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";
import { Button, Stack, Switch, Typography } from "@mui/material";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import { TextField, Paper } from "@mui/material";
import OntologyDialog from "./ontology-dialog";
import MappingResponseData from "@/app/utils/mappingResponseData";
import MeasurementColumnData from "@/app/utils/measurementColumnData";

interface Props {
  header: string[] | undefined;
  body: string[][] | undefined;
  pages: number;
  page: number;
  pageSize: number;
  onPageChange: Function;
  previousText: string;
  nextText: string;
  setHeaderMapping: React.Dispatch<React.SetStateAction<Map<string, string>>>;
  headerMapping: Map<string, string>;
  totalRows: number;
  mappingName: string | undefined;
  mappingFile: File | null;
  mappingId: number;
  isAccessible: boolean;
  setIsAccessible: React.Dispatch<React.SetStateAction<boolean>>;
  mappingTitle: string;
  setMappingTitle: React.Dispatch<React.SetStateAction<string>>;
  columnsData: MeasurementColumnData[];
  setColumnsData: React.Dispatch<
    React.SetStateAction<MappingResponseData["columns"]>
  >;
}

const Table: React.FC<Props> = (props): JSX.Element => {
  const { showSnackBar } = useSnackBar();
  const [loadingSave, setLoadingSave] = React.useState(false);
  const [loadingRDF, setLoadingRDF] = React.useState(false);
  const { file, setFile } = useFile();
  const router = useRouter();
  const [columnsCreated, setColumnsCreated] = React.useState(false);
  const [isTableChanged, setIsTableChanged] = React.useState(true);
  const [fileContent, setFileContent] = React.useState<String>("");
  const [isRDFGenerated, setIsRDFGenerated] = React.useState(false);
  const [prefixesURI, setPrefixesURI] = React.useState<Map<string, string>>();

  const handleSave = async () => {
    setLoadingSave(true);

    let concatenatedPrefixes = "";

    prefixesURI?.forEach((value, key) => {
      concatenatedPrefixes += `${key};${value},`;
    });

    concatenatedPrefixes = concatenatedPrefixes.slice(0, -1);

    await updateMapping({
      title: props.mappingTitle,
      accessible: props.isAccessible,
      prefixesURIS: concatenatedPrefixes,
    });

    const accessToken = Cookies.get("accessToken");

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_TAB2KGWIZ_API_URL}/mappings/${props.mappingId}/columns`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    if (response.status !== 200) {
      throw new Error("Error creating column: " + response.status);
    }

    if (response.data.length === 0) {
      for (const [title, type] of Array.from(props.headerMapping.entries())) {
        const data = {
          title: title,
          dataType: props.columnsData.find((data) => data.title === title)
            ?.dataType,

          hasUnit: props.columnsData.find((data) => data.title === title)
            ?.hasUnit,

          hasTimestamp: props.columnsData.find((data) => data.title === title)
            ?.hasTimestamp,

          measurementMadeBy: props.columnsData.find(
            (data) => data.title === title,
          )?.measurementMadeBy,

          measurement: props.columnsData.find((data) => data.title === title)
            ?.measurement,

          identifier: props.columnsData.find((data) => data.title === title)
            ?.identifier,

          ontologyType: props.columnsData.find((data) => data.title === title)
            ?.ontologyType,

          ontologyURI: props.columnsData.find((data) => data.title === title)
            ?.ontologyURI,

          label: props.columnsData.find((data) => data.title === title)?.label,

          prefix: props.columnsData.find((data) => data.title === title)
            ?.prefix,

          isMeasurementOf: props.columnsData.find(
            (data) => data.title === title,
          )?.isMeasurementOf,
        };

        try {
          await createColumn(data);
          setLoadingSave(false);
          setColumnsCreated(true);
          setIsTableChanged(false);
        } catch (error) {
          showSnackBar(
            `Error occurred while creating columns: ${error}`,
            "error",
          );
          setLoadingSave(false);
          setFile(null);
          router.push("/home/upload");
          return;
        }
      }
    } else {
      response.data.forEach(async (column: MeasurementColumnData) => {
        const data = {
          dataType: props.columnsData.find(
            (data) => data.title === column.title,
          )?.dataType,
          subjectOntology: props.columnsData.find(
            (data) => data.title === column.title,
          )?.selectedRecommendation,

          hasUnit: props.columnsData.find((data) => data.title === column.title)
            ?.hasUnit,

          hasTimestamp: props.columnsData.find(
            (data) => data.title === column.title,
          )?.hasTimestamp,

          measurementMadeBy: props.columnsData.find(
            (data) => data.title === column.title,
          )?.measurementMadeBy,

          measurement: props.columnsData.find(
            (data) => data.title === column.title,
          )?.measurement,

          identifier: props.columnsData.find(
            (data) => data.title === column.title,
          )?.identifier,

          ontologyType: props.columnsData.find(
            (data) => data.title === column.title,
          )?.ontologyType,

          ontologyURI: props.columnsData.find(
            (data) => data.title === column.title,
          )?.ontologyURI,

          label: props.columnsData.find((data) => data.title === column.title)
            ?.label,

          prefix: props.columnsData.find((data) => data.title === column.title)
            ?.prefix,

          isMeasurementOf: props.columnsData.find(
            (data) => data.title === column.title,
          )?.isMeasurementOf,
        };

        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_TAB2KGWIZ_API_URL}/mappings/${props.mappingId}/columns/${column.id}`,
          data,
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );

        if (response.status !== 200) {
          throw new Error("Error creating column: " + response.status);
        }
      });
      setLoadingSave(false);
      setColumnsCreated(true);
      setIsTableChanged(false);
    }
    showSnackBar("Columns created successfully.", "success");
  };

  const createColumn = async (data: {
    title: string;
    dataType: string | undefined;
    hasTimestamp: string | undefined;
    hasUnit: string | undefined;
    identifier: boolean | undefined;
    isMeasurementOf: string | undefined;
    label: string | undefined;
    measurement: boolean | undefined;
    measurementMadeBy: string | undefined;
    ontologyType: string | undefined;
    ontologyURI: string | undefined;
    prefix: string | undefined;
  }) => {
    const accessToken = Cookies.get("accessToken");

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_TAB2KGWIZ_API_URL}/mappings/${props.mappingId}/columns/-1`,
        data,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );

      if (response.status !== 200) {
        throw new Error("Error creating column: " + response.status);
      }
    } catch (error) {
      throw new Error("Error creating column: " + error);
    }
  };

  const updateMapping = async (data: {
    title: string;
    accessible: boolean;
    prefixesURIS: string;
  }) => {
    const accessToken = Cookies.get("accessToken");

    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_TAB2KGWIZ_API_URL}/mappings/${props.mappingId}`,
        data,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );

      if (response.status !== 200) {
        throw new Error("Error updating mapping: " + response.status);
      }
    } catch (error) {
      throw new Error("Error updating mapping: " + error);
    }
  };

  const handleGenerateRDF = async () => {
    setLoadingRDF(true);

    if ((await postYaml(props.mappingId)) === -1) {
      showSnackBar("Error generating yaml file", "error");
      setLoadingRDF(false);
    } else {
      showSnackBar("Yaml file generated successfully", "success");
      const response = await postYarrrml(
        props.mappingName ? props.mappingName : "",
        props.mappingFile,
        props.mappingId,
      );

      if (response === "-1") {
        showSnackBar("Error parsing yarrrml", "error");
        setLoadingRDF(false);
      } else {
        showSnackBar("Yarrrml parsed successfully", "success");
        setFileContent(response);
        setLoadingRDF(false);
        setIsRDFGenerated(true);
      }
    }
  };

  const handleDownloadRDF = () => {
    const element = document.createElement("a");
    const file = new Blob([fileContent as BlobPart], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "rdf.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  return (
    <>
      <Paper
        sx={{
          maxHeight: "100vh",
          overflow: "auto",
          backgroundColor: "#F9FAFB",
          padding: "12px",
          "@media (min-width: 640px)": {
            padding: "20px",
          },
        }}
      >
        <Stack
          spacing={2}
          direction="row"
          sx={{
            marginLeft: "4.5%",
            marginBottom: "1%",
            color: "#3C3C3C",
          }}
        >
          <TextField
            id="mapping-title-field"
            label={props.mappingTitle}
            variant="outlined"
            size="small"
            onChange={(e) => {
              props.setMappingTitle(e.target.value);
              setIsTableChanged(true);
            }}
          />

          <OntologyDialog
            headerMapping={props.headerMapping}
            setHeaderMapping={props.setHeaderMapping}
            setIsTableChanged={setIsTableChanged}
            setIsRDFGenerated={setIsRDFGenerated}
            setPrefixesURI={setPrefixesURI}
            prefixesURI={prefixesURI}
            columnsData={props.columnsData}
            setColumnsData={props.setColumnsData}
          ></OntologyDialog>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography>Private</Typography>
            <Switch
              defaultChecked={props.isAccessible}
              color="warning"
              onChange={(e) => {
                props.setIsAccessible(e.target.checked);
                setIsTableChanged(true);
              }}
            />
            <Typography>Public</Typography>
          </Stack>
        </Stack>
        <div className="mx-auto max-w-full px-6 lg:px-12">
          <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <TableUI
                body={props.body}
                header={props.header}
                headerMapping={props.headerMapping}
              />
            </div>
            <Pagination
              page={props.page}
              pages={props.pages}
              pageSize={props.pageSize}
              onPageChange={props.onPageChange}
              previousText="Previous"
              nextText="Next"
              rowsNum={props.body?.length}
              totalRows={props.totalRows}
            />
          </div>
        </div>
        <Box className="mt-5 ml-14" sx={{ "& > button": { m: 1 } }}>
          <LoadingButton
            color="secondary"
            className="bg-fuchsia-700"
            onClick={handleSave}
            loading={loadingSave}
            loadingPosition="start"
            startIcon={<SaveIcon />}
            variant="contained"
            disabled={!isTableChanged}
          >
            <span>Save</span>
          </LoadingButton>

          <LoadingButton
            onClick={handleGenerateRDF}
            className="bg-blue-600"
            endIcon={<PostAddOutlinedIcon />}
            loading={loadingRDF}
            loadingPosition="end"
            variant="contained"
            disabled={!columnsCreated || isTableChanged}
          >
            <span>Generate RDF</span>
          </LoadingButton>

          <Button
            variant="outlined"
            startIcon={<DownloadRoundedIcon />}
            onClick={handleDownloadRDF}
            disabled={!isRDFGenerated || isTableChanged}
          >
            <span>RDF file</span>
          </Button>
        </Box>
      </Paper>
    </>
  );
};

export default Table;
