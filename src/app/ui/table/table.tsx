import React from "react";
import Pagination from "@/app/components/pagination";
import TableUI from "../file-input/table";
import MeasureForm from "@/app/components/measure-form";

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
  totalRows: number;
}

const Table: React.FC<Props> = (props): JSX.Element => {
  return (
    <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
      <div className="mx-auto max-w-full px-6 lg:px-12">
        <MeasureForm
          itemsList={props.header}
          headerMapping={props.headerMapping}
        ></MeasureForm>

        <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <TableUI
              body={props.body}
              header={props.header}
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
            totalRows={props.totalRows}
          />
        </div>
      </div>
    </section>
  );
};

export default Table;
