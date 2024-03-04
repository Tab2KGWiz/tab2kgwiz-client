import React, { use, useEffect, useReducer } from "react";
import AlertsUI from "../ui/alerts";

interface Props {
  message: string;
  type: string;
}

const Alerts: React.FC<Props> = (props): JSX.Element => {
  const [showAlert, setShowAlert] = React.useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAlert(false);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  const toggleAlert = () => {
    setShowAlert(!showAlert);
  };

  return (
    <AlertsUI
      message={props.message}
      type={props.type}
      showAlert={showAlert}
      toggleAlert={toggleAlert}
    />
  );
};

export default Alerts;
