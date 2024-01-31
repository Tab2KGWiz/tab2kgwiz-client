import React from "react";

interface Props {
  header: string[] | undefined;
  body: string[][] | undefined;
}

const Table: React.FC<Props> = (props): JSX.Element => {
  console.log(props.body);
  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
            <tr
              key={index}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
            >
              {items.map((item, index) => (
                <td key={index} className="px-6 py-4">
                  {item.toString()}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
