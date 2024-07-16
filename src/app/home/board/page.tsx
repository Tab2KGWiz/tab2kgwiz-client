"use client";

import React, { useEffect } from "react";
import useSWR from "swr";
import axios from "axios";
import Cookies from "js-cookie";
import Box from "@mui/material/Box";
import { Chip, Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { SortDirection } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import { getComparator, stableSort } from "./helpers";
import EnhancedTableHead from "./EnhancedTableHead";
import EnhancedTableToolbar from "./EnhancedTableToolbar";

interface Props {}

interface MappingResponseData {
  uri: string;
  id: string;
  title: string;
  fileName: string;
  providedBy: string;
  accessible: boolean;
}

function createData(
  id: string,
  mappingId: string,
  title: string,
  fileName: string,
  createdBy: string,
  accessible: boolean,
) {
  return {
    id,
    mappingId,
    title,
    fileName,
    createdBy,
    accessible,
  };
}

const UserBoard: React.FC<Props> = (props): JSX.Element => {
  const { data } = useGetAllMappingsSWR();
  const router = useRouter();
  const [rows, setRows] = React.useState<
    {
      id: string;
      mappingId: string;
      title: string;
      fileName: string;
      createdBy: string;
      accessible: boolean;
    }[]
  >([]);

  const [order, setOrder] = React.useState<SortDirection>("asc");
  const [orderBy, setOrderBy] = React.useState("mappingId");
  const [selected, setSelected] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (event: React.MouseEvent, property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected: string[] = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (
    event: React.MouseEvent<HTMLTableCellElement, MouseEvent>,
    id: string,
  ) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleRowClick = (event: React.MouseEvent, id: string) => {
    router.push(`/home/mappings/${id}/details`);
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rows, rowsPerPage],
  );

  useEffect(() => {
    if (data) {
      const newRows = data.map((data: MappingResponseData) => {
        return createData(
          data.id,
          data.id,
          data.title,
          data.fileName,
          data.providedBy?.split("/")[2],
          data.accessible,
        );
      });

      setRows(newRows);
    }
  }, [data]);

  return (
    <Paper
      sx={{
        maxHeight: "100vh",
        overflow: "auto",
        padding: "12px",
        "@media (min-width: 640px)": {
          padding: "20px",
        },
      }}
    >
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <EnhancedTableToolbar numSelected={selected.length} />
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={dense ? "small" : "medium"}
            >
              <EnhancedTableHead
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                rowCount={rows.length}
              />
              <TableBody>
                {visibleRows.map((row, index) => {
                  const isItemSelected = isSelected(row.mappingId);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell
                        onClick={(event) => handleClick(event, row.mappingId)}
                        padding="checkbox"
                      >
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        onClick={(event) =>
                          handleRowClick(event, row.mappingId)
                        }
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.mappingId}
                      </TableCell>
                      <TableCell
                        onClick={(event) =>
                          handleRowClick(event, row.mappingId)
                        }
                        align="left"
                      >
                        {row.title}
                      </TableCell>
                      <TableCell
                        onClick={(event) =>
                          handleRowClick(event, row.mappingId)
                        }
                        align="left"
                      >
                        {row.fileName}
                      </TableCell>
                      <TableCell
                        onClick={(event) =>
                          handleRowClick(event, row.mappingId)
                        }
                        align="left"
                      >
                        {row.createdBy}
                      </TableCell>
                      <TableCell
                        onClick={(event) =>
                          handleRowClick(event, row.mappingId)
                        }
                        align="left"
                      >
                        <Chip
                          label={row.accessible ? "Public" : "Private"}
                          color={row.accessible ? "info" : "warning"}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 33 : 53) * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        <FormControlLabel
          control={<Switch checked={dense} onChange={handleChangeDense} />}
          label="Dense padding"
        />
      </Box>
    </Paper>
  );
};

const useGetAllMappingsSWR = () => {
  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_TAB2KGWIZ_API_URL}/mappings`,
    async () => {
      axios.defaults.headers.common["Authorization"] =
        `Bearer ${Cookies.get("accessToken")}`;

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_TAB2KGWIZ_API_URL}/mappings`,
      );

      if (response.status === 200) {
        const data: MappingResponseData[] = response.data;
        return data;
      }
      return undefined;
    },
    {
      revalidateOnFocus: false, // Avoid unnecessary refetches on focus
    },
  );

  return { data, error };
};

export default UserBoard;
