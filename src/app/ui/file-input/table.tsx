import React from "react";
import DropDown from "@/app/components/drop-down";
import MeasureForm from "@/app/components/measure-form";

interface Props {
  body: string[][] | undefined;
  header: string[] | undefined;
  setHeaderMapping: React.Dispatch<React.SetStateAction<Map<string, string>>>;
  headerMapping: Map<string, string>;
}

const TableUI: React.FC<Props> = (props): JSX.Element => {
  return (
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          {props.header?.map((item, index) => (
            <th key={index} scope="col" className="px-6 py-3">
              {item.toString()}
              <MeasureForm
                columnValue={item}
                headerMapping={props.headerMapping}
              ></MeasureForm>
              <DropDown
                // dataType={props.headerMapping.get(`${item.toString()}`)}
                dropDownId={index}
                setHeaderMapping={props.setHeaderMapping}
                title={item.toString()}
                headerMapping={props.headerMapping}
              />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {props.body?.map((items, index) => (
          <tr key={index} className="border-b dark:border-gray-700">
            {items.map((item, index) => (
              <td key={index} className="px-6 py-3">
                {item.toString()}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableUI;
