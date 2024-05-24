import PaginationButton from "./pagination-button";
import React from "react";

interface Props {
  pages: number;
  page: number;
  pageSize: number;
  previousText: string;
  nextText: string;
  rowsNum: number | undefined;
  activePage: number;
  changePage: (nextPage: number) => void;
  visiblePages: number[];
  totalRows: number;
}

const PaginationUi: React.FC<Props> = ({
  rowsNum,
  page,
  pageSize,
  pages,
  activePage,
  previousText,
  changePage,
  visiblePages,
  nextText,
  totalRows,
}) => {
  return (
    <div>
      <nav
        className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
        aria-label="Table navigation"
      >
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
          {rowsNum
            ? `Showing ${page * pageSize + 1} - ${
                page + 1 === pages ? totalRows : (page + 1) * pageSize
              } of ${totalRows} results`
            : `No results found`}
        </span>

        <ul className="inline-flex items-stretch -space-x-px">
          <li>
            <div
              className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300
                        hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 
                        dark:hover:text-white"
            >
              <PaginationButton
                onClick={() => {
                  if (activePage === 1) return;
                  changePage(activePage - 1);
                }}
                disabled={activePage === 1}
              >
                <span className="sr-only">{previousText}</span>
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </PaginationButton>
            </div>
          </li>

          {visiblePages.map((page, index, array) => {
            return (
              <li
                key={page}
                className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 
                            hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <PaginationButton
                  key={page}
                  className={activePage === page ? "active" : null}
                  onClick={() => changePage(page)}
                >
                  {array[index - 1] + 2 < page ? `...` : page}
                </PaginationButton>
              </li>
            );
          })}

          <li>
            <div
              className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 
                          hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <PaginationButton
                onClick={() => {
                  if (activePage === pages) return;
                  changePage(activePage + 1);
                }}
                disabled={activePage === pages}
              >
                <span className="sr-only">{nextText}</span>
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>{" "}
              </PaginationButton>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default PaginationUi;
