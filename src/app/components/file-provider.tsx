import React, { createContext, useContext, useState } from "react";

type FileContextActions = {
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
};

interface FileProviderProps {
  children: React.ReactNode;
}

const FileContext = createContext({} as FileContextActions);

export const FileProvider: React.FC<FileProviderProps> = ({ children }) => {
  const [file, setFile] = useState<File | null>(null);

  return (
    <FileContext.Provider value={{ file, setFile }}>
      {children}
    </FileContext.Provider>
  );
};

export const useFile = () => useContext(FileContext);
