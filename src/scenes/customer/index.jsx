import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import {
  Box,
  Chip,
  ButtonGroup,
  Avatar,
  Typography,
  Button,
  Grid,
  Menu,
  MenuItem,
  Link,
  InputBase,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme';
import useMediaQuery from '@mui/material/useMediaQuery';
import AuthContext from '../../context/AuthContext';
import ViewUserModal from './ViewUserModal'; // Make sure the path is correct
import { customerViewFields } from './customerFields';
import Swal from 'sweetalert2';

const CustomerManager = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const { token } = useContext(AuthContext);

  const [customerData, setCustomerData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/user/get-all-users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setCustomerData(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl, token]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [searchText, setSearchText] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  // Memoized filtered rows for performance
  const filteredRows = useMemo(() => {
    return customerData.filter((row) => {
      const search = searchText.toLowerCase();
      return (
        (row.firstName?.toLowerCase() ?? '').includes(search) ||
        (row.lastName?.toLowerCase() ?? '').includes(search) ||
        (row.phoneNumber?.toLowerCase() ?? '').includes(search) ||
        (row.emailAddress?.toLowerCase() ?? '').includes(search)
      );
    });
  }, [customerData, searchText]);

  const handleClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedCustomer(row);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleView = (customer) => {
    console.log('handleView - Customer Data:', customer); // Log the customer data in handleView
    setSelectedCustomer(customer);
    setOpenViewModal(true);
  };

  const handleCloseModal = () => {
    setOpenViewModal(false);
  };

  const handleExtend = async (customer) => {
    handleClose();
    const result = await Swal.fire({
      title: `Extend ${customer.firstName} ${customer.lastName}'s plan?`,
      text: "This will enable premium features for the user.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: colors.greenAccent[600],
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, extend!'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${apiUrl}/user/update-user/${customer._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ isSubscriber: true })
        });

        if (response.ok) {
          // Update the customerData in your state
          fetchCustomers();
          Swal.fire(
            'Extended!',
            `${customer.firstName} ${customer.lastName}'s plan has been extended!`,
            'success'
          );
        } else {
          const errorData = await response.json(


          );
          Swal.fire(
            'Error!',
            errorData.message || 'Failed to extend the plan.',
            'error'
          );
        }

      } catch (error) {
        Swal.fire(
          'Error!',
          'An error occurred while processing your request.',
          'error'
        );
      }
    }
  };

  const handleStopPlan = async (customer) => {
    handleClose();
    // Implement logic to stop the plan, similar to handleExtend
    const result = await Swal.fire({
      title: `Stop ${customer.firstName} ${customer.lastName}'s plan?`,
      text: "This will disable premium features for the user.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: colors.greenAccent[600],
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, stop plan!'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${apiUrl}/user/update-user/${customer._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ isSubscriber: false })
        });

        if (response.ok) {
          fetchCustomers();
          Swal.fire(
            'Stopped!',
            `${customer.firstName} ${customer.lastName}'s plan has been stopped!`,
            'success'
          );
        } else {
          // Handle error, e.g., display error message
          const errorData = await response.json();
          Swal.fire(
            'Error!',
            errorData.message || 'Failed to stop the plan.',
            'error'
          );
        }
      } catch (error) {
        Swal.fire(
          'Error!',
          'An error occurred while processing your request.',
          'error'
        );
      }
    }
  };

  const handleDelete = async (customer) => {
    handleClose();
    // ... Your existing SweetAlert confirmation and delete logic ...
    const result = await Swal.fire({
      title: `Are you sure you want to delete ${customer.firstName} ${customer.lastName}?`,
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: colors.greenAccent[600],
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete!'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${apiUrl}/user/delete-user/${customer._id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          setCustomerData(prevData => prevData.filter(item => item._id !== customer._id));
          Swal.fire(`${customer.firstName} ${customer.lastName} deleted successfully!`, 'success');
        } else {
          const errorData = await response.json();
          Swal.fire('Error!', errorData.message || 'Failed to delete the customer.', 'error');
        }
      } catch (error) {
        Swal.fire('Error!', 'Failed to delete the customer.', 'error');
      }
    }

  };

  const columns = [
    {
      field: 'profileImg',
      headerName: 'Avatar',
      width: 80,
      renderCell: (params) => (
        <Avatar alt={params.row.firstName} src={params.row.profileImg} />
      )
    },
    {
      field: 'fullName',
      headerName: 'Full Name',
      flex: 1.5,
      valueGetter: (params) => `${params.row.firstName} ${params.row.lastName}`, // Create fullName 
      renderCell: (params) => ( // Use params.value
        <Box
          display="flex"
          alignItems="center"
          onClick={() => handleView(params.row)}
          sx={{ cursor: 'pointer' }}
        >
          <Typography 
            variant="h6" 
            color="#f86a3b"
            sx={{ fontWeight: 'bold', marginRight: '8px' }}>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    // {
    //   field: 'userId',
    //   headerName: 'User ID',
    //   width: 120,
    //   renderCell: (params) => {
    //     // Log row data to the console for debugging purposes
    //     console.log('User ID Column - params.row:', params.row);

    //     return (
    //       <Chip
    //         label={params.row.phoneNumber?.slice(-10) || 'N/A'}  // Display last 10 digits of phone number
    //         sx={{
    //           backgroundColor: '#4caf50', // Green background color
    //           color: 'white', // White text color
    //         }}
    //       />
    //     );
    //   },
    // },

    { 
      field: "emailAddress", 
      headerName: "Email", 
      flex: 2, 
      hide: isMobile,
      valueGetter: (params) => params.row.emailAddress || 'N/A', 
    },
    { 
      field: "phoneNumber", 
      headerName: "Phone Number", 
      flex: 1, 
      hide: isMobile, 
      valueGetter: (params) => params.row.phoneNumber || 'N/A', 
    },
  
    { 
      field: 'location', // Use a new field name for the combined location
      headerName: 'Location', 
      flex: 1, 
      hide: isMobile, 
      valueGetter: (params) => `${params.row.city}, ${params.row.country}`, // Concatenate city and country
    },
    { 
      field: 'isSubscriber', // Using isSubscriber for the Plan column
      headerName: 'Plan', 
      width: 120, 
      hide: isMobile,
      valueGetter: (params) => (params.row.isSubscriber ? 'Subscribed' : 'Free'), // Display "Subscribed" or "Free"
      renderCell: (params) => (
        <Chip
          label={params.value}
          sx={{
            backgroundColor: params.row.isSubscriber
              ? colors.greenAccent[500] // Green for subscribed
              : colors.grey[600],      // Grey for free
            color: 'white'
          }}
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <ButtonGroup variant="contained">
          {/* View Button */}
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

          {/* Actions Dropdown Button */}
          <Button
            sx={{
              backgroundColor: '#fa7c50',
              color: 'white',
              '&:hover': {
                backgroundColor: '#f86a3b',
              },
            }}
            onClick={(event) => handleClick(event, params.row)}
            endIcon={<ArrowDropDownIcon />}
          >
            Actions
          </Button>

          {/* Dropdown Menu for Actions */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {/* Extend Menu Item */}
            <MenuItem onClick={() => { handleExtend(selectedCustomer); handleClose(); }}> 
              <CheckCircleOutlineIcon sx={{ mr: 1 }} />  {/* Extend icon */}
              Extend
            </MenuItem>

            {/* Stop Plan Menu Item */}
            <MenuItem onClick={() => { handleStopPlan(selectedCustomer); handleClose(); }}>
              <PauseCircleOutlineIcon sx={{ mr: 1 }} /> {/* Pause icon */}
              Stop Plan
            </MenuItem>

            {/* Delete Menu Item with SweetAlert Confirmation */}
            <MenuItem onClick={() => { handleDelete(selectedCustomer); handleClose(); }}>
              <DeleteIcon sx={{ mr: 1, color: 'red' }} />
              Delete
            </MenuItem>
          </Menu>
        </ButtonGroup>
      )
    },
  ];

  return (
    <Box m="20px">
      <Grid item xs={12}>
        <Typography
          variant="h6"
          fontWeight="600"
          color={colors.grey[100]}
        >
          <Link
            to="/"
            style={{ textDecoration: "none", color: colors.grey[100] }}
          >
            Home
          </Link>{" "}
          / Team
        </Typography>
        <Typography
          variant="h2"
          fontWeight="600"
          color="#d66748"
        >
          Customer Management
        </Typography>
        <Typography
          variant="subtitle2"
          fontSize={"16px"}
          color={colors.grey[100]}
        >
          View and manage your customers.
        </Typography>
      </Grid>
      {/* Search Section */}
      <Grid item xs={12} container spacing={1} justifyContent={isMobile ? "flex-start" : "flex-end"}>
        <Grid item>
          <InputBase
            sx={{
              mr: 2,
              mt: 1,
              flex: 3,
              border: '1px solid white',
              borderRadius: '4px',
              marginBottom: '10px',
              padding: '10px 14px',
              '& .MuiInputBase-input': {
                color: 'white',
              }
            }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search Customers..."
            endAdornment={
              <InputAdornment position="end">
                <IconButton type="button" sx={{ p: 1 }}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            }
          />
        </Grid>
      </Grid>

      {/* DataGrid Section */}
      <Grid item xs={12}>
        <Box
          m="0px 0 0 0"
          height={isMobile ? "75vh" : "100vh"}
          sx={{
            "& .MuiDataGrid-root": { border: "none" },
            "& .MuiDataGrid-cell": { borderBottom: "none" },
            "& .name-column--cell": { color: colors.greenAccent[300] },
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
          {isLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="60%">
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh" // Ensures full height if necessary to center vertically
              >
                <Typography variant="h4" align="center" color={colors.greenAccent[500]}>
                  Loading Customers...
                </Typography>
                <CircularProgress
                  size={50}
                  thickness={5}
                  sx={{
                    color: colors.greenAccent[500],
                    mt: 2 // Adds margin between the text and the spinner
                  }}
                />
              </Box>

            </Box>
          ) : (
            <DataGrid
              checkboxSelection
              hideFooterSelectedRowCount
              rows={filteredRows}
              getRowId={(row) => row._id}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50, 100]}
            />
          )}
        </Box>
      </Grid>

      {/* ViewModal */}
      <ViewUserModal 
        open={openViewModal}
        onClose={handleCloseModal}
        recordData={selectedCustomer}
        fields={customerViewFields}
        handleDelete={handleDelete} 
        handleExtend={handleExtend} 
        handleStopPlan={handleStopPlan} 
      /> 
    </Box>
  );
};

export default CustomerManager;