import React from "react";
import Pagination from "@/app/components/pagination";
import TableUI from "../ui/file-input/table";
import { postYaml } from "../services/post-yaml";
import { postYarrrml } from "../services/post-yarrrml";
import { useSnackBar } from "./snackbar-provider";

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
  mappingName: string | undefined;
}

const Table: React.FC<Props> = (props): JSX.Element => {
  const { showSnackBar } = useSnackBar();

  const handleGenerateYaml = async () => {
    if ((await postYaml(props.mappingName ? props.mappingName : "")) === -1) {
      showSnackBar("Error generating yaml file", "error");
    } else showSnackBar("Yaml file generated successfully", "success");
  };

  const handleYarrrmlParser = async () => {
    if ((await postYarrrml()) === -1) {
      showSnackBar("Error parsing yarrrml", "error");
    } else showSnackBar("Yarrrml parsed successfully", "success");
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
      <div className="flex">
        <button
          data-modal-target="popup-modal"
          data-modal-toggle="popup-modal"
          className="block ml-12 mb-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm 
        px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          type="button"
          onClick={handleGenerateYaml}
        >
          Generate Yaml
        </button>

        <button
          data-modal-target="popup-modal"
          data-modal-toggle="popup-modal"
          className="block ml-12 mb-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm 
        px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          type="button"
          onClick={handleYarrrmlParser}
        >
          Yarrrml parser
        </button>
      </div>

      <div className="mx-auto max-w-full px-6 lg:px-12">
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
