"use client";

import { Alert, AlertColor, Snackbar } from "@mui/material";
import React, { createContext, useContext, useState } from "react";

type SnackBarContextActions = {
  showSnackBar: (text: string, typeColor: AlertColor) => void;
};

const SnackBarContext = createContext({} as SnackBarContextActions);

interface SnackBarContextProviderProps {
  children: React.ReactNode;
}

const SnackBarProvider: React.FC<SnackBarContextProviderProps> = ({
  children,
}) => {
  const [queue, setQueue] = useState<
    { text: string; typeColor: AlertColor; margin: number }[]
  >([]);

  const marginBottomRef = React.useRef<number>(0);

  const handleClose = () => {
    setQueue([]);
    marginBottomRef.current = 0;
  };

  const showSnackBar = (text: string, color: AlertColor) => {
    const marginSpace = (marginBottomRef.current += 50);
    setQueue((prevQueue) => [
      ...prevQueue,
      { text, typeColor: color, margin: marginSpace },
    ]);
  };

  return (
    <SnackBarContext.Provider value={{ showSnackBar }}>
      {queue.map(({ text, typeColor, margin }, index) => (
        <Snackbar
          key={index}
          open={true}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          onClose={handleClose}
          style={{
            marginBottom: index === queue.length - 1 ? 0 : margin,
          }}
        >
          <Alert onClose={handleClose} severity={typeColor}>
            {text}
          </Alert>
        </Snackbar>
      ))}
      {children}
    </SnackBarContext.Provider>
  );
};

const useSnackBar = (): SnackBarContextActions => {
  const context = useContext(SnackBarContext);

  if (!context) {
    throw new Error("useSnackBar must be used within an SnackBarProvider");
  }

  return context;
};

export { SnackBarProvider, useSnackBar };
