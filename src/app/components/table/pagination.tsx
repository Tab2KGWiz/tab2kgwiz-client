import React from "react";
import PaginationUi from "@/app/ui/table/pagination-ui";

interface Props {
  pages: number;
  page: number;
  pageSize: number;
  onPageChange: Function;
  previousText: string;
  nextText: string;
  rowsNum: number | undefined;
  totalRows: number;
}

const Pagination: React.FunctionComponent<Props> = ({
  rowsNum,
  page,
  pages,
  pageSize,
  onPageChange,
  previousText,
  nextText,
  totalRows,
}) => {
  const [visiblePages, setVisiblePage] = React.useState<number[]>([]);

  const filterPages = (visiblePages: number[], totalPages: number) => {
    return visiblePages.filter((page) => page <= totalPages);
  };

  const getVisiblePages = (page: number, total: number) => {
    if (total < 7) {
      return filterPages([1, 2, 3, 4, 5, 6], total);
    } else {
      if (page % 5 >= 0 && page > 4 && page + 2 < total) {
        return [1, page - 1, page, page + 1, total];
      } else if (page % 5 >= 0 && page > 4 && page + 2 >= total) {
        return [1, total - 3, total - 2, total - 1, total];
      } else {
        return [1, 2, 3, 4, 5, total];
      }
    }
  };

  const changePage = (nextPage: number) => {
    const activePage = page + 1;

    if (nextPage === activePage) {
      return;
    }

    const visiblePages = getVisiblePages(nextPage, pages);
    setVisiblePage(filterPages(visiblePages, pages));
    onPageChange(nextPage - 1);
  };

  React.useEffect(() => {
    setVisiblePage(getVisiblePages(1, pages));
    changePage(page + 1);
  }, [pages]);

  const activePage: number = page + 1;

  return (
    <PaginationUi
      rowsNum={rowsNum}
      page={page}
      pageSize={pageSize}
      pages={pages}
      activePage={activePage}
      previousText={previousText}
      changePage={changePage}
      visiblePages={visiblePages}
      nextText={nextText}
      totalRows={totalRows}
    />
  );
};

export default Pagination;
