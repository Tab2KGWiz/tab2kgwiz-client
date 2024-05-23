import React, { use, useEffect, useReducer } from "react";
import DropDownUI from "../../ui/file-input/drop-down";
import useOutsideClick from "../../hooks/useOutsideClick";

interface Props {
  title: string;
  setHeaderMapping: React.Dispatch<React.SetStateAction<Map<string, string>>>;
  headerMapping: Map<string, string>;
  dropDownId: number;
  setIsTableChanged: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRDFGenerated: React.Dispatch<React.SetStateAction<boolean>>;
}

const DropDown: React.FC<Props> = (props): JSX.Element => {
  const [isDropDownOpen, setIsDropDownOpen] = React.useState(false);
  const [selectedDataType, setSelectedDataType] = React.useState(
    props.headerMapping.get(`${props.title}`),
  );

  const handleXSDFormat = (
    event: React.MouseEvent<HTMLInputElement, MouseEvent>,
  ) => {
    const newheaderMapping = new Map(props.headerMapping);
    newheaderMapping.set(props.title, event.currentTarget.value);
    props.setHeaderMapping(newheaderMapping);
    setSelectedDataType(event.currentTarget.value);
    props.setIsTableChanged(true);
    props.setIsRDFGenerated(false);
  };

  const toggleDropDown = () => {
    setIsDropDownOpen(!isDropDownOpen);
  };

  const ref = useOutsideClick(() => {
    setIsDropDownOpen(false);
  });

  return (
    <div ref={ref}>
      <DropDownUI
        toggleDropDown={toggleDropDown}
        isDropDownOpen={isDropDownOpen}
        handleXSDFormat={handleXSDFormat}
        dropDownId={props.dropDownId}
        selectedDataType={selectedDataType}
      />
    </div>
  );
};

export default DropDown;
