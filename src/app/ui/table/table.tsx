import React from "react";
import { Paper } from "@mui/material";

interface Props {
  body?: string[][];
  header?: string[];
}

const TableUI: React.FC<Props> = ({ body, header }): JSX.Element => {
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
            {header?.map((item, index) => (
              <th key={index} scope="col" className="px-6 py-3">
                {item}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body?.map((items, rowIndex) => (
            <tr key={rowIndex} className="border-b dark:border-gray-700">
              {items.map((item, cellIndex) => (
                <td key={cellIndex} className="px-6 py-3">
                  {item}
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
