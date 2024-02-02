import React from "react";
import DropDownUI from "../ui/file-input/drop-down";

interface Props {
  dataType: string | undefined;
}

const DropDown: React.FC<Props> = (props): JSX.Element => {
  const [isDropDownOpen, setIsDropDownOpen] = React.useState(false);

  const toggleDropDown = () => {
    setIsDropDownOpen(!isDropDownOpen);
  };

  return (
    <div>
      <DropDownUI
        toggleDropDown={toggleDropDown}
        isDropDownOpen={isDropDownOpen}
        dataType={props.dataType}
      />
    </div>
  );
};

export default DropDown;
