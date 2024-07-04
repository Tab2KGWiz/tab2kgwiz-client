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
import axios from "axios";
import { useSnackBar } from "../snackbar-provider";
import { SelectChangeEvent } from "@mui/material/Select";
import { SyntheticEvent } from "react";
import xsdDataType from "@/app/utils/xsdDataTypes";
import MeasurementColumnData from "@/app/utils/measurementColumnData";

interface Props {
  headerMapping: Map<string, string>;
  setHeaderMapping: React.Dispatch<React.SetStateAction<Map<string, string>>>;
  setIsTableChanged: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRDFGenerated: React.Dispatch<React.SetStateAction<boolean>>;
  setPrefixesURI: React.Dispatch<
    React.SetStateAction<Map<string, string> | undefined>
  >;
  prefixesURI: Map<string, string> | undefined;
  columnsData: MeasurementColumnData[];
  setColumnsData: React.Dispatch<React.SetStateAction<MeasurementColumnData[]>>;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const OntologyDialog: React.FC<Props> = (props): JSX.Element => {
  const [open, setOpen] = React.useState(false);
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
      iriSplitA: string;
      prefixedSplitA: string;
    }[]
  >();

  const { showSnackBar } = useSnackBar();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDynamicSelectionChange = (
    column: string,
    field: keyof MeasurementColumnData,
    value: string | boolean | null,
  ) => {
    props.setIsTableChanged(true);
    props.setIsRDFGenerated(false);

    props.setColumnsData((prev) => {
      const existingColumn = prev.find((data) => data.title === column);
      if (existingColumn) {
        return prev.map((data) =>
          data.title === column ? { ...data, [field]: value } : data,
        );
      }
      return prev;
    });
  };

  const handleMeasurementColumnSelect = (
    event: SelectChangeEvent<string>,
    key: string,
  ) => {
    if (event.target.value === "Measurement") {
      handleDynamicSelectionChange(key, "measurement", true);

      if (
        props.columnsData.find(
          (data) => data.title === key && data.identifier === true,
        )
      ) {
        handleDynamicSelectionChange(key, "identifier", false);
      }
    } else if (event.target.value === "Id") {
      handleDynamicSelectionChange(key, "identifier", true);

      if (
        props.columnsData.find(
          (data) => data.title === key && data.measurement === true,
        )
      ) {
        handleDynamicSelectionChange(key, "measurement", false);
      }
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
        handleDynamicSelectionChange(key, "prefix", item.prefixedSplitA);

        const tempPrefixsURI = new Map(props.prefixesURI);
        tempPrefixsURI.set(item.prefixedSplitA, item.iriSplitA);
        props.setPrefixesURI(tempPrefixsURI);
        return;
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
        handleDynamicSelectionChange(key, "hasUnit", item.prefixed);
        const tempPrefixsURI = new Map(props.prefixesURI);
        tempPrefixsURI.set(item.prefixedSplitA, item.iriSplitA);
        props.setPrefixesURI(tempPrefixsURI);
        return;
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
      iriSplitA: string;
      prefixedSplitA: string;
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
        onClose={handleClose}
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
                      onChange={(event: SelectChangeEvent<string>) =>
                        handleMeasurementColumnSelect(event, key)
                      }
                      defaultValue={
                        props.columnsData.find((data) => data.title === key)
                          ?.measurement
                          ? "Measurement"
                          : props.columnsData.find((data) => data.title === key)
                                ?.identifier
                            ? "Id"
                            : undefined
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
                      <TextField {...params} label="What is it measuring?" />
                    )}
                    defaultValue={
                      props.columnsData.find((data) => data.title === key)
                        ?.ontologyType
                    }
                  />
                  <Autocomplete
                    id={`xsd-autocomplete-${key}`}
                    options={xsdDataType}
                    sx={{ width: 300 }}
                    getOptionLabel={(option) => option}
                    defaultValue={
                      props.columnsData
                        .find((data) => data.title === key)
                        ?.dataType?.split(":")[1]
                    }
                    onChange={(event, value) => {
                      props.setIsTableChanged(true);
                      props.setIsRDFGenerated(false);
                      handleDynamicSelectionChange(
                        key,
                        "dataType",
                        `xsd:${value}`,
                      );
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="XSD Data Type" />
                    )}
                  />
                </Stack>

                {props.columnsData.find((data) => data.title === key)
                  ?.measurement === true && (
                  <>
                    <Stack direction={"row"} spacing={2}>
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
                        defaultValue={
                          props.columnsData.find((data) => data.title === key)
                            ?.hasUnit
                        }
                        renderInput={(params) => (
                          <TextField {...params} label="Has unit" />
                        )}
                      />
                      <Autocomplete
                        id={`autocomplete-timestamp-${key}`}
                        options={columns}
                        sx={{ width: 300 }}
                        getOptionLabel={(option) => option}
                        onChange={(
                          event: SyntheticEvent<Element, Event>,
                          value: string | null,
                        ) => {
                          handleDynamicSelectionChange(
                            key,
                            "hasTimestamp",
                            value,
                          );
                        }}
                        defaultValue={
                          props.columnsData.find((data) => data.title === key)
                            ?.hasTimestamp
                        }
                        renderInput={(params) => (
                          <TextField {...params} label="Has timestamp" />
                        )}
                      />
                      <Autocomplete
                        id={`autocomplete-isMeasurementOf-${key}`}
                        options={props.columnsData
                          .filter((data) => data.identifier === true)
                          .map((data) => data.title)}
                        sx={{ width: 300 }}
                        getOptionLabel={(option) => option}
                        onChange={(
                          event: SyntheticEvent<Element, Event>,
                          value: string | null,
                        ) => {
                          handleDynamicSelectionChange(
                            key,
                            "isMeasurementOf",
                            value,
                          );
                        }}
                        defaultValue={
                          props.columnsData.find((data) => data.title === key)
                            ?.isMeasurementOf
                        }
                        renderInput={(params) => (
                          <TextField {...params} label="Is measurement of" />
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
                          "measurementMadeBy",
                          event.target.value,
                        );
                      }}
                      defaultValue={
                        props.columnsData.find((data) => data.title === key)
                          ?.measurementMadeBy
                      }
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
          <Button sx={{ marginRight: 4 }} onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default OntologyDialog;
