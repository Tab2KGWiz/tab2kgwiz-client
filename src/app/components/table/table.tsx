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
import { Button, Stack } from "@mui/material";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { TextField } from "@mui/material";

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

  const handleSave = async () => {
    setLoadingSave(true);

    await updateMapping({
      title: props.mappingTitle,
      accessible: props.isAccessible,
    });

    props.headerMapping.forEach(async (type, title) => {
      // Remove all blank spaces and convert to lowercase
      const ontologyType = title.split(" ").join("").toLowerCase();
      const data = {
        title: title,
        ontologyType,
        dataType: "xsd:" + type,
      };

      try {
        await createColumn(data);
        showSnackBar("Columns created successfully.", "success");
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
  };

  const createColumn = async (data: {
    title: string;
    ontologyType: string;
    dataType: string;
  }) => {
    const accessToken = Cookies.get("accessToken");

    try {
      const response2 = await axios.get(
        `http://localhost:8080/mappings/${props.mappingId}/columns`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );

      if (response2.status !== 200) {
        throw new Error("Error creating column: " + response2.status);
      }

      if (response2.data.length === 0) {
        const response = await axios.put(
          `http://localhost:8080/mappings/${props.mappingId}/columns/-1`,
          data,
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );

        if (response.status !== 200) {
          throw new Error("Error creating column: " + response.status);
        }
      } else {
        response2.data.forEach(async (column: ColumnResponseData) => {
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
      }
    } catch (error) {
      throw new Error("Error creating column: " + error);
    }
  };

  const updateMapping = async (data: {
    title: string;
    accessible: boolean;
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
      <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
        <Stack
          spacing={2}
          direction="row"
          sx={{
            marginLeft: "5%",
            color: "#3C3C3C",
          }}
        >
          {/* <ListItem>Mapping ID: {props.mappingId}</ListItem> */}
          <TextField
            id="mapping-title-field"
            label={props.mappingTitle}
            variant="outlined"
            onChange={(e) => {
              props.setMappingTitle(e.target.value);
              setIsTableChanged(true);
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                defaultChecked={props.isAccessible}
                color="success"
                onChange={(e) => {
                  props.setIsAccessible(e.target.checked);
                  setIsTableChanged(true);
                }}
              />
            }
            label="Public"
          />
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
      </section>
    </>
  );
};

export default Table;
