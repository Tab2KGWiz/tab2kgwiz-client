import React from "react";
import Pagination from "@/app/components/pagination";
import DropDown from "@/app/components/drop-down";

interface Props {
  header: string[] | undefined;
  body: string[][] | undefined;
  pages: number;
  page: number;
  pageSize: number;
  onPageChange: Function;
  previousText: string;
  nextText: string;
  headerMapping: Map<string, string>;
}

const Table: React.FC<Props> = (props): JSX.Element => {
  return (
    <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
        <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  {props.header?.map((item, index) => (
                    <th key={index} scope="col" className="px-6 py-3 ">
                      {item.toString()}
                      <DropDown
                        dataType={props.headerMapping.get(`${item.toString()}`)}
                      />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {props.body?.map((items, index) => (
                  <tr key={index} className="border-b dark:border-gray-700">
                    {items.map((item, index) => (
                      <td key={index} className="px-4 py-3">
                        {item.toString()}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              page={props.page}
              pages={props.pages}
              pageSize={props.pageSize}
              onPageChange={props.onPageChange}
              previousText="Previous"
              nextText="Next"
              rowsNum={props.body?.length}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Table;
