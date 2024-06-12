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
import { Stack, TextField } from "@mui/material";
import useSWR from "swr";
import axios from "axios";
import { useEffect } from "react";
import SendIcon from "@mui/icons-material/Send";
import { useSnackBar } from "../snackbar-provider";

interface Props {
  setOntologySelected: React.Dispatch<React.SetStateAction<string>>;
}

interface Prefix {
  prefix: string;
  uri: string;
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

  const [selectedOntology, setSelectedOntology] = React.useState<string>("");

  const { showSnackBar } = useSnackBar();

  useGetPrefixes(setPrefixesData);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleSave = () => {
    setOpen(false);
    console.log(selectedOntology);
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
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Ontology mapping form"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <DialogContentText id="alert-dialog-slide-description">
              Select the prefix for the ontology
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
