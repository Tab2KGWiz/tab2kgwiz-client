import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import Autocomplete from "@mui/material/Autocomplete";
import {
  FormControl,
  FormControlLabel,
  FormGroup,
  Stack,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
import useSWR from "swr";
import axios from "axios";
import { useEffect } from "react";
import SendIcon from "@mui/icons-material/Send";
import { useSnackBar } from "../snackbar-provider";
import Checkbox from "@mui/material/Checkbox";

interface Props {
  setOntologySelected: React.Dispatch<React.SetStateAction<string>>;
  headerMapping: Map<string, string>;
}

interface Prefix {
  prefix: string;
  uri: string;
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

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const OntologyDialog: React.FC<Props> = (props): JSX.Element => {
  const [open, setOpen] = React.useState(false);
  const [prefixesData, setPrefixesData] = React.useState<Prefix[]>([]);
  const [prefixSelected, setPrefixSelected] = React.useState<String>("");
  const [prefixMeasurement, setPrefixMeasurement] = React.useState<String>("");

  const [prefixRecommendationData, setPrefixRecommendationData] =
    React.useState<[]>([]);

  const [columns, setColumns] = React.useState<string[]>(
    Array.from(props.headerMapping.keys()),
  );
  const [measurementColumns, setMeasurementColumns] = React.useState<string[]>(
    [],
  );

  const [selectedOntology, setSelectedOntology] = React.useState<string>("");
  const [measurementColumnData, setMeasurementColumnData] = React.useState<
    measurementColumnData[]
  >([]);

  const { showSnackBar } = useSnackBar();

  useGetPrefixes(setPrefixesData);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleSave = () => {
    setOpen(false);
    props.setOntologySelected(selectedOntology);
  };

  const handleDiscard = () => {
    setOpen(false);
    props.setOntologySelected("");
  };

  const handlePrefixSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrefixSelected(event.target.value);
  };

  const handleOntologySelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOntology(event.target.value);
  };

  const handlePrefixMeasurement = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPrefixMeasurement(event.target.value);
  };

  const handlePrefixSend = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    const response = await axios.get(
      `https://prefix.zazuko.com/api/v1/autocomplete?q=${prefixSelected}:${prefixMeasurement}`,
    );

    if (response.status !== 200) {
      showSnackBar("Error occurred while fetching the ontology.", "error");
      setPrefixMeasurement("");
      setPrefixSelected("");
      return;
    }
    showSnackBar("Ontology fetched successfully.", "success");
    setPrefixRecommendationData(response.data);
  };

  const handleDynamicPrefixSend = async (
    event: React.MouseEvent<HTMLButtonElement>,
    column: string,
  ) => {
    const columnData = measurementColumnData.find(
      (data) => data.column === column,
    );
    if (!columnData) return;

    const response = await axios.get(
      `https://prefix.zazuko.com/api/v1/autocomplete?q=${columnData.ontology}:${columnData.measurement}`,
    );

    if (response.status !== 200) {
      showSnackBar("Error occurred while fetching the ontology.", "error");
      return;
    }
    showSnackBar("Ontology fetched successfully.", "success");

    const recommendation = response.data;
    setMeasurementColumnData((prev) =>
      prev.map((data) =>
        data.column === column ? { ...data, recommendation } : data,
      ),
    );
  };

  const handleDynamicSelectionChange = (
    column: string,
    field: keyof measurementColumnData,
    value: string,
  ) => {
    setMeasurementColumnData((prev) => {
      const existingColumn = prev.find((data) => data.column === column);
      if (existingColumn) {
        return prev.map((data) =>
          data.column === column ? { ...data, [field]: value } : data,
        );
      } else {
        const newEntry: measurementColumnData = {
          column,
          ontology: "",
          property: "",
          value: "",
          unit: "",
          timestamp: "",
          madeBy: "",
          ontologyPrefix: "",
          measurement: "",
          recommendation: [],
          selectedRecommendation: "",
          [field]: value,
        };
        return [...prev, newEntry];
      }
    });

    console.log(measurementColumnData);
  };

  const handleMeasurementColumnSelect = (column: string) => {
    setMeasurementColumns((prev) =>
      prev.includes(column)
        ? prev.filter((col) => col !== column)
        : [...prev, column],
    );
  };

  const isSendButtonDisabled = (column: string) => {
    const columnData = measurementColumnData.find(
      (data) => data.column === column,
    );
    if (!columnData) return true;
    return !columnData.ontology || !columnData.measurement;
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Ontology
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleDiscard}
        fullScreen
        scroll="paper"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Ontology mapping form"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <DialogContentText id="alert-dialog-slide-description">
              Feature of interest
            </DialogContentText>
            <Stack direction={"row"} spacing={3}>
              <Autocomplete
                id="combo-box-demo"
                options={prefixesData}
                sx={{ width: 300, marginTop: 2 }}
                getOptionLabel={(option) => option.prefix}
                onSelect={handlePrefixSelect}
                renderInput={(params) => (
                  <TextField {...params} label="Ontology Prefix" />
                )}
              />
              <TextField
                id="outlined-basic"
                label="What are you measuring?"
                variant="outlined"
                onChange={handlePrefixMeasurement}
              />

              <Button
                variant="contained"
                endIcon={<SendIcon />}
                className="bg-blue-600"
                disabled={prefixMeasurement === "" || prefixSelected === ""}
                onClick={handlePrefixSend}
              >
                Send
              </Button>
            </Stack>

            <Stack direction={"row"} spacing={2}>
              <Autocomplete
                freeSolo
                id="combo-box-demo"
                disableClearable
                options={prefixRecommendationData}
                sx={{ width: 300, marginTop: 2 }}
                getOptionLabel={(option) => option}
                onSelect={handleOntologySelect}
                disabled={prefixRecommendationData.length === 0}
                renderInput={(params) => (
                  <TextField {...params} label="Ontology recommendation" />
                )}
              />

              <Autocomplete
                id="AutoComplete2"
                options={columns}
                sx={{ width: 300, marginTop: 2 }}
                getOptionLabel={(option) => option}
                onSelect={handlePrefixSelect}
                renderInput={(params) => (
                  <TextField {...params} label="Select a main column" />
                )}
              />
            </Stack>

            <Typography variant="h6">Measurement Columns</Typography>
            <Stack direction={"row"} spacing={2}>
              <FormGroup>
                {Array.from(props.headerMapping.entries()).map(
                  ([key, value]) => (
                    <FormControlLabel
                      key={key}
                      control={<Checkbox />}
                      label={key}
                      onChange={() => handleMeasurementColumnSelect(key)}
                    />
                  ),
                )}
              </FormGroup>
            </Stack>

            {measurementColumns.length > 0 && (
              <Typography variant="h6">Selected Measurement Columns</Typography>
            )}
            {measurementColumns.map((column) => (
              <Stack key={column} spacing={2}>
                <Typography
                  variant="body1"
                  fontWeight={"bold"}
                >{`${column} - Subject`}</Typography>
                <Stack direction={"row"} spacing={3}>
                  <Autocomplete
                    id={`autocomplete-${column}`}
                    options={prefixesData}
                    sx={{ width: 300, marginTop: 2 }}
                    getOptionLabel={(option) => option.prefix}
                    onSelect={(event: React.ChangeEvent<HTMLInputElement>) => {
                      handleDynamicSelectionChange(
                        column,
                        "ontology",
                        event.target.value,
                      );
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Ontology Prefix" />
                    )}
                  />
                  <TextField
                    id={`measurement-${column}`}
                    label="What are you measuring?"
                    variant="outlined"
                    onSelect={(event: React.ChangeEvent<HTMLInputElement>) => {
                      handleDynamicSelectionChange(
                        column,
                        "measurement",
                        event.target.value,
                      );
                    }}
                  />

                  <Button
                    variant="contained"
                    endIcon={<SendIcon />}
                    className="bg-blue-600"
                    disabled={isSendButtonDisabled(column)}
                    onClick={(event) => handleDynamicPrefixSend(event, column)}
                  >
                    Send
                  </Button>
                </Stack>

                <Autocomplete
                  freeSolo
                  id={`ontology-recommendation-${column}`}
                  disableClearable
                  options={
                    measurementColumnData.find((data) => data.column === column)
                      ?.recommendation || []
                  }
                  sx={{ width: 300, marginTop: 2 }}
                  getOptionLabel={(option) => option}
                  onSelect={(event: React.ChangeEvent<HTMLInputElement>) => {
                    handleDynamicSelectionChange(
                      column,
                      "selectedRecommendation",
                      event.target.value,
                    );
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Ontology recommendation" />
                  )}
                />
                <Typography variant="body2">Predicate-Object</Typography>
                <Stack direction={"row"} spacing={3}>
                  <Autocomplete
                    id={`autocomplete-property-${column}`}
                    options={columns}
                    sx={{ width: 300 }}
                    getOptionLabel={(option) => option}
                    onSelect={(event: React.ChangeEvent<HTMLInputElement>) => {
                      handleDynamicSelectionChange(
                        column,
                        "property",
                        event.target.value,
                      );
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Relates to property" />
                    )}
                  />

                  <Autocomplete
                    id={`autocomplete-value-${column}`}
                    options={columns}
                    sx={{ width: 300 }}
                    getOptionLabel={(option) => option}
                    onSelect={(event: React.ChangeEvent<HTMLInputElement>) => {
                      handleDynamicSelectionChange(
                        column,
                        "value",
                        event.target.value,
                      );
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Has value" />
                    )}
                  />
                </Stack>
                <Stack direction={"row"} spacing={3}>
                  <Autocomplete
                    freeSolo
                    id={`autocomplete-unit-${column}`}
                    disableClearable
                    options={[]}
                    sx={{ width: 300 }}
                    getOptionLabel={(option) => option}
                    onSelect={(event: React.ChangeEvent<HTMLInputElement>) => {
                      handleDynamicSelectionChange(
                        column,
                        "unit",
                        event.target.value,
                      );
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Has unit" />
                    )}
                  />
                  <Autocomplete
                    id={`autocomplete-timestamp-${column}`}
                    options={columns}
                    sx={{ width: 300 }}
                    getOptionLabel={(option) => option}
                    onSelect={(event: React.ChangeEvent<HTMLInputElement>) => {
                      handleDynamicSelectionChange(
                        column,
                        "timestamp",
                        event.target.value,
                      );
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Has timestamp" />
                    )}
                  />
                </Stack>

                <Autocomplete
                  freeSolo
                  id={`autocomplete-made-by-${column}`}
                  disableClearable
                  options={[]}
                  sx={{ width: 300 }}
                  getOptionLabel={(option) => option}
                  onSelect={(event: React.ChangeEvent<HTMLInputElement>) => {
                    handleDynamicSelectionChange(
                      column,
                      "madeBy",
                      event.target.value,
                    );
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Measurement made by" />
                  )}
                />
              </Stack>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDiscard}>Discard</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default OntologyDialog;

const useGetPrefixes = (
  setPrefixesData: React.Dispatch<React.SetStateAction<Prefix[]>>,
) => {
  const { data, error } = useSWR(
    "https://prefix.zazuko.com/api/v1/prefixes",
    async () => {
      console.log("Fetching prefixes");

      try {
        const response = await axios.get(
          "https://prefix.zazuko.com/api/v1/prefixes",
        );

        const responseData = response.data;

        const prefixesObject: Record<string, string> = responseData;

        const prefixesArray: Prefix[] = Object.entries(prefixesObject).map(
          ([key, value]) => ({
            prefix: key,
            uri: value,
          }),
        );

        setPrefixesData(prefixesArray);
      } catch (error) {}
    },
    {
      revalidateOnFocus: false, // Avoid unnecessary refetches on focus
    },
  );

  return { data, error };
};
