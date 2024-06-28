import React from "react";
import { Paper } from "@mui/material";

interface Props {
  body: string[][] | undefined;
  header: string[] | undefined;
  headerMapping: Map<string, string>;
}

const TableUI: React.FC<Props> = (props): JSX.Element => {
  return (
    <Paper
      sx={{
        maxHeight: "65vh",
        overflow: "auto",
      }}
    >
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {props.header?.map((item, index) => (
              <th key={index} scope="col" className="px-6 py-3">
                {item.toString()}
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
    </Paper>
  );
};

export default TableUI;
