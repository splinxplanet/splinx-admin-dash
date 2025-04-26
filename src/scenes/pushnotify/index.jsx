import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useMemo,
} from "react";
import AuthContext from "../../context/AuthContext";
import {
  Box,
  Typography,
  Button,
  ButtonGroup,
  Grid,
  Menu,
  MenuItem,
  Link,
  CircularProgress,
  InputBase,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Swal from "sweetalert2";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import useMediaQuery from "@mui/material/useMediaQuery";
import PushViewModal from "./PushViewModal";
import formatDate from "../../utils/dataConverter";
import CreatePushNotification from "./CreatePushNotification";

const PushNotification = () => {
  // Fetch notification data from the server
  const apiUrl = process.env.REACT_APP_API_URL;
  const { token } = useContext(AuthContext);

  const [pushNotifications, setPushNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openCreatePushNotification, setOpenCreatePushNotification] = useState(false);
  const [openEditPushNotification, setOpenEditPushNotification] = useState(false);

  const fetchPushNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/notification/system`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setPushNotifications(data.data);
    } catch (error) {
      console.error("Error fetching notification:", error);
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl, token]);

  useEffect(() => {
    fetchPushNotifications();
  }, [fetchPushNotifications, openCreatePushNotification, openEditPushNotification]);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [searchText, setSearchText] = useState("");

  // Memoized filtered notification for performance
  const filteredRows = useMemo(() => {
    return pushNotifications.filter((row) => {
      const search = searchText.toLowerCase();
      return row.title.toLowerCase().includes(search) || row.message.toLowerCase().includes(search);
    });
  }, [pushNotifications, searchText]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedNotification(pushNotifications.find((item) => item._id === id));
    setOpenMenuId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpenMenuId(null);
    setSelectedNotification(null);
  };

  const handleView = (notification) => {
    setSelectedNotification(notification);
    setOpenViewModal(true);
  };

  const handleCloseModal = () => {
    setOpenViewModal(false);
  };

  const columns = [
    {
      field: "createdAt",
      headerName: "Date",
      width: 130,
      valueFormatter: (params) => formatDate(params.value),
    },
    { field: "title", headerName: "Subject", flex: 1 },
    { field: "message", headerName: "Message", flex: 1 },
    { field: "type", headerName: "Type", flex: 1 },
    { field: "read", headerName: "Status", flex: 1 },

    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <ButtonGroup variant="contained">
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
            onClick={(event) => handleClick(event, params.id)}
            endIcon={<ArrowDropDownIcon />}
          ></Button>
        </ButtonGroup>
      ),
    },
  ];

  // handle open create push notification
  const handleOpenCreateNotification = () => {
    // toggle the state
    setOpenCreatePushNotification((prev) => !prev);
  };

  // handle delete operation
  const handleDelete = async (notification) => {
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
          `${apiUrl}/notification/${notification._id}/delete`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        if (response.ok) {
          setPushNotifications((prevData) =>
            prevData.filter((item) => item._id !== notification._id)
          );
          Swal.fire(
            `Deleted!`,
            `${notification.title} deleted successfully!`,
            "success"
          );
        } else {
          const errorData = await response.json();
          Swal.fire(
            "Error!",
            errorData.message || "Response Failed to delete the notification.",
            "error"
          );
        }
      } catch (error) {
        Swal.fire("Error!", "Failed to delete the notification.", "error");
      }
    }
  };

  // handle resend notification operation
  const handleResend = async (notification) => {
    setAnchorEl(null);
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You about to resend this notification!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, sent it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `${apiUrl}/notification/${notification._id}/resend`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          Swal.fire(
            `Resend!`,
            `${notification.title} resend successfully!`,
            "success"
          );
        } else {
          const errorData = await response.json();
          Swal.fire(
            "Error!",
            errorData.message || "Response Failed to resend the notification.",
            "error"
          );
        }
      } catch (error) {
        Swal.fire("Error!", "Failed to delete the resend.", "error");
      }
    }
  };

  return (
    <>
      {openCreatePushNotification ? (
        <CreatePushNotification
          handleCancel={handleOpenCreateNotification}
        />
      ) : (
        <Box m="20px">
          <Grid container spacing={2} alignItems="flex-start">
            {/* headings section */}
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
                / Push Notifications
              </Typography>
              <Typography
                variant="h2"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Push Notifications
              </Typography>
              <Typography
                variant="subtitle2"
                fontSize={"16px"}
                color={colors.greenAccent[500]}
              >
                Manage and send in-app push notifications to users.
              </Typography>
            </Grid>

            {/* search bar and create btn */}
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
                  placeholder="Search Notifications..."
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton type="button" sx={{ p: 1 }}>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  }
                />

                <Button
                  onClick={handleOpenCreateNotification}
                  sx={{
                    backgroundColor: colors.greenAccent[700],
                    color: colors.grey[100],
                    fontSize: "14px",
                    fontWeight: "bold",
                    padding: "10px 20px",
                    marginRight: isMobile ? "0" : "15px",
                    marginBottom: isMobile ? "10px" : "0",
                    "&:hover": {
                      backgroundColor: colors.greenAccent[600],
                    },
                  }}
                >
                  <EmailOutlinedIcon sx={{ mr: "10px" }} />
                  Send New
                </Button>
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
                    color: theme.palette.mode === "dark" ? "white" : "inherit",
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
                        Loading Notification...
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
                    getRowId={(row) => row._id}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10, 25, 50, 100]}
                  />
                )}

                <Menu
                  id={`split-button-menu-${openMenuId}`}
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <MenuItem
                    onClick={() => handleResend(selectedNotification)}
                    sx={{
                      color: colors.grey[100],
                      "&:hover": { backgroundColor: colors.primary[300] },
                    }}
                  >
                    Resend
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleDelete(selectedNotification)}
                    sx={{
                      color: colors.grey[100],
                      "&:hover": { backgroundColor: colors.primary[300] },
                    }}
                  >
                    Delete
                  </MenuItem>
                </Menu>
              </Box>
            </Grid>

            {/* View Modal */}
            <PushViewModal
              open={openViewModal}
                onClose={handleCloseModal}
                handleDelete={() => handleDelete(selectedNotification)}
              notificationSelected={selectedNotification}
            />
          </Grid>
        </Box>
      )}
    </>
  );
};

export default PushNotification;
