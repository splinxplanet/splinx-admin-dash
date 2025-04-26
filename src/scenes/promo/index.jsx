import React, { useState, useEffect, useContext, useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  ButtonGroup,
  Grid,
  Menu,
  MenuItem,
  Link,
  InputBase,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import Chip from "@mui/material/Chip";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import useMediaQuery from "@mui/material/useMediaQuery";
import AuthContext from "../../context/AuthContext";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ViewPromoModal from "./ViewPromoModal";
import CreatePromoCode from "./CreatePromoCode";
import EditPromoCode from "./EditPromoCode";
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import RefreshIcon from '@mui/icons-material/Refresh';


const PromoManager = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const { token } = useContext(AuthContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [searchText, setSearchText] = useState("");
  const [promos, setPromos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);


  // State to control visibility of the create and edit forms
  const [openCreatePromo, setOpenCreatePromo] = useState(false);
  const [openEditPromo, setOpenEditPromo] = useState(false);

  const fetchPromos = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/promo`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setPromos(data.data);
    } catch (error) {
      console.error("Error fetching promos:", error);
      toast.error("Failed to load promos.");
    } finally {
      setIsLoading(false);
    }
  }, [token, apiUrl]);

  useEffect(() => {
    fetchPromos();
  }, [fetchPromos, openCreatePromo, openEditPromo]);

  const handleDelete = async (promoId) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const response = await fetch(`${apiUrl}/promo/${promoId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setPromos((prevData) =>
            prevData.filter((item) => item._id !== promoId)
          );
          Swal.fire(
            `Deleted!`,
            `${selectedPromo.promoName} deleted successfully!`,
            "success"
          );
        } else {
          const errorData = await response.json();
          Swal.fire(
            "Error!",
            errorData.message || "Failed to delete the promo.",
            "error"
          );
        }
      }
    } catch (error) {
      Swal.fire("Error!", "Failed to delete the promo.", "error");
    }
  };

  const filteredRows = useMemo(() => {
    const search = searchText.toLowerCase();

    return promos.filter((row) => {
      const promoName = row?.promoName?.toLowerCase() || "";
      const promoCode = row?.promoCode?.toLowerCase() || "";
      const promoID = row?.promoID?.toString()?.toLowerCase() || "";

      return promoName.includes(search) || promoCode.includes(search) || promoID.includes(search);
    });
  }, [promos, searchText]);


  const handleClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedPromo(row);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleView = (promo) => {
    setSelectedPromo(promo);
    setOpenViewModal(true);
  };

  const handleCloseModal = () => {
    setOpenViewModal(false);
  };

  // Create a new promo
  const handleCreatePromo = () => {
    setOpenCreatePromo(true);
  };

  // Edit a promo
  const handleEdit = (promo) => {
    setSelectedPromo(promo);
    setOpenEditPromo(true);
  };

  // Handle canceling form creation
  const handleCloseCreatePromo = () => {
    setOpenCreatePromo(false);
  };

  const handleCloseEditPromo = () => {
    setOpenEditPromo(false);
    setSelectedPromo(null);
  };

  // Handle new promo submission
  const handleNewPromoSubmit = (newPromoData) => {
    setPromos((prevPromos) => [...prevPromos, newPromoData]);
    fetchPromos();
  };

  const handleUpdatePromoList = (newPromoData) => {
    setPromos((prevPromos) => [...prevPromos, newPromoData]);
    fetchPromos();
  };
  // Handle edit promo submission
  const handleEditPromoSubmit = (updatedPromoData) => {
    const promoIndex = promos.findIndex(
      (promo) => promo._id === updatedPromoData._id
    );
    if (promoIndex !== -1) {
      const updatedPromos = [...promos];
      updatedPromos[promoIndex] = updatedPromoData;
      setPromos(updatedPromos);
    }
    handleCloseEditPromo();
    fetchPromos();
  };


  const handlePauseToggle = async (promo) => {
    try {
      const newStatus = promo.status === "paused" ? "active" : "paused";
      const actionText = newStatus === 'paused' ? 'pause' : 'unpause'; // Text for the confirmation message

      // Confirmation dialog
      const result = await Swal.fire({
        title: `Are you sure you want to ${actionText} this promo code?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: `Yes, ${actionText} it!`
      });

      if (result.isConfirmed) {
        const response = await fetch(`${apiUrl}/promo/${promo._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ...promo, status: newStatus }),
        });

        if (response.ok) {
          fetchPromos();
          Swal.fire({
            title: "Success!",
            text: `Promo code ${actionText}d successfully!`,
            icon: "success",
            confirmButtonColor: colors.greenAccent[600],
          });
        } else {
          const errorData = await response.json();
          toast.error(errorData.message || 'Error updating promo status.');
        }
      }
    } catch (error) {
      console.error('Error toggling promo status:', error);
      toast.error('An error occurred while updating the promo status.');
    }
  };

  const handleRenew = async (promo) => {
    try {
      // Confirmation dialog
      const result = await Swal.fire({
        title: 'Are you sure you want to renew this promo code?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, renew it!'
      });

      if (result.isConfirmed) {
        const response = await fetch(`${apiUrl}/promo/${promo._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ...promo, status: "active" }),
        });

        if (response.ok) {
          fetchPromos();
          Swal.fire({
            title: "Success!",
            text: "Promo code renewed successfully!",
            icon: "success",
            confirmButtonColor: colors.greenAccent[600],
          });
        } else {
          const errorData = await response.json();
          toast.error(errorData.message || 'Error renewing promo code.');
        }
      }
    } catch (error) {
      console.error('Error renewing promo code:', error);
      toast.error('An error occurred while renewing the promo code.');
    }
  };
  const columns = [
    // {
    //   field: 'dateCreated',
    //   headerName: 'Date Created',
    //   width: 130,
    //   valueGetter: (params) => {
    //     const date = new Date(params.row.dateCreated);
    //     return moment(date).format("MM/DD/YYYY");
    //   },
    // },
    // {
    //   field: 'startDate', 
    //   headerName: 'Start Date',
    //   width: 130, 
    //   valueGetter: (params) => {
    //     const date = new Date(params.row.startDate);
    //     return moment(date).format("MM/DD/YYYY"); 
    //   },
    // },
    {
      field: 'promoID',
      headerName: 'Promo ID',
      width: 130,
    },
    {
      field: "promoCode",
      headerName: "Promo Code",
      flex: 2,
    },
    {
      field: "promoName",
      headerName: "Name",
      flex: 2,
    },
    {
      field: "discountPercent",
      headerName: "Discount (%)",
      flex: 1,
      valueFormatter: (params) => `${params.value}%`, // Render the discount with a percentage sign
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: ({ row: { status } }) => {
        // Convert status to sentence case
        const capitalizeStatus = status.charAt(0).toUpperCase() + status.slice(1);

        // Define color coding for each status
        const getColor = (status) => {
          switch (status) {
            case 'active':
              return 'success'; // Green for active
            case 'expired':
              return 'error'; // Red for expired
            case 'paused':
              return 'warning'; // Orange for paused
            default:
              return 'default';
          }
        };

        return (
          <Chip
            label={capitalizeStatus}
            color={getColor(status)}
            sx={{
              fontSize: 12, // Font size 18
              fontWeight: '700', // Semibold font
              textTransform: 'capitalize', // Capitalize the first letter of the label
            }}
          />
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <ButtonGroup
          variant="contained"
          disableElevation
          sx={{
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <Button
            sx={{
              backgroundColor: colors.greenAccent[600],
              color: "white",
              "&:hover": {
                backgroundColor: "#f86a3b",
              },
            }}
            onClick={() => handleView(params.row)}
            startIcon={<VisibilityIcon />}
          >
            View
          </Button>
          <Button
            sx={{
              backgroundColor: "#fa7c50",
              color: "white",
              "&:hover": {
                backgroundColor: "#f86a3b",
              },
            }}
            onClick={(event) => handleClick(event, params.row)}
            endIcon={<ArrowDropDownIcon />}
          ></Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem
              onClick={() => {
                handleEdit(selectedPromo);
                handleClose();
              }}
            >
              <EditIcon sx={{ mr: 1 }} />
              Edit
            </MenuItem>

            {/* Pause/Unpause Menu Item */}
            <MenuItem
              onClick={() => {
                if (selectedPromo) {
                  handlePauseToggle(selectedPromo);
                  handleClose();
                }
              }}
            >
              {selectedPromo && selectedPromo.status === "paused" ? (
                <><PlayCircleOutlineIcon sx={{ mr: 1, color: 'green' }} /> Unpause</>
              ) : (
                <><PauseCircleOutlineIcon sx={{ mr: 1, color: 'orange' }} /> Pause</>
              )}
            </MenuItem>

            {/* Renew Menu Item (only show if expired) */}
            {selectedPromo && selectedPromo.status === "expired" && (
              <MenuItem
                onClick={() => {
                  handleRenew(selectedPromo);
                  handleClose();
                }}
              >
                <><RefreshIcon sx={{ mr: 1, color: 'blue' }} /> Renew</>
              </MenuItem>
            )}

            <MenuItem onClick={() => handleDelete(selectedPromo._id)}>
              <DeleteIcon sx={{ mr: 1 }} />
              Delete
            </MenuItem>
          </Menu>
        </ButtonGroup>
      ),
    },
  ];

  return (
    <>
      {/* Conditionally render forms or main view */}
      {openCreatePromo ? (
        <CreatePromoCode
          handleCancel={handleCloseCreatePromo}
          onSubmit={handleNewPromoSubmit}
          updatePromoList={handleUpdatePromoList}
        />
      ) : openEditPromo ? (
        <EditPromoCode
          promoData={selectedPromo}
          handleCancel={handleCloseEditPromo}
          onSubmit={handleEditPromoSubmit}
        />
      ) : (
        <Box m="20px">
          <Grid container spacing={2} alignItems="flex-start">
            {/* Page Title and Breadcrumbs */}
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight="600" color={colors.grey[100]}>
                <Link to="/" style={{ textDecoration: "none", color: colors.grey[100] }}>
                  Home
                </Link>{" "}
                / Promo Codes
              </Typography>
              <Typography variant="h2" fontWeight="600" color={colors.greenAccent[500]}>
                Promo Code Management
              </Typography>
              <Typography variant="subtitle2" fontSize={"16px"} color={colors.grey[100]}>
                Create, view, edit, and manage promo codes.
              </Typography>
            </Grid>

            {/* Search Bar and Create Promo Button */}
            <Grid item xs={12} container spacing={1} justifyContent={isMobile ? "flex-start" : "flex-end"}>
              <Grid item>
                <InputBase
                  sx={{
                    mr: 2,
                    flex: 3,
                    border: "1px solid white",
                    borderRadius: "4px",
                    marginBottom: "10px",
                    padding: "10px 14px",
                    "& .MuiInputBase-input": {
                      color: "white",
                    },
                  }}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search Promo Codes..."
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton type="button" sx={{ p: 1 }}>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  }
                />
                <Button
                  sx={{
                    backgroundColor: colors.greenAccent[700],
                    color: colors.grey[100],
                    fontSize: "16px",
                    fontWeight: "600",
                    padding: "10px 20px",
                    marginRight: isMobile ? "0" : "0px",
                    marginBottom: isMobile ? "10px" : "0",
                    "&:hover": {
                      backgroundColor: colors.greenAccent[600],
                    },
                  }}
                  onClick={handleCreatePromo}
                >
                  <AddOutlinedIcon sx={{ mr: "10px" }} />
                  Create Promo Code
                </Button>
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
                }}
              >
                {isLoading ? (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="60%"
                  >
                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="center"
                      minHeight="100vh"
                    >
                      <Typography
                        variant="h4"
                        align="center"
                        color={colors.greenAccent[500]}
                      >
                        Loading Promo Codes...
                      </Typography>
                      <CircularProgress
                        size={50}
                        thickness={5}
                        sx={{
                          color: colors.greenAccent[500],
                          mt: 2,
                        }}
                      />
                    </Box>
                  </Box>
                ) : (
                  <DataGrid
                    checkboxSelection
                    hideFooterSelectedRowCount
                    rows={filteredRows}
                    getRowId={(row) => row.promoID}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10, 25, 50, 100]}
                  />
                )}
              </Box>
            </Grid>

            {/* View Promo Modal (Direct child of the main Grid container) */}
            <ViewPromoModal
              open={openViewModal}
              onClose={handleCloseModal}
              promoData={selectedPromo}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          </Grid>
        </Box>
      )}
    </>
  );
};

export default PromoManager;