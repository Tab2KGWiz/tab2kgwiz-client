import React, { use, useEffect, useReducer } from "react";
import AlertsUI from "../ui/alerts";

interface Props {
  message: string;
  type: string;
  setAlertState: (state: string) => void;
}

const Alerts: React.FC<Props> = (props): JSX.Element => {
  //const [showAlert, setShowAlert] = React.useState(props.showAlert);
  useEffect(() => {
    const timer = setTimeout(() => {
      props.setAlertState("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [props]);

  const toggleAlert = () => {
    props.setAlertState("");
  };

  return (
    <AlertsUI
      message={props.message}
      type={props.type}
      toggleAlert={toggleAlert}
    />
  );
};

export default Alerts;
