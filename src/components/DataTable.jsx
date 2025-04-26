import React, { useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Button,
  Modal, Menu, MenuItem, TablePagination, IconButton
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../theme'

//Reusable Data Table Component
const DataTable = ({ rows, columns, title, subtitle, handleView, handleAction1, handleAction2, handleAction3, action1Label, action2Label, action3Label }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // Modal style
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

  // State for the dropdown menu
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewClick = (row) => {
    setSelectedRow(row);
    setOpenViewModal(true);
    handleView(row);
  };

  const handleCloseModal = () => {
    setOpenViewModal(false);
  };

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h2" fontWeight="600" color={colors.grey[100]}>
            {title}
          </Typography>
          <Typography variant="subtitle2" fontSize={'16px'} color={colors.greenAccent[500]}>
            {subtitle}
          </Typography>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ mt: '20px' }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.field}>{column.headerName}</TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow key={row.id}>
                {columns.map((column) => (
                  <TableCell key={column.field}>{row[column.field]}</TableCell>
                ))}
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleViewClick(row)}
                    sx={{
                      color: colors.greenAccent[500],
                      borderColor: colors.greenAccent[500],
                      '&:hover': {
                        backgroundColor: colors.greenAccent[700],
                        borderColor: colors.greenAccent[700],
                        color: colors.grey[100],
                      },
                    }}
                  >
                    View
                  </Button>

                  <IconButton
                    aria-label="actions"
                    aria-controls={isMenuOpen ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={isMenuOpen ? 'true' : undefined}
                    onClick={handleClick}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={isMenuOpen}
                    onClose={handleClose}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button',
                    }}
                  >
                    <MenuItem onClick={() => { handleClose(); handleAction1(row.id); }}>{action1Label}</MenuItem>
                    <MenuItem onClick={() => { handleClose(); handleAction2(row.id); }}>{action2Label}</MenuItem>
                    <MenuItem onClick={() => { handleClose(); handleAction3(row.id); }}>{action3Label}</MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={rows.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* View Modal */}
      <Modal
        open={openViewModal}
        onClose={handleCloseModal}
        aria-labelledby="view-modal"
        aria-describedby="view-details"
      >
        <Box sx={style}>
          {selectedRow && (
            <div>
              <Typography id="view-modal" variant="h6" component="h2">
                Details
              </Typography>
              {/* Access and display the data from the selectedRow */}
              {columns.map((column) => (
                <Typography key={column.field} id="view-details" sx={{ mt: 2 }}>
                  <strong>{column.headerName}:</strong> {selectedRow[column.field]}<br />
                </Typography>
              ))}
              <Button variant="outlined" color="secondary" onClick={handleCloseModal}>Close</Button>
            </div>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default DataTable;