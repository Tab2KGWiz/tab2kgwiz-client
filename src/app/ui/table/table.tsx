import React from "react";
import Pagination from "@/app/components/pagination";
import TableUI from "../file-input/table";

interface Props {
  header: string[] | undefined;
  body: string[][] | undefined;
  pages: number;
  page: number;
  pageSize: number;
  onPageChange: Function;
  previousText: string;
  nextText: string;
  setHeaderMapping: React.Dispatch<React.SetStateAction<Map<string, string>>>;
  headerMapping: Map<string, string>;
  xsdDataType: string[] | undefined;
}

const Table: React.FC<Props> = (props): JSX.Element => {
  return (
    <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
        <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <TableUI
              body={props.body}
              header={props.header}
              xsdDataType={props.xsdDataType}
              setHeaderMapping={props.setHeaderMapping}
              headerMapping={props.headerMapping}
            />
          </div>
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
    </section>
  );
};

export default Table;
