import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Typography, ButtonGroup, Box, useTheme, Switch, Button, toast } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { tokens } from '../../theme';
import Header from "../../components/Header";
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined'; 
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import AuthContext from '../../context/AuthContext';
import Swal from 'sweetalert2';
import moment from 'moment';

const Adverts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { token } = useContext(AuthContext);
  const apiUrl = process.env.REACT_APP_API_URL;
  const [adverts, setAdverts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAdverts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/adverts`, { // Assuming '/adverts' is correct
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setAdverts(data); 
    } catch (error) {
      console.error('Error fetching adverts:', error);
      toast.error('Failed to load adverts.'); 
    } finally {
      setIsLoading(false);
    }
  }, [token, apiUrl]);

  useEffect(() => {
    fetchAdverts();
  }, [fetchAdverts]);

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure you want to delete this advert?',
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: colors.greenAccent[600],
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        const response = await fetch(`${apiUrl}/adverts/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' 
          },
        });

        if (response.ok) {
          setAdverts(prevAdverts => prevAdverts.filter(advert => advert.id !== id));
          Swal.fire('Deleted!', 'The advert has been deleted.', 'success');
        } else {
          try {
            const errorData = await response.json();
            toast.error(errorData.message || 'Error deleting advert.');
          } catch (jsonError) {
            toast.error('Failed to delete advert. Please try again later.');
          }
        }
      }
    } catch (error) {
      console.error('Error deleting advert:', error);
      toast.error('An error occurred while deleting the advert.');
    }
  };

  const columnsAdverts = [
    {
      field: 'banner', 
      headerName: 'Banner', 
      flex: 1, 
      renderCell: (params) => (
        <img
          src={params.row.banner}
          alt="advert banner"
          style={{ width: '100px', height: '50px', objectFit: 'cover' }}
        />
      ),
    },
    { field: 'businessName', headerName: 'Business Name', flex: 1 }, // Updated field name
    { 
      field: 'startDate', 
      headerName: 'Start Date', 
      flex: 1,
      valueGetter: (params) => { 
        const date = new Date(params.row.startDate);
        return moment(date).format('MM/DD/YYYY'); 
      }
    },
    { 
      field: 'endDate', 
      headerName: 'End Date', 
      flex: 1 ,
      valueGetter: (params) => { 
        const date = new Date(params.row.endDate);
        return moment(date).format('MM/DD/YYYY'); 
      }
    },
    {
      field: 'adsStatus', 
      headerName: 'Ads Status',
      flex: 1,
      renderCell: (params) => (
        <Switch 
          checked={params.row.adsStatus === 'Active'} 
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <ButtonGroup variant="contained">
          <Button
            color="error"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        </ButtonGroup>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header
        title="Advert Overview"
        subtitle="Manage your adverts"
        breadcrumbs={[{ label: 'Dashboard', link: '/' }, { label: 'Adverts' }]}
        sideButtons={
          <Box display="flex">
            <Button
              sx={{
                backgroundColor: colors.blueAccent[700],
                color: colors.grey[100],
                fontSize: "14px",
                fontWeight: "bold",
                padding: "10px 20px",
                marginRight: "15px",
              }}
            >
              <PersonAddOutlinedIcon sx={{ mr: "10px" }} />
              Create Ad Campaign
            </Button>
            <Button
              sx={{
                backgroundColor: colors.blueAccent[700],
                color: colors.grey[100],
                fontSize: "14px",
                fontWeight: "bold",
                padding: "10px 20px",
              }}
            >
              <DownloadOutlinedIcon sx={{ mr: "10px" }} />
              Export
            </Button>
          </Box>
        }
      />

      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          '& .MuiDataGrid-root': {
            border: 'none',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: 'none',
          },
          '& .name-column--cell': {
            color: colors.greenAccent[300],
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: colors.blueAccent[700],
            borderBottom: 'none',
          },
          '& .MuiDataGrid-virtualScroller': {
            backgroundColor: colors.primary[400],
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: 'none',
            backgroundColor: colors.blueAccent[700],
          },
          '& .MuiCheckbox-root': {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
         {isLoading ? ( 
          <Typography variant="h6" align="center" sx={{ mt: 4 }}>
            Loading adverts...
          </Typography>
        ) : (
          <DataGrid
            rows={adverts} 
            columns={columnsAdverts}
            components={{ Toolbar: GridToolbar }}
          />
        )}
      </Box>
    </Box>
  );
};

export default Adverts; 