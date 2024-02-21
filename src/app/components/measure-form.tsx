import React from "react";
import MeasureFormUI from "../ui/file-input/measure-form-ui";

interface Props {
  itemsList: string[] | undefined;
}

const MeasureForm: React.FC<Props> = (props): JSX.Element => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [measureMap, setMeasureMap] = React.useState<Map<string, boolean>>(
    new Map(),
  );

  const toogleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toogleMeasure = (
    event: React.MouseEvent<HTMLInputElement, MouseEvent>,
  ) => {
    setMeasureMap(
      // Input-value, Input-checked
      measureMap.set(event.currentTarget.value, event.currentTarget.checked),
    );
  };

  return (
    <MeasureFormUI
      toogleModal={toogleModal}
      isModalOpen={isModalOpen}
      itemsList={props.itemsList}
      toogleMeasure={toogleMeasure}
    ></MeasureFormUI>
  );
};

export default MeasureForm;
