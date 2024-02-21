import React, { useEffect } from "react";
import MeasureFormUI from "../ui/file-input/measure-form-ui";

interface Props {
  itemsList: string[] | undefined;
  headerMapping: Map<string, string>;
}

const MeasureForm: React.FC<Props> = (props): JSX.Element => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [measureMap, setMeasureMap] = React.useState<Map<string, boolean>>(
    new Map(),
  );

  // Map the measurement fields according to their data type
  React.useEffect(() => {
    const newMeasureMap = new Map<string, boolean>();
    props.headerMapping.forEach((value, key) => {
      if (
        value == "date" ||
        value == "time" ||
        value == "dateTime" ||
        value == "gDay" ||
        value == "gMonth" ||
        value == "gYear" ||
        value == "duration" ||
        value == "gMonthDay" ||
        value == "gYearMonth" ||
        value == "integer" ||
        value == "decimal" ||
        value == "float" ||
        value == "double"
      ) {
        newMeasureMap.set(key, true);
      } else {
        newMeasureMap.set(key, false);
      }
    });
    setMeasureMap(newMeasureMap);
  }, [props.headerMapping]);

  const toogleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toogleMeasure = (
    event: React.MouseEvent<HTMLInputElement, MouseEvent>,
  ) => {
    const newValue = event.currentTarget.checked;
    const key = event.currentTarget.value;

    // Asynchronously function to update the state, if we want to console.log the state after the update, we should use the useEffect hook
    setMeasureMap((prevMeasureMap) => {
      const newMeasureMap = new Map(prevMeasureMap);
      // Input-value, Input-checked
      newMeasureMap.set(key, newValue);

      return newMeasureMap;
    });
  };

  return (
    <MeasureFormUI
      toogleModal={toogleModal}
      isModalOpen={isModalOpen}
      itemsList={props.itemsList}
      toogleMeasure={toogleMeasure}
      measureMap={measureMap}
    ></MeasureFormUI>
  );
};

export default MeasureForm;
