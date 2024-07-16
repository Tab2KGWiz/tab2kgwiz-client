import React from "react";
import Pagination from "./pagination";
import TableUI from "@/app/ui/table/table";
import postYaml from "@/app/services/post-yaml";
import postYarrrml from "@/app/services/post-yarrrml";
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
import ColumnData from "@/app/utils/columnData";

interface Props {
  header: string[] | undefined;
  body: string[][] | undefined;
  pages: number;
  page: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
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
  columnsData: ColumnData[];
  setColumnsData: React.Dispatch<
    React.SetStateAction<MappingResponseData["columns"]>
  >;
}

const TableControls = (
  mappingTitle: string,
  setMappingTitle: React.Dispatch<React.SetStateAction<string>>,
  isAccessible: boolean,
  setIsAccessible: React.Dispatch<React.SetStateAction<boolean>>,
  setIsTableChanged: React.Dispatch<React.SetStateAction<boolean>>,
  prefixesURI: Map<string, string>,
  setPrefixesURI: React.Dispatch<React.SetStateAction<Map<string, string>>>,
  headerMapping: Map<string, string>,
  setHeaderMapping: React.Dispatch<React.SetStateAction<Map<string, string>>>,
  setIsRDFGenerated: React.Dispatch<React.SetStateAction<boolean>>,
  columnsData: ColumnData[],
  setColumnsData: React.Dispatch<React.SetStateAction<ColumnData[]>>,
) => {
  return (
    <Stack
      spacing={2}
      direction="row"
      sx={{ marginLeft: "4.5%", marginBottom: "1%", color: "#3C3C3C" }}
    >
      <TextField
        id="mapping-title-field"
        label={mappingTitle}
        variant="outlined"
        size="small"
        onChange={(e) => {
          setMappingTitle(e.target.value);
          setIsTableChanged(true);
        }}
      />
      <OntologyDialog
        headerMapping={headerMapping}
        setHeaderMapping={setHeaderMapping}
        setIsTableChanged={setIsTableChanged}
        setIsRDFGenerated={setIsRDFGenerated}
        setPrefixesURI={setPrefixesURI}
        prefixesURI={prefixesURI}
        columnsData={columnsData}
        setColumnsData={setColumnsData}
      />
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography>Private</Typography>
        <Switch
          defaultChecked={isAccessible}
          color="warning"
          onChange={(e) => {
            setIsAccessible(e.target.checked);
            setIsTableChanged(true);
          }}
        />
        <Typography>Public</Typography>
      </Stack>
    </Stack>
  );
};

const TableContent = (
  body: string[][] | undefined,
  header: string[] | undefined,
  page: number,
  pages: number,
  pageSize: number,
  onPageChange: (newPage: number) => void,
  totalRows: number,
) => {
  return (
    <div className="mx-auto max-w-full px-6 lg:px-12">
      <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <TableUI body={body} header={header} />
        </div>
        <Pagination
          page={page}
          pages={pages}
          pageSize={pageSize}
          onPageChange={onPageChange}
          previousText="Previous"
          nextText="Next"
          rowsNum={body?.length}
          totalRows={totalRows}
        />
      </div>
    </div>
  );
};

const ButtonGroup = (
  handleSave: () => Promise<void>,
  handleGenerateRDF: () => Promise<void>,
  handleDownloadRDF: () => void,
  loadingSave: boolean,
  loadingRDF: boolean,
  isTableChanged: boolean,
  columnsCreated: boolean,
  isRDFGenerated: boolean,
) => {
  return (
    <Box className="mt-5 ml-14" sx={{ "& > button": { m: 1 } }}>
      <LoadingButton
        color="primary"
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
  );
};

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
  const [prefixesURI, setPrefixesURI] = React.useState<Map<string, string>>(
    new Map(),
  );

  const handleSave = async () => {
    setLoadingSave(true);

    const concatenatedPrefixes = Array.from(prefixesURI.entries())
      .map(([key, value]) => `${key};${value}`)
      .join(",");

    await updateMapping({
      title: props.mappingTitle,
      accessible: props.isAccessible,
      prefixesURIS: concatenatedPrefixes,
    });

    const accessToken = Cookies.get("accessToken");

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_TAB2KGWIZ_API_URL}/mappings/${props.mappingId}/columns`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );

      if (response.status !== 200) {
        throw new Error("Error creating column: " + response.status);
      }

      if (response.data.length === 0) {
        for (const [title, type] of Array.from(props.headerMapping.entries())) {
          const data = props.columnsData.find((data) => data.title === title);
          await createColumn(data);
        }
      } else {
        for (const column of response.data) {
          const data = props.columnsData.find(
            (data) => data.title === column.title,
          );

          const response = await axios.put(
            `${process.env.NEXT_PUBLIC_TAB2KGWIZ_API_URL}/mappings/${props.mappingId}/columns/${column.id}`,
            data,
            { headers: { Authorization: `Bearer ${accessToken}` } },
          );

          if (response.status !== 200) {
            throw new Error("Error creating column: " + response.status);
          }
        }
      }
      setLoadingSave(false);
      setColumnsCreated(true);
      setIsTableChanged(false);
      showSnackBar("Columns created successfully.", "success");
    } catch (error) {
      showSnackBar(`Error occurred while creating columns: ${error}`, "error");
      setLoadingSave(false);
      setFile(null);
      router.push("/home/upload");
    }
  };

  const createColumn = async (data: ColumnData | undefined) => {
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
      const response = await postYarrrml(props.mappingFile, props.mappingId);

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
        {TableControls(
          props.mappingTitle,
          props.setMappingTitle,
          props.isAccessible,
          props.setIsAccessible,
          setIsTableChanged,
          prefixesURI,
          setPrefixesURI,
          props.headerMapping,
          props.setHeaderMapping,
          setIsRDFGenerated,
          props.columnsData,
          props.setColumnsData,
        )}

        {TableContent(
          props.body,
          props.header,
          props.page,
          props.pages,
          props.pageSize,
          props.onPageChange,
          props.totalRows,
        )}

        {ButtonGroup(
          handleSave,
          handleGenerateRDF,
          handleDownloadRDF,
          loadingSave,
          loadingRDF,
          isTableChanged,
          columnsCreated,
          isRDFGenerated,
        )}
      </Paper>
    </>
  );
};

export default Table;
