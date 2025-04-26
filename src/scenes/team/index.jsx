import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from "react";
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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import AuthContext from "../../context/AuthContext";
import useMediaQuery from "@mui/material/useMediaQuery";
import ViewModal from "./ViewModal";
import { teamViewFields } from "./teamFields";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import Swal from "sweetalert2";
import CreateNewAdmin from "./CreateNewAdmin";
import EditAdmin from "./EditAdmin";




const TeamManager = () => {
  // Fetch admin data from the server
  const apiUrl = process.env.REACT_APP_API_URL;
  const { token } = useContext(AuthContext);

  const [adminData, setAdminData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openCreateAdmin, setOpenCreateAdmin] = useState(false);
  const [openEditAdmin, setOpenEditAdmin] = useState(false);

  const fetchAdmins = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/admin/admin-get-all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setAdminData(data.admins);
    } catch (error) {
      console.error("Error fetching admins:", error);
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl, token]);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins, openCreateAdmin, openEditAdmin]);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [searchText, setSearchText] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  // Memoized filtered rows for performance
  const filteredRows = useMemo(() => {
    return adminData.filter((row) => {
      const search = searchText.toLowerCase();
      return (
        row.firstName.toLowerCase().includes(search) ||
        row.lastName.toLowerCase().includes(search) ||
        row.phoneNumber.toLowerCase().includes(search) ||
        row.emailAddress.toLowerCase().includes(search) ||
        row.staffId.toLowerCase().includes(search)
      );
    });
  }, [adminData, searchText]);

  const handleClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedAdmin(row);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleView = (admin) => {
    setSelectedAdmin(admin);
    setOpenViewModal(true);
  };

  const handleCloseModal = () => {
    setOpenViewModal(false);
  };

  const handleDelete = async (admin) => {
    setAnchorEl(null);
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
      try {
        const response = await fetch(
          `${apiUrl}/admin/admin-delete/${admin._id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          setAdminData((prevData) =>
            prevData.filter((item) => item._id !== admin._id)
          );
          Swal.fire(`Deleted!`, `${admin.firstName} ${admin.lastName} deleted successfully!`, 'success'); 
        } else {
          const errorData = await response.json();
          Swal.fire(
            "Error!",
            errorData.message || "Failed to delete the admin.",
            "error"
          );
        }
      } catch (error) {
        Swal.fire("Error!", "Failed to delete the admin.", "error");
      }
    }
  };

  // Create a new admin
  const handleCreateAdmin = () => {
    // toggle the state of the modal
    setOpenCreateAdmin((prev) => !prev);
  };

  // Edit an admin
  const handleEdit = (admin) => {
    setSelectedAdmin(admin); // Set the selected admin to edit
    setOpenEditAdmin(true); // Open the edit modal
  };

  const handleCloseEditModal = () => {
    setOpenEditAdmin(false);
    setSelectedAdmin(null); // Reset selected admin
  };
  const toSentenceCase = (str) => {


    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };
  const columns = [
    {
      field: "profileImage",
      headerName: "Avatar",
      width: 80,
      renderCell: (params) => (
        <Avatar alt={params.row.firstName} src={params.row.profileImage} />
      ),
    },
    {
      field: "Name",
      headerName: "Full Name",
      flex: 2,
      renderCell: (params) => (
        <Box
          display="flex"
          alignItems="center"
          onClick={() => handleView(params.row)} // Add onClick here
          sx={{ cursor: "pointer" }} // Add cursor style for visual feedback
        >
          <Typography
            variant="h6"
            color="#d66748"
            sx={{ fontWeight: "bold", marginRight: "8px" }}
          >
            {`${params.row.firstName} ${params.row.lastName}`}
          </Typography>
        </Box>
      ),
    },
    {
      field: "staffId",
      headerName: "Staff ID",
      width: 90,
      renderCell: (params) => (
        <Box display="flex" alignItems="center">
          <Chip
            label={`${params.row.staffId}`}
            sx={{
              backgroundColor: colors.greenAccent[500],
              color: colors.primary.contrastText,
            }}
          />
        </Box>
      ),
    },
    {
      field: "emailAddress",
      headerName: "Email Address",
      flex: 2,
      hide: isMobile,
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      flex: 1,
      hide: isMobile,
    },                   

    { field: "city", headerName: "Location", flex: 1, hide: isMobile },
    {
      field: "role",
      headerName: "Role",
      flex: 1.5,
      hide: isMobile,
      renderCell: (params) => {
        
        return (
          <Box display="flex" alignItems="center">
            <Typography
              sx={{
                color: colors.greenAccent[500],
                fontWeight: "bold", 
                textTransform: "capitalize",
              }}
            >
              {params.row.role ? toSentenceCase(params.row.role) : "No Role"} {/* Fallback added */}
            </Typography>
          </Box>
        );
      },
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 200, // Adjust width as needed
      renderCell: (params) => (
        <ButtonGroup
          variant="contained"
          disableElevation
          sx={{
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          {" "}
          <Button
            sx={{
              backgroundColor: colors.greenAccent[600],
              color: "white",
              "&:hover": {
                backgroundColor: "#f86a3b",
              },
            }}
            onClick={() => handleView(params.row)}
            startIcon={<VisibilityIcon />} // Add the VisibilityIcon (eye)
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
          {/* Dropdown Menu for Actions */}
          <Menu
            anchorEl={anchorEl} nts
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {/* Edit Menu Item */}
            <MenuItem
              onClick={() => {
                handleEdit(selectedAdmin);
                handleClose();
              }}
            >
              Edit
            </MenuItem>

            {/* Delete Menu Item with SweetAlert Confirmation */}
            <MenuItem onClick={() => handleDelete(selectedAdmin)}>
              Delete
            </MenuItem>
          </Menu>
        </ButtonGroup>
      ),
    },
  ];

  return (
    <>
      {openCreateAdmin ? (
        <CreateNewAdmin handleCancel={handleCreateAdmin} />
      ) : openEditAdmin ? ( // Render EditAdmin component if editing
        <EditAdmin
          adminData={selectedAdmin}
          handleCancel={handleCloseEditModal}
        />
      ) : (
        <Box m="20px">
          <Grid container spacing={2} alignItems="flex-start">
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
                Team Management
              </Typography>
              <Typography
                variant="subtitle2"
                fontSize={"16px"}
                color={colors.grey[100]}
              >
                Add, view, edit, and manage your team members
              </Typography>
            </Grid>
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
                  placeholder="Search Teams..."
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton type="button" sx={{ p: 1 }}>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  }
                />
                {/* Add Team Button */}
                <Button
                  sx={{
                    backgroundColor: colors.greenAccent[600],
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
                  onClick={handleCreateAdmin}
                >
                  <PersonAddOutlinedIcon sx={{ mr: "10px" }} />
                  Add Team
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
                  <Box display="flex" justifyContent="center" alignItems="center" height="60%">
                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="center"
                      minHeight="100vh" // Ensures full height if necessary to center vertically
                    >
                      <Typography variant="h4" align="center" color={colors.greenAccent[500]}>
                        Loading Team...
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
            <ViewModal
              open={openViewModal}
              onClose={handleCloseModal}
              recordData={selectedAdmin}
              fields={teamViewFields}
              handleEdit={() => {
                handleEdit(selectedAdmin);
              }}
              handleDelete={handleDelete}
            />
          </Grid>
        </Box>
      )}
    </>
  );
};
export default TeamManager;
