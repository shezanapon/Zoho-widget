import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Button, TextField, Typography } from "@mui/material";
import Box from "@mui/material/Box";

const ZOHO = window.ZOHO;

const columns = [
  { id: "name", label: "Deal Name", minWidth: 170 },
  { id: "code", label: "Company Name", minWidth: 100 },
  {
    id: "population",
    label: "Email",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "size",
    label: "Deal Status",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "density",
    label: "Deal Amount($)",
    minWidth: 170,
    align: "right",
    format: (value) => value.toFixed(2),
  },
];

function createData(name, code, population, size) {
  const density = population / size;
  return { name, code, population, size, density };
}

const rows = [
  createData("China", "CN", 1403500365, 9596961),
  createData("Italy", "IT", 60483973, 301340),
  createData("United States", "US", 327167434, 9833520),
  createData("Canada", "CA", 37602103, 9984670),
  createData("Australia", "AU", 25475400, 7692024),
  createData("Germany", "DE", 83019200, 357578),
  createData("Ireland", "IE", 4857000, 70273),
  createData("Mexico", "MX", 126577691, 1972550),
  createData("Japan", "JP", 126317000, 377973),
  createData("France", "FR", 67022000, 640679),
  createData("United Kingdom", "GB", 67545757, 242495),
  createData("Russia", "RU", 146793744, 17098246),
  createData("Nigeria", "NG", 200962417, 923768),
  createData("Brazil", "BR", 210147125, 8515767),
];

export default function ColumnGroupingTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const [zohoLoaded, setZohoLoaded] = React.useState(false);

  React.useEffect(() => {
    ZOHO.embeddedApp.on("PageLoad", function (data) {
      //Custom Bussiness logic goes here
      console.log(data);
    });
    /*
     * initializing the widget.
     */
    ZOHO.embeddedApp.init().then(() => {
      setZohoLoaded(true);
    });
  }, []);

  const [allData, setAllData] = React.useState([]);

  React.useEffect(() => {
    if (zohoLoaded) {
      ZOHO.CRM.API.getAllRecords({
        Entity: "Deals",
        sort_order: "asc",
        per_page: 200,
        page: 1,
      }).then(function (data) {
        setAllData(data.data);
      });
    }
  }, [zohoLoaded]);

  return (
    <Box>
      <Typography variant="h4" textAlign="center" marginTop="40px">
        Basic Deal info Widget
      </Typography>
      {console.log({ allData })}
      <Paper
        elevation={3}
        sx={{
          height: "673px",
          width: "1389px",
          padding: "20px,0px,20px,0px",
          gap: "11px",
          borderRadius: "16px",
          marginLeft: "15%",
          marginTop: "5%",
        }}
      >
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell align="center" colSpan={1}>
                  <TextField
                    id="outlined-basic"
                    label="Search..."
                    variant="outlined"
                    sx={{
                      width: "400px",
                    }}
                  />
                </TableCell>
                <TableCell align="right" colSpan={4}>
                  <Button variant="contained">CREATE CONTACT</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    sx={{ backgroundColor: "#eeeeee", fontWeight: "bold" }}
                    key={column.id}
                    align={column.align}
                    style={{ top: 57, minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {allData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.code}
                    >
                      <TableCell>{row.Deal_Name}</TableCell>
                      <TableCell> {row.Created_By.name} </TableCell>
                      <TableCell>{row.Created_By.email}</TableCell>
                      <TableCell>{row.Stage}</TableCell>
                      <TableCell align="right">{row.Amount}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
