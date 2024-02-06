import React from "react";
import DropDownUI from "../ui/file-input/drop-down";
import useOutsideClick from "../hooks/useOutSideClick";

interface Props {
  xsdDataType: string[] | undefined;
  title: string;
  setHeaderMapping: React.Dispatch<React.SetStateAction<Map<string, string>>>;
  headerMapping: Map<string, string>;
}

const DropDown: React.FC<Props> = (props): JSX.Element => {
  const [isDropDownOpen, setIsDropDownOpen] = React.useState(false);

  const handleXSDFormat = (
    event: React.MouseEvent<HTMLInputElement, MouseEvent>,
  ) => {
    props.setHeaderMapping(
      props.headerMapping.set(props.title, event.currentTarget.value),
    );
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
        dataType={props.headerMapping.get(`${props.title}`)}
        xsdDataType={props.xsdDataType}
        handleXSDFormat={handleXSDFormat}
      />
    </div>
  );
};

export default DropDown;
