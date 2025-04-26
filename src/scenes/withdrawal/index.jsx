import React, { useState } from 'react';
import {
  Box, Typography, TextField, Button, ButtonGroup, Grid, Menu, MenuItem, Link, Modal
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { withdrawalRequestsData } from "../../data/mockData";
import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme';
import useMediaQuery from '@mui/material/useMediaQuery';

const WithdrawalRequest = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchText, setSearchText] = useState('');

  const filteredRows = withdrawalRequestsData.filter((row) =>
    row.eventName.toLowerCase().includes(searchText.toLowerCase()) ||
    row.eventDate.toLowerCase().includes(searchText.toLowerCase()) ||
    row.eventId.toString().toLowerCase().includes(searchText.toLowerCase()) 
  );

  // Modal style (same as TeamManager)
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

  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setOpenMenuId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpenMenuId(null);
  };

  const handleView = (request) => {
    setSelectedRequest(request);
    setOpenViewModal(true);
  };

  const handleCloseModal = () => {
    setOpenViewModal(false);
  };

  // Function to handle Approve action
  const handleApprove = (requestId) => {
    // Add your logic to approve the withdrawal request here
    console.log(`Approving withdrawal request with ID: ${requestId}`);
  };

  // Function to handle Decline action
  const handleDecline = (requestId) => {
    // Add your logic to decline the withdrawal request here
    console.log(`Declining withdrawal request with ID: ${requestId}`);
  };

  const columns = [
    { field: 'eventDate', headerName: 'Event Date', width: 130 },
    { field: 'eventName', headerName: 'Event Name', flex: 1 },
    { field: 'amountRequested', headerName: 'Amount Requested', flex: 1 },
    { field: 'amountContributed', headerName: 'Amount Contributed', flex: 1 },
    { field: 'eventId', headerName: 'Event ID', flex: 1 },
    { field: 'status', headerName: 'Status', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <ButtonGroup variant="contained">
          <Button
            sx={{
              backgroundColor: colors.greenAccent[600],
              color: 'white',
              '&:hover': {
                backgroundColor: '#f86a3b',
              },
            }}
            onClick={() => handleView(params.row)}
            startIcon={<VisibilityIcon />}
          >
            View
          </Button>
          <Button
            sx={{
              backgroundColor: '#fa7c50',
              color: 'white',
              '&:hover': {
                backgroundColor: '#f86a3b',
              },
            }}
            onClick={(event) => handleClick(event, params.id)}
            endIcon={<ArrowDropDownIcon />}
          >

          </Button>
        </ButtonGroup>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Grid container spacing={2} alignItems="flex-start">
        <Grid item xs={12}>
          <Typography variant="h6" fontWeight="600" color={colors.grey[100]}>
            <Link to="/" style={{ textDecoration: 'none', color: colors.grey[100] }}>
              Home
            </Link>{' '}
            / Withdrawal Requests
          </Typography>
          <Typography variant="h2" fontWeight="600" color={colors.grey[100]}>
            Withdrawal Request Overview
          </Typography>
          <Typography variant="subtitle2" fontSize={'16px'} color={colors.greenAccent[500]}>
            Approve or decline withdrawal requests.
          </Typography>
        </Grid>
        <Grid item xs={12} container spacing={1} justifyContent={isMobile ? "flex-start" : "flex-end"}>
          <Grid item>
            <TextField
              variant="outlined"
              placeholder="Search..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              sx={{
                mb: 2,
                width: isMobile ? "100%" : "200px",
                mr: 2,
                height: "100%",
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: colors.grey[300],
                  },
                  '&:hover fieldset': {
                    borderColor: colors.grey[500],
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: colors.greenAccent[700],
                  },
                },
                '& .MuiInputLabel-root': {
                  color: colors.grey[400],
                  '&.Mui-focused': {
                    color: colors.greenAccent[700],
                  },
                },
                '& .MuiInputBase-input': {
                  color: colors.grey[100],
                },
              }}
            />
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Box
            m="0px 0 0 0"
            height={isMobile ? "75vh" : "100vh"}
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: colors.blueAccent[700],
                borderBottom: "none",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: colors.primary[400],
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "none",
                backgroundColor: colors.blueAccent[700],
              },
              "& .MuiCheckbox-root": {
                color: `${colors.greenAccent[200]} !important`,
              },
              "& .MuiDataGrid-toolbarContainer svg": {
                color: theme.palette.mode === 'dark' ? 'white' : 'inherit',
              },
            }}
          >
            <DataGrid
              checkboxSelection
              hideFooterSelectedRowCount
              rows={filteredRows}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50, 100]}
            />
            <Menu
              id={`split-button-menu-${openMenuId}`}
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem
                onClick={() => {
                  handleClose();
                  handleApprove(openMenuId);
                }}
                sx={{ color: colors.grey[100], '&:hover': { backgroundColor: colors.primary[300] } }}
              >
                Approve
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleClose();
                  handleDecline(openMenuId);
                }}
                sx={{ color: colors.grey[100], '&:hover': { backgroundColor: colors.primary[300] } }}
              >
                Decline
              </MenuItem>
            </Menu>
          </Box>
        </Grid>

        {/* View Modal (Same as TeamManager) */}
        <Modal
          open={openViewModal}
          onClose={handleCloseModal}
          aria-labelledby="view-request-modal"
          aria-describedby="view-request-details"
        >
          <Box sx={style}>
            {selectedRequest && (
              <div>
                <Typography id="view-request-modal" variant="h6" component="h2">
                  {selectedRequest.eventName} - Withdrawal Request
                </Typography>
                <Typography id="view-request-details" sx={{ mt: 2 }}>
                  <strong>Event Date:</strong> {selectedRequest.eventDate}<br />
                  <strong>Amount Requested:</strong> {selectedRequest.amountRequested}<br />
                  <strong>Amount Contributed:</strong> {selectedRequest.amountContributed}<br />
                  <strong>Event ID:</strong> {selectedRequest.eventId}<br />
                  <strong>Status:</strong> {selectedRequest.status}
                </Typography>
                <Button variant='outlined' onClick={handleCloseModal} color="inherit">Close</Button>
              </div>
            )}
          </Box>
        </Modal>

      </Grid>
    </Box>
  );
};

export default WithdrawalRequest;