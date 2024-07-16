import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  Autocomplete,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import axios from "axios";
import { useSnackBar } from "../snackbar-provider";
import { SelectChangeEvent } from "@mui/material/Select";
import { SyntheticEvent } from "react";
import xsdDataType from "@/app/utils/xsdDataTypes";
import ColumnData from "@/app/utils/columnData";

interface Props {
  headerMapping: Map<string, string>;
  setHeaderMapping: React.Dispatch<React.SetStateAction<Map<string, string>>>;
  setIsTableChanged: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRDFGenerated: React.Dispatch<React.SetStateAction<boolean>>;
  setPrefixesURI: React.Dispatch<React.SetStateAction<Map<string, string>>>;
  prefixesURI: Map<string, string>;
  columnsData: ColumnData[];
  setColumnsData: React.Dispatch<React.SetStateAction<ColumnData[]>>;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const OntologyDialog: React.FC<Props> = ({
  headerMapping,
  setHeaderMapping,
  setIsTableChanged,
  setIsRDFGenerated,
  setPrefixesURI,
  prefixesURI,
  columnsData,
  setColumnsData,
}): JSX.Element => {
  const [open, setOpen] = React.useState(false);
  const [ontologyData, setFetchedOntologyData] = React.useState<
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
    column: React.Key,
    field: keyof ColumnData,
    value: string | boolean | null | undefined,
  ) => {
    setIsTableChanged(true);
    setIsRDFGenerated(false);

    setColumnsData((prev) => {
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
    key: React.Key,
  ) => {
    const value = event.target.value;
    if (value === "Measurement") {
      handleDynamicSelectionChange(key, "measurement", true);
      handleDynamicSelectionChange(key, "identifier", false);
      // When a column is changed to measurement, the identifier field should be cleared
      handleDynamicSelectionChange(key, "relatedTo", "");
      handleDynamicSelectionChange(key, "relationShip", "");
    } else if (value === "Id") {
      handleDynamicSelectionChange(key, "identifier", true);
      handleDynamicSelectionChange(key, "measurement", false);
      // When a column is changed to identifier, the measurement field should be cleared
      handleDynamicSelectionChange(key, "hasUnit", "");
      handleDynamicSelectionChange(key, "hasTimestamp", "");
      handleDynamicSelectionChange(key, "isMeasurementOf", "");
      handleDynamicSelectionChange(key, "measurementMadeBy", "");
    } else if (value === "Nothing") {
      handleDynamicSelectionChange(key, "identifier", false);
      handleDynamicSelectionChange(key, "measurement", false);
      handleDynamicSelectionChange(key, "relatedTo", "");
      handleDynamicSelectionChange(key, "relationShip", "");
      handleDynamicSelectionChange(key, "hasUnit", "");
      handleDynamicSelectionChange(key, "hasTimestamp", "");
      handleDynamicSelectionChange(key, "isMeasurementOf", "");
      handleDynamicSelectionChange(key, "measurementMadeBy", "");
    }
  };

  const handleSearchOntoForm = (
    event: React.SyntheticEvent<Element, Event>,
    value: string,
    key: React.Key,
  ) => {
    ontologyData?.forEach((item) => {
      if (item.itemText === value) {
        handleDynamicSelectionChange(key, "ontologyType", item.prefixed);
        handleDynamicSelectionChange(key, "ontologyURI", item.iri.value);
        handleDynamicSelectionChange(key, "label", item.label);
        handleDynamicSelectionChange(key, "prefix", item.prefixedSplitA);

        const tempPrefixsURI = new Map(prefixesURI);
        tempPrefixsURI.set(item.prefixedSplitA, item.iriSplitA);
        setPrefixesURI(tempPrefixsURI);
        return;
      }
    });
  };

  const handleSearchUnitForm = (
    event: React.SyntheticEvent<Element, Event>,
    value: string,
    key: React.Key,
  ) => {
    ontologyData?.forEach((item) => {
      if (item.itemText === value) {
        handleDynamicSelectionChange(key, "hasUnit", item.prefixed);
        const tempPrefixsURI = new Map(prefixesURI);
        tempPrefixsURI.set(item.prefixedSplitA, item.iriSplitA);
        setPrefixesURI(tempPrefixsURI);
        return;
      }
    });
  };

  const handleSearchRelationshipForm = (
    event: React.SyntheticEvent<Element, Event>,
    value: string,
    key: React.Key,
  ) => {
    ontologyData?.forEach((item) => {
      if (item.itemText === value) {
        handleDynamicSelectionChange(key, "relationShip", item.prefixed);
        const tempPrefixsURI = new Map(prefixesURI);
        tempPrefixsURI.set(item.prefixedSplitA, item.iriSplitA);
        setPrefixesURI(tempPrefixsURI);
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

    setFetchedOntologyData(ontologyData);
  };

  const renderColumnFields = (key: React.Key) => {
    const columnData = columnsData.find((data) => data.title === key);

    return (
      <>
        <Typography
          key={key}
          variant="body1"
          fontWeight={"bold"}
        >{`${key}`}</Typography>
        <Stack key={key} direction={"row"} spacing={2}>
          <FormControl sx={{ width: 300 }}>
            <InputLabel id={`${key}-input-label`}>Column Type</InputLabel>
            <Select
              labelId={`${key}-label`}
              id={`${key}-select-id`}
              label="Column Type"
              onChange={(event: SelectChangeEvent<string>) =>
                handleMeasurementColumnSelect(event, key)
              }
              defaultValue={
                columnData?.measurement
                  ? "Measurement"
                  : columnData?.identifier
                    ? "Id"
                    : "Nothing"
              }
            >
              <MenuItem value={"Id"}>Identifier</MenuItem>
              <MenuItem value={"Measurement"}>Measurement</MenuItem>
              {/* <MenuItem value={"Other"}>Other</MenuItem> */}
              <MenuItem value={"Nothing"}>Not mapped</MenuItem>
            </Select>
          </FormControl>

          <Autocomplete
            id={`xsd-autocomplete-${key}`}
            options={xsdDataType}
            sx={{ width: 300 }}
            getOptionLabel={(option) => option}
            defaultValue={columnData?.dataType?.split(":")[1]}
            onChange={(event, value) => {
              setIsTableChanged(true);
              setIsRDFGenerated(false);
              handleDynamicSelectionChange(key, "dataType", "xsd:" + value);
            }}
            renderInput={(params) => (
              <TextField {...params} label="XSD Data Type" />
            )}
          />

          {columnData?.measurement && (
            <Autocomplete
              freeSolo
              id={`${key}-measuring-autocomplete`}
              disableClearable
              options={ontologyData?.map((item) => item.itemText) || []}
              sx={{ width: 300 }}
              filterOptions={(x) => x}
              onSelect={handleOntologySearch}
              onChange={(event, value) => {
                handleSearchOntoForm(event, value, key);
              }}
              renderInput={(params) => (
                <TextField {...params} label="What is it measuring?" />
              )}
              defaultValue={columnData?.ontologyType}
            />
          )}

          {columnData?.identifier && (
            <Autocomplete
              freeSolo
              id={`${key}-typeentity-autocomplete`}
              disableClearable
              options={ontologyData?.map((item) => item.itemText) || []}
              sx={{ width: 300 }}
              filterOptions={(x) => x}
              onSelect={handleOntologySearch}
              onChange={(event, value) => {
                handleSearchOntoForm(event, value, key);
              }}
              renderInput={(params) => (
                <TextField {...params} label="Type of entity" />
              )}
              defaultValue={columnData?.ontologyType}
            />
          )}
        </Stack>

        {columnData?.measurement && renderMeasurementFields(key, columnData)}
        {columnData?.identifier && renderIdentifierFields(key, columnData)}
      </>
    );
  };

  const renderIdentifierFields = (key: React.Key, columnData: ColumnData) => {
    return (
      <Stack direction={"row"} spacing={2}>
        <Autocomplete
          id={`autocomplete-relatedTo-${key}`}
          options={columnsData
            .filter((data) => data.identifier === true)
            .map((data) => data.title)}
          sx={{ width: 300 }}
          getOptionLabel={(option) => option}
          onChange={(
            event: SyntheticEvent<Element, Event>,
            value: string | null,
          ) => {
            handleDynamicSelectionChange(key, "relatedTo", value);
          }}
          defaultValue={
            columnsData.find((data) => data.title === key)?.relatedTo ||
            "Not mapped"
          }
          renderInput={(params) => <TextField {...params} label="Related to" />}
        />

        {columnData.relatedTo && (
          <Autocomplete
            freeSolo
            id={`autocomplete-relationship-${key}`}
            disableClearable
            options={ontologyData?.map((item) => item.itemText) || []}
            sx={{ width: 300 }}
            filterOptions={(x) => x}
            onSelect={handleOntologySearch}
            onChange={(event, value) => {
              handleSearchRelationshipForm(event, value, key);
            }}
            defaultValue={
              columnsData.find((data) => data.title === key)?.relationShip
            }
            renderInput={(params) => (
              <TextField {...params} label="Relationship" />
            )}
          />
        )}
      </Stack>
    );
  };

  const renderMeasurementFields = (key: React.Key, columnData: ColumnData) => {
    return (
      <>
        <Stack direction={"row"} spacing={2}>
          <Autocomplete
            freeSolo
            id={`autocomplete-unit-${key}`}
            disableClearable
            options={ontologyData?.map((item) => item.itemText) || []}
            sx={{ width: 300 }}
            filterOptions={(x) => x}
            onSelect={handleOntologySearch}
            onChange={(event, value) => {
              handleSearchUnitForm(event, value, key);
            }}
            defaultValue={columnData.hasUnit}
            renderInput={(params) => <TextField {...params} label="Has unit" />}
          />
          <Autocomplete
            id={`autocomplete-timestamp-${key}`}
            options={columnsData.map((data) => data.title)}
            sx={{ width: 300 }}
            getOptionLabel={(option) => option}
            onChange={(
              event: SyntheticEvent<Element, Event>,
              value: string | null,
            ) => {
              handleDynamicSelectionChange(key, "hasTimestamp", value);
            }}
            defaultValue={columnData.hasTimestamp}
            renderInput={(params) => (
              <TextField {...params} label="Has timestamp" />
            )}
          />
          <Autocomplete
            id={`autocomplete-isMeasurementOf-${key}`}
            options={columnsData
              .filter((data) => data.identifier === true)
              .map((data) => data.title)}
            sx={{ width: 300 }}
            getOptionLabel={(option) => option}
            onChange={(
              event: SyntheticEvent<Element, Event>,
              value: string | null,
            ) => {
              handleDynamicSelectionChange(key, "isMeasurementOf", value);
            }}
            defaultValue={columnData.isMeasurementOf}
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
          onSelect={(event: React.ChangeEvent<HTMLInputElement>) => {
            handleDynamicSelectionChange(
              key,
              "measurementMadeBy",
              event.target.value,
            );
          }}
          defaultValue={columnData.measurementMadeBy}
          renderInput={(params) => (
            <TextField {...params} label="Measurement made by" />
          )}
        />
      </>
    );
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Map
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

            {Array.from(headerMapping.entries()).map(([key, value]) =>
              renderColumnFields(key),
            )}
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
