import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

export default function BasicTable({
  tableHeaders,
  tableData,
  handleDownloadButtonClick,
}) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {tableHeaders.map((headerLabel, idx) => {
              return (
                <TableCell
                  key={headerLabel + idx}
                  sx={{ fontWeight: "bold", fontSize: 16 }}
                >
                  {headerLabel}
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((row) => (
            <TableRow
              key={row.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell>{row.original_filename}</TableCell>
              <TableCell>{row.file_id}</TableCell>
              <TableCell>{row.block_id}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleDownloadButtonClick(row.id)}>
                  <DownloadIcon style={{ color: "#4658A8" }} />
                </IconButton>
                {/* <IconButton>
                  <DeleteIcon style={{ color: "#ED4337" }} />
                </IconButton> */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
