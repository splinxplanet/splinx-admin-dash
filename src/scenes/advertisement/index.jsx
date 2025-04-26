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
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import useMediaQuery from "@mui/material/useMediaQuery";
import AuthContext from "../../context/AuthContext";
import Swal from "sweetalert2";
import moment from "moment";
import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ViewAdvertModal from "./ViewAdvertModal";
import CreateNewAdvert from "./CreateNewAdvert";
import EditAdvert from "./EditAdvert";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import RefreshIcon from "@mui/icons-material/Refresh";

const AdvertManager = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const { token, id } = useContext(AuthContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedAdvert, setSelectedAdvert] = useState(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [searchText, setSearchText] = useState("");
  const [adverts, setAdverts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openCreateAdvert, setOpenCreateAdvert] = useState(false);
  const [openEditAdvert, setOpenEditAdvert] = useState(false);

  const fetchAdverts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/advert`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setAdverts(data.data || []);
    } catch (error) {
      console.error("Error fetching adverts:", error);
      toast.error("Failed to load adverts.");
    } finally {
      setIsLoading(false);
    }
  }, [token, apiUrl]);

  useEffect(() => {
    fetchAdverts();
  }, [fetchAdverts, openCreateAdvert, openEditAdvert]);

  // Function to delete an advert
  const handleDelete = async (advertId) => {
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
        const response = await fetch(`${apiUrl}/advert/${advertId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          // Remove the deleted advert from the state
          setAdverts((prevData) =>
            prevData.filter((item) => item._id !== advertId)
          );
          Swal.fire(
            `Deleted!`,
            `${selectedAdvert.businessName} deleted successfully!`,
            "success"
          );
        } else {
          const errorData = await response.json();
          Swal.fire(
            "Error!",
            errorData.message || "Failed to delete the advert.",
            "error"
          );
        }
      }
    } catch (error) {
      Swal.fire("Error!", "Failed to delete the advert.", "error");
    }
  };

  // Memoized filtered rows for performance
  const filteredRows = useMemo(() => {
    return adverts.filter((row) => {
      const search = searchText.toLowerCase();
      return (
        row.businessName.toLowerCase().includes(search) ||
        row.address.toLowerCase().includes(search) ||
        row.phone.toString().toLowerCase().includes(search) ||
        row.emailAddress.toLowerCase().includes(search) ||
        row.staffId.toLowerCase().includes(search)
      );
    });
  }, [adverts, searchText]);


  const handleClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedAdvert(row);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleView = (advert) => {
    setSelectedAdvert(advert);
    setOpenViewModal(true);
  };

  const handleCloseModal = () => {
    setOpenViewModal(false);
  };

  // Create a new advert
  const handleCreateAdvert = () => {
    // toggle the state of the modal
    setOpenCreateAdvert((prev) => !prev);
  };

  // Edit an advert
  const handleEdit = (advert) => {
    setSelectedAdvert(advert); // Set the selected advert to edit
    setOpenEditAdvert(true); // Open the edit modal
  };
  // Handle canceling form creation (from CreateNewAdvert and EditAdvert)
  const handleCloseCreateAdvert = () => {
    setOpenCreateAdvert(false);
  };

  const handleCloseEditModal = () => {
    setOpenEditAdvert(false);
    setSelectedAdvert(null); // Reset selected advert
  };

  // Handle new advert submission
  const handleNewAdvertSubmit = (newAdvertData) => {
    setAdverts(prevAdverts => [...prevAdverts, newAdvertData]);
    handleCloseCreateAdvert();
    fetchAdverts();
  };

  // Handle edit advert submission
  const handleEditAdvertSubmit = (updatedAdvertData) => {
    // Find the index of the advert to update
    const advertIndex = adverts.findIndex(advert => advert._id === updatedAdvertData._id);
    if (advertIndex !== -1) {
      // Update the advert in the state
      const updatedAdverts = [...adverts];
      updatedAdverts[advertIndex] = updatedAdvertData;
      setAdverts(updatedAdverts);
    }
    handleCloseEditModal();
    fetchAdverts();
  };
  const handlePauseToggle = async (advert) => {
    try {
      const newStatus = advert.adsStatus === "pause" ? "active" : "pause";
      const actionText = newStatus === "pause" ? "pause" : "reactivate";

      const result = await Swal.fire({
        title: `Are you sure you want to ${actionText} ${advert.businessName}'s Advert?`, // Use advert.businessName
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: `Yes, ${actionText} it!`,
      });

      if (result.isConfirmed) {
        const response = await fetch(`${apiUrl}/advert/${advert._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ...advert, adsStatus: newStatus }),
        });

        if (response.ok) {
          fetchAdverts();
          Swal.fire({
            title: "Success!",
            text: `${advert.businessName}'s Advert ${actionText}d successfully!`,
            icon: "success",
            confirmButtonColor: colors.greenAccent[600],
          });
        } else {
          const errorData = await response.json();
          Swal.fire({ // Use Swal for error as well
            title: "Error!",
            text: errorData.message || "Failed to update advert status.",
            icon: "error",
            confirmButtonColor: colors.redAccent[600], 
          });
        }
      }
      
    } catch (error) {
      console.error("Error toggling advert status:", error);
      Swal.fire({
        title: "Error!",
        text: "An error occurred while updating the advert status.",
        icon: "error",
        confirmButtonColor: colors.redAccent[600],
      });
    }
  };

  const handleRenew = async (advert) => {
    try {
      const result = await Swal.fire({
        title: `Are you sure you want to renew ${advert.businessName}'s Advert?`, // Use advert.businessName
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, renew it!",
        customClass: {  // Add the customClass option here
          popup: 'swal-top', 
        },
      });

      if (result.isConfirmed) {
        const response = await fetch(`${apiUrl}/advert/${advert._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ...advert, adsStatus: "active" }),
        });

        if (response.ok) {
          fetchAdverts();
          Swal.fire({
            title: "Success!",
            text: `${advert.businessName} renewed successfully!`,
            icon: "success",
            confirmButtonColor: colors.greenAccent[600],
          });
        } else {
          const errorData = await response.json();
          Swal.fire({ // Use Swal for error 
            title: "Error!",
            text: errorData.message || "Failed to renew advert.",
            icon: "error",
            confirmButtonColor: colors.redAccent[600],
          });
        }
      }
    } catch (error) {
      console.error("Error renewing advert:", error);
      Swal.fire({
        title: "Error!",
        text: "An error occurred while renewing the advert.",
        icon: "error",
        confirmButtonColor: colors.redAccent[600],
      });
    }
  };
  const columns = [
    {
      // New image banner column
      field: "adsImage", // Assuming this is the field name in your API data
      headerName: "Banner",
      width: 100, // Adjust width as needed
      renderCell: (params) => (
        <img
          src={params.row.adsImage}
          alt="Advert Banner"
          style={{ width: "100%", height: "auto", objectFit: "contain" }}
        />
      ),
    },
    {
      field: "startDate",
      headerName: "Start Date",
      width: 90,
      valueGetter: (params) => {
        const date = new Date(params.row.startDate);
        return moment(date).format("MM/DD/YYYY");
      },
    },
    {
      field: "endDate",
      headerName: "End Date",
      width: 90,
      valueGetter: (params) => {
        const date = new Date(params.row.endDate);
        return moment(date).format("MM/DD/YYYY");
      },
    },
    { field: "businessName", headerName: "Business Name", flex: 2 },
    { field: "businessAddress", headerName: "Address", flex: 2.5 },
    { field: "businessPhone", headerName: "Phone", flex: 1 },
    {
      field: "adsStatus",
      headerName: "Ads Status",
      width: 90,
      renderCell: ({ row: { adsStatus } }) => {
        // Convert adsStatus to sentence case
        const capitalizeStatus = adsStatus.charAt(0).toUpperCase() + adsStatus.slice(1);

        // Define color coding for each status
        const getColor = (status) => {
          switch (status) {
            case 'active':
              return 'success'; // Green for active
            case 'pause':
              return 'warning'; // Orange for pause
            case 'expired':
              return 'error';   // Red for expired
            default:
              return 'default'; // Default color
          }
        };

        return (
          <Chip
            label={capitalizeStatus}
            color={getColor(adsStatus)}
          />
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <ButtonGroup
          variant="contained"
          disableElevation
          sx={{
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          {/* View Button */}
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

          {/* Action Button  */}
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

          {/* Dropdown Menu for Actions */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {/* Edit Menu Item */}
            <MenuItem
              onClick={() => {
                handleEdit(selectedAdvert);
                handleClose();
              }}
            >
              <EditIcon sx={{ mr: 1 }} />
              Edit
            </MenuItem>

            {/* Pause/Unpause Menu Item */}
            <MenuItem
              onClick={() => {
                if (selectedAdvert) {
                  handlePauseToggle(selectedAdvert);
                  handleClose();
                }
              }}
            >
              {selectedAdvert && selectedAdvert.adsStatus === "pause" ? (
                <><PlayCircleOutlineIcon sx={{ mr: 1, color: "green" }} />Reactivate</>
              ) : (
                <><PauseCircleOutlineIcon sx={{ mr: 1, color: "orange" }} />Pause</>
              )}
            </MenuItem>

            {/* Renew Menu Item (only show if expired) */}
            {selectedAdvert && selectedAdvert.adsStatus === "expired" && (
              <MenuItem
                onClick={() => {
                  handleRenew(selectedAdvert);
                  handleClose();
                }}
              >
                <><RefreshIcon sx={{ mr: 1, color: "blue" }} />Renew</>
              </MenuItem>
            )}

            {/* Delete Menu Item with SweetAlert Confirmation */}
            <MenuItem
              onClick={() => {
                if (selectedAdvert) {
                  handleDelete(selectedAdvert._id);
                  handleClose();
                }
              }}
            >
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
      {/* Conditionally render either CreateNewAdvert or EditAdvert or the main view */}
      {openCreateAdvert ? (
        <CreateNewAdvert
          handleCancel={handleCreateAdvert}
          onSubmit={handleNewAdvertSubmit}
          id={id}
        />
      ) : openEditAdvert ? (
        <EditAdvert
          advertData={selectedAdvert}
          handleCancel={handleCloseEditModal}
          onSubmit={handleEditAdvertSubmit}
        />
      ) : (
        <Box m="20px">
          <Grid container spacing={2} alignItems="flex-start">
            {/* Page Title and Breadcrumbs */}
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight="600" color={colors.grey[100]}>
                <Link
                  to="/"
                  style={{ textDecoration: "none", color: colors.grey[100] }}
                >
                  Home
                </Link>{" "}
                / Adverts
              </Typography>
              <Typography
                variant="h2"
                fontWeight="600"
                color={colors.greenAccent[500]}
              >
                Advert Management
              </Typography>
              <Typography
                variant="subtitle2"
                fontSize={"16px"}
                color={colors.grey[100]}
              >
                Create, view, edit, and manage advertisements.
              </Typography>
            </Grid>

            {/* Search Bar and Add Advert Button */}
            <Grid
              item
              xs={12}
              container
              spacing={1}
              justifyContent={isMobile ? "flex-start" : "flex-end"}
            >
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
                  placeholder="Search Adverts..."
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
                  onClick={handleCreateAdvert} // Open CreateNewAdvert form
                >
                  <PersonAddOutlinedIcon sx={{ mr: "10px" }} />
                  Add Advert
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
                {/* Conditionally render DataGrid or loading indicator */}
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
                      minHeight="100vh" // Ensures full height if necessary to center vertically
                    >
                      <Typography
                        variant="h4"
                        align="center"
                        color={colors.greenAccent[500]}
                      >
                        Loading Adverts...
                      </Typography>
                      <CircularProgress
                        size={50}
                        thickness={5}
                        sx={{
                          color: colors.greenAccent[500],
                          mt: 2, // Adds margin between the text and the spinner
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

            {/* ViewAdvertModal */}
            <ViewAdvertModal
              open={openViewModal}
              onClose={handleCloseModal}
              recordData={selectedAdvert}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              handlePauseToggle={handlePauseToggle} 
            />
          </Grid>

        </Box>
      )}
    </>
  );
};

export default AdvertManager;