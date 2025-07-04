import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from "react";
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
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import useMediaQuery from "@mui/material/useMediaQuery";
import { toast } from "react-toastify";
import AuthContext from "../../context/AuthContext";
import Swal from "sweetalert2";
import moment from "moment";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { PieChartOutline } from "@mui/icons-material";
import RequestModal from "./RequestModal";
import { requestFields } from "./requestField";

const WithdrawalRequest = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const { token } = useContext(AuthContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [searchText, setSearchText] = useState("");
  const [withdrawals, setWithdrawals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);


  const fetchWithdrawalRequest = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/withdrawal/withdrawals`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Withdrawal endpoint not found! Check API URL.");
        } else if (response.status === 401) {
          throw new Error("Unauthorized: Token might be invalid or expired.");
        } else {
          const errorData = await response.json();
          const errorMessage = errorData.message || "Server error!";
          throw new Error(errorMessage);
        }
      }

      let data = await response.json();

      if (data && Array.isArray(data)) {
        setWithdrawals(data)
      } else {
        console.error("API did not return an array of withdrawals:", data);
      }
    } catch (error) {
      console.error("Error fetching withdrawals:", error);
      toast.error(`Failed to load withdrawals: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [token, apiUrl]);

  useEffect(() => {
    fetchWithdrawalRequest();
  }, [fetchWithdrawalRequest]);

  const filteredRows = useMemo(() => {
    return withdrawals.filter((row) => {
      const search = searchText.toLowerCase();
      return (
        (row.eventName?.toLowerCase() ?? "").includes(search)
      );
    });
  }, [withdrawals, searchText]);

  const handleClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRequest(row);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpenMenuId(null);
  };

  const handleView = (event) => {
    setSelectedRequest(event);
    setOpenViewModal(true);
  };

  const handleCloseModal = () => {
    setOpenViewModal(false);
  };

  const handleApproval = async (event) => {
    handleClose();
    const eventId = event._id;
    try {
      const result = await Swal.fire({
        title: "Are you sure you want to approve this withdrawal request?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: colors.greenAccent[600],
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, approve it!",
      });

      if (result.isConfirmed) {
        const response = await fetch(`${apiUrl}/withdrawal/approval/${eventId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          Swal.fire("Approved!", "The withdrawal request has been approved.", "success")
            .then(
              () =>
                // Refresh the list of withdrawals after successful deletion
                fetchWithdrawalRequest()
            );
        } else {
          try {
            const errorData = await response.json();
            toast.error(errorData.message || "Error approving withdrawal.");
          } catch (jsonError) {
            toast.error("Failed to approve withdrawal. Please try again later.");
          }
        }
      }
    } catch (error) {
      toast.error("An error occurred while approving the withdrawal request.");
    }
  };
  const handleDecline = async (event) => {
    handleClose();
    const eventId = event._id;
    try {
      const result = await Swal.fire({
        title: "Are you sure you want to decline this withdrawal request?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: colors.greenAccent[600],
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, decline it!",
      });

      if (result.isConfirmed) {
        const response = await fetch(`${apiUrl}/withdrawal/denied/${eventId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          Swal.fire("Declined!", "The withdrawal request has been declined.", "success")
            .then(
              () =>
                // Refresh the list of withdrawals after successful deletion
                fetchWithdrawalRequest()
            );
        } else {
          try {
            const errorData = await response.json();
            toast.error(errorData.message || "Error declining withdrawal.");
          } catch (jsonError) {
            toast.error("Failed to decline withdrawal. Please try again later.");
          }
        }
      }
    } catch (error) {
      toast.error("An error occurred while declining the withdrawal request.");
    }
  };

  const handleDelete = async (event) => {
    const eventId = event._id;
    try {
      const result = await Swal.fire({
        title: "Are you sure you want to delete this withdrawal request?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: colors.greenAccent[600],
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const response = await fetch(`${apiUrl}/withdrawal/delete/${eventId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          Swal.fire("Deleted!", "The withdrawal request has been deleted.", "success")
            .then(
              () =>
                // Refresh the list of withdrawals after successful deletion
                fetchWithdrawalRequest()
            );
        } else {
          try {
            const errorData = await response.json();
            toast.error(errorData.message || "Error deleting .");
          } catch (jsonError) {
            toast.error("Failed to delete. Please try again later.");
          }
        }
      }
    } catch (error) {
      toast.error("An error occurred while deleting request.");
    }
  };

  // table columns hearder
  const columns = [
    {
      field: "eventDate",
      headerName: "Event Date",
      width: 100,
      valueGetter: (params) =>
        moment(params.row.eventDate).format("MM/DD/YYYY"),
    },
    {
      field: "eventName",
      headerName: "Event Name",
      flex: 1.5,
      renderCell: (params) => (
        <Box
          display="flex"
          alignItems="center"
          onClick={() => handleView(params.row)} // Handle row click
          sx={{ cursor: "pointer" }} // Cursor style for visual feedback
        >
          <Typography
            variant="h6"
            color="#d66748"
            sx={{ fontWeight: "bold", marginRight: "8px" }}
          >
            {params.row.eventName} {/* Display the event name */}
          </Typography>
        </Box>
      ),
    },
    {
      field: "amount",
      headerName: "Request Amount",
      width: 170,
      flex: 1,
      renderCell: (params) => {
        return <span>${params?.value.toLocaleString()}</span>;
      },
    },
    {
      field: "eventCost",
      headerName: "Event Balance",
      width: 90,
      flex: 1.5,
      renderCell: (params) => {
        return <span>${params.value.toLocaleString()}</span>; // Format the value as needed
      },
    },
    { field: "status", headerName: "Status", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1.5,
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
            onClick={(event) => {
              setOpenMenuId(params.row._id); // Use the unique event ID here
              handleClick(event, params.row);
            }}
            endIcon={<ArrowDropDownIcon />}
          ></Button>
          <Menu
            id={`actions-menu-${openMenuId}`}
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
              onClick={() => handleApproval(selectedRequest)}
              sx={{
                color: colors.grey[100],
                "&:hover": { backgroundColor: colors.primary[300] },
              }}
            >
              <EditIcon sx={{ mr: 1 }} />
              Approve
            </MenuItem>
            <MenuItem
              onClick={() => handleDecline(selectedRequest)}
              sx={{
                color: colors.grey[100],
                "&:hover": { backgroundColor: colors.primary[300] },
              }}
            >
              <PieChartOutline sx={{ mr: 1 }} />
              Decline
            </MenuItem>

            <MenuItem
              onClick={() => {
                handleClose();
                handleDelete(selectedRequest);
              }}
              sx={{
                color: colors.grey[100],
                "&:hover": { backgroundColor: colors.primary[300] },
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
    <Box m="20px">
        <Grid container spacing={2} alignItems="flex-start">
          <Grid item xs={12}>
            <Typography variant="h6" fontWeight="600" color={colors.grey[100]}>
              <Link
                to="/"
                style={{ textDecoration: "none", color: colors.grey[100] }}
              >
                Home
              </Link>{" "}
              / Withdrawal
            </Typography>
            <Typography
              variant="h2"
              fontWeight="600"
              color={colors.greenAccent[500]}
            >
              Withdrawal Manager
            </Typography>
            <Typography
              variant="subtitle2"
              fontSize={"16px"}
              color={colors.grey[100]}
            >
              Approve | Decline and manage withdrawals
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
                placeholder="Search Request..."
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
                // onClick={handleOpenCreateEventModal}
              >
                <CalendarTodayOutlinedIcon sx={{ mr: "10px" }} />
                All Request
              </Button>
            </Grid>
          </Grid>

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
                      Loading Events...
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
                  columns={columns}
                  pageSize={10}
                  rowsPerPageOptions={[10, 25, 50, 100]}
                  getRowId={(row) => row._id}
                  initialState={{
                    sorting: {
                      sortModel: [{ field: "eventDate", sort: "desc" }],
                    },
                  }}
                />
              )}
            </Box>
          </Grid>

          <RequestModal
            open={openViewModal}
            onClose={handleCloseModal}
            recordData={selectedRequest}
            fields={requestFields}
            handleApproval={() => handleApproval(selectedRequest._id)}
            handleDelete={handleDelete}
          />
        </Grid>
    </Box>
  );
};

export default WithdrawalRequest;
