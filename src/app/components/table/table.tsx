import React, { useEffect } from "react";
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
}

interface ColumnResponseData {
  uri: string;
  id: string;
  title: string;
}

interface measurementColumnData {
  column: string;
  ontology: string;
  property: string;
  value: string;
  unit: string;
  timestamp: string;
  madeBy: string;
  ontologyPrefix: string;
  measurement: string;
  recommendation: string[];
  selectedRecommendation: string;
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
  const [ontologySelected, setOntologySelected] = React.useState<string>("");

  const [selectedOntology, setSelectedOntology] = React.useState<string>("");
  const [measurementColumnData, setMeasurementColumnData] = React.useState<
    measurementColumnData[]
  >([]);
  const [mainColumnSelected, setMainColumnSelected] =
    React.useState<string>("");

  const handleSave = async () => {
    setLoadingSave(true);

    if (selectedOntology !== "" && mainColumnSelected !== "") {
      await updateMapping({
        title: props.mappingTitle,
        accessible: props.isAccessible,
        mainOntology: selectedOntology,
        mainColumn: mainColumnSelected,
      });
    } else {
      await updateMapping({
        title: props.mappingTitle,
        accessible: props.isAccessible,
      });
    }

    const accessToken = Cookies.get("accessToken");

    const response = await axios.get(
      `http://localhost:8080/mappings/${props.mappingId}/columns`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    if (response.status !== 200) {
      throw new Error("Error creating column: " + response.status);
    }

    if (response.data.length === 0) {
      props.headerMapping.forEach(async (type, title) => {
        // Remove all blank spaces and convert to lowercase
        const ontologyType = title.split(" ").join("").toLowerCase();
        const data = {
          title: title,
          ontologyType,
          dataType: "xsd:" + type,
          subjectOntology: measurementColumnData.find(
            (data) => data.column === title,
          )?.selectedRecommendation,

          relatesToProperty: measurementColumnData.find(
            (data) => data.column === title,
          )?.property,

          hasUnit: measurementColumnData.find((data) => data.column === title)
            ?.unit,

          hasValue: measurementColumnData.find((data) => data.column === title)
            ?.value,

          hasTimestamp: measurementColumnData.find(
            (data) => data.column === title,
          )?.timestamp,

          measurementMadeBy: measurementColumnData.find(
            (data) => data.column === title,
          )?.madeBy,
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
      });
    } else {
      response.data.forEach(async (column: ColumnResponseData) => {
        props.headerMapping.forEach(async (type, title) => {
          // Remove all blank spaces and convert to lowercase
          const ontologyType = title.split(" ").join("").toLowerCase();
          const data = {
            title: title,
            ontologyType,
            dataType: "xsd:" + type,
            subjectOntology: measurementColumnData.find(
              (data) => data.column === title,
            )?.selectedRecommendation,

            relatesToProperty: measurementColumnData.find(
              (data) => data.column === title,
            )?.property,

            hasUnit: measurementColumnData.find((data) => data.column === title)
              ?.unit,

            hasValue: measurementColumnData.find(
              (data) => data.column === title,
            )?.value,

            hasTimestamp: measurementColumnData.find(
              (data) => data.column === title,
            )?.timestamp,

            measurementMadeBy: measurementColumnData.find(
              (data) => data.column === title,
            )?.madeBy,
          };

          if (column.title === data.title) {
            const response = await axios.put(
              `http://localhost:8080/mappings/${props.mappingId}/columns/${column.id}`,
              data,
              { headers: { Authorization: `Bearer ${accessToken}` } },
            );

            if (response.status !== 200) {
              throw new Error("Error creating column: " + response.status);
            }
          }
        });
      });
      setLoadingSave(false);
      setColumnsCreated(true);
      setIsTableChanged(false);
    }
    showSnackBar("Columns created successfully.", "success");
  };

  const createColumn = async (data: {
    title: string;
    ontologyType: string;
    dataType: string;
  }) => {
    const accessToken = Cookies.get("accessToken");

    try {
      const response = await axios.put(
        `http://localhost:8080/mappings/${props.mappingId}/columns/-1`,
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
    mainOntology?: string;
    mainColumn?: string;
  }) => {
    const accessToken = Cookies.get("accessToken");

    try {
      const response = await axios.patch(
        `http://localhost:8080/mappings/${props.mappingId}`,
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
            setOntologySelected={setOntologySelected}
            ontologySelected={ontologySelected}
            headerMapping={props.headerMapping}
            selectedOntology={selectedOntology}
            setSelectedOntology={setSelectedOntology}
            measurementColumnData={measurementColumnData}
            setMeasurementColumnData={setMeasurementColumnData}
            mainColumnSelected={mainColumnSelected}
            setMainColumnSelected={setMainColumnSelected}
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
                setHeaderMapping={props.setHeaderMapping}
                headerMapping={props.headerMapping}
                setIsTableChanged={setIsTableChanged}
                setIsRDFGenerated={setIsRDFGenerated}
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
