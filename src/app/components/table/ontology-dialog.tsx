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
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Stack, TextField, Typography } from "@mui/material";
import useSWR from "swr";
import axios from "axios";
import { useSnackBar } from "../snackbar-provider";
import { SelectChangeEvent } from "@mui/material/Select";
import { SyntheticEvent } from "react";
import xsdDataType from "@/app/utils/xsdDataTypes";

interface Props {
  setOntologySelected: React.Dispatch<React.SetStateAction<string>>;
  ontologySelected: string;
  headerMapping: Map<string, string>;
  selectedOntology: string;
  setSelectedOntology: React.Dispatch<React.SetStateAction<string>>;
  measurementColumnData: measurementColumnData[];
  setMeasurementColumnData: React.Dispatch<
    React.SetStateAction<measurementColumnData[]>
  >;
  mainColumnSelected: string;
  setMainColumnSelected: React.Dispatch<React.SetStateAction<string>>;
  setHeaderMapping: React.Dispatch<React.SetStateAction<Map<string, string>>>;
  setIsTableChanged: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRDFGenerated: React.Dispatch<React.SetStateAction<boolean>>;
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
  identifier: string;
  ontologyType: string;
  ontologyURI: string;
  label: string;
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
  const [selectedColumns, setSelectedColumns] = React.useState<{
    [key: string]: string;
  }>({});

  const [columns, setColumns] = React.useState<string[]>(
    Array.from(props.headerMapping.keys()),
  );

  const [columnData, setColumnData] = React.useState<
    {
      itemText: string;
      prefixed: string;
      iri: { value: string };
      label: string;
    }[]
  >();

  const { showSnackBar } = useSnackBar();

  useGetPrefixes(setPrefixesData);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleSave = () => {
    setOpen(false);
  };

  const handleDiscard = () => {
    setOpen(false);
  };

  const handleDynamicSelectionChange = (
    column: string,
    field: keyof measurementColumnData,
    value: string,
  ) => {
    props.setIsTableChanged(true);
    props.setIsRDFGenerated(false);

    props.setMeasurementColumnData((prev) => {
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
          identifier: "",
          ontologyType: "",
          ontologyURI: "",
          label: "",

          [field]: value,
        };
        return [...prev, newEntry];
      }
    });
  };

  const handleMeasurementColumnSelect = (
    event: SelectChangeEvent<string>,
    key: string,
  ) => {
    setSelectedColumns({
      ...selectedColumns,
      [key]: event.target.value,
    });

    if (event.target.value === "Measurement") {
      handleDynamicSelectionChange(key, "measurement", "true");
    } else if (event.target.value === "Id") {
      handleDynamicSelectionChange(key, "identifier", "true");
    }
  };

  const handleSearchOntoForm = (
    event: SyntheticEvent<Element, Event>,
    value: string,
    key: string,
  ) => {
    columnData?.forEach((item) => {
      if (item.itemText === value) {
        handleDynamicSelectionChange(key, "ontologyType", item.prefixed);
        handleDynamicSelectionChange(key, "ontologyURI", item.iri.value);
        handleDynamicSelectionChange(key, "label", item.label);
      }
    });
  };

  const handleSearchUnitForm = (
    event: SyntheticEvent<Element, Event>,
    value: string,
    key: string,
  ) => {
    columnData?.forEach((item) => {
      if (item.itemText === value) {
        handleDynamicSelectionChange(key, "unit", item.prefixed);
      }
    });
  };

  const handleOntologySearch = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const response = await axios.get(
      `https://prefix.zazuko.com/api/v1/search?q=${event.target.value}`,
    );

    const ontologyData: {
      itemText: string;
      prefixed: string;
      iri: { value: string };
      label: string;
    }[] = response.data;

    setColumnData(ontologyData);
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
              For each column, select the column type and search for the
              ontology
            </DialogContentText>

            {Array.from(props.headerMapping.entries()).map(([key, value]) => (
              <>
                <Typography
                  key={key}
                  variant="body1"
                  fontWeight={"bold"}
                >{`${key}`}</Typography>
                <Stack key={key} direction={"row"} spacing={2}>
                  <FormControl sx={{ width: 300 }}>
                    <InputLabel id={`${key}-input-label`}>
                      Column Type
                    </InputLabel>
                    <Select
                      labelId={`${key}-label`}
                      id={`${key}-select-id`}
                      label="Column Type"
                      value={selectedColumns[key] || ""}
                      onChange={(event: SelectChangeEvent<string>) =>
                        handleMeasurementColumnSelect(event, key)
                      }
                    >
                      <MenuItem value={"Id"}>Identifier</MenuItem>
                      <MenuItem value={"Measurement"}>Measurement</MenuItem>
                      <MenuItem value={"Other"}>Other</MenuItem>
                    </Select>
                  </FormControl>
                  <Autocomplete
                    freeSolo
                    id={`${key}-autocomplete`}
                    disableClearable
                    options={columnData?.map((item) => item.itemText) || []}
                    sx={{ width: 300 }}
                    filterOptions={(x) => x}
                    onSelect={handleOntologySearch}
                    onChange={(event, value) => {
                      handleSearchOntoForm(event, value, key);
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Search Ontology" />
                    )}
                  />
                  <Autocomplete
                    id={`xsd-autocomplete-${key}`}
                    options={xsdDataType}
                    sx={{ width: 300 }}
                    getOptionLabel={(option) => option}
                    defaultValue={props.headerMapping.get(key)}
                    onChange={(event, value) => {
                      props.setIsTableChanged(true);
                      props.setIsRDFGenerated(false);
                      props.setHeaderMapping((prev) => {
                        const newMap = new Map(prev);
                        newMap.set(key, value ? value : "");
                        return newMap;
                      });
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="XSD Data Type" />
                    )}
                  />
                </Stack>

                {selectedColumns[key] === "Measurement" && (
                  <>
                    <Typography variant="body2">Predicate-Object</Typography>
                    <Stack direction={"row"} spacing={3}>
                      <Autocomplete
                        id={`autocomplete-property-${key}`}
                        options={columns}
                        sx={{ width: 300 }}
                        getOptionLabel={(option) => option}
                        onSelect={(
                          event: React.ChangeEvent<HTMLInputElement>,
                        ) => {
                          handleDynamicSelectionChange(
                            key,
                            "property",
                            event.target.value,
                          );
                        }}
                        renderInput={(params) => (
                          <TextField {...params} label="Relates to property" />
                        )}
                      />

                      <Autocomplete
                        id={`autocomplete-value-${key}`}
                        options={columns}
                        sx={{ width: 300 }}
                        getOptionLabel={(option) => option}
                        onSelect={(
                          event: React.ChangeEvent<HTMLInputElement>,
                        ) => {
                          handleDynamicSelectionChange(
                            key,
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
                        id={`autocomplete-unit-${key}`}
                        disableClearable
                        options={columnData?.map((item) => item.itemText) || []}
                        sx={{ width: 300 }}
                        filterOptions={(x) => x}
                        onSelect={handleOntologySearch}
                        onChange={(event, value) => {
                          handleSearchUnitForm(event, value, key);
                        }}
                        renderInput={(params) => (
                          <TextField {...params} label="Has unit" />
                        )}
                      />
                      <Autocomplete
                        id={`autocomplete-timestamp-${key}`}
                        options={columns}
                        sx={{ width: 300 }}
                        getOptionLabel={(option) => option}
                        onSelect={(
                          event: React.ChangeEvent<HTMLInputElement>,
                        ) => {
                          handleDynamicSelectionChange(
                            key,
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
                      id={`autocomplete-made-by-${key}`}
                      disableClearable
                      options={[]}
                      sx={{ width: 300 }}
                      getOptionLabel={(option) => option}
                      onSelect={(
                        event: React.ChangeEvent<HTMLInputElement>,
                      ) => {
                        handleDynamicSelectionChange(
                          key,
                          "madeBy",
                          event.target.value,
                        );
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="Measurement made by" />
                      )}
                    />
                  </>
                )}
              </>
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
