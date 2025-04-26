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
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import moment from "moment";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { PieChartOutline } from "@mui/icons-material";
import ViewEventModal from "./ViewEventModal";
import CreateNewEvent from "./CreateNewEvent";
import EventCostSplitModal from "./SplitEventCostModal";
import { eventViewFields } from "./eventFields";

const EventManager = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const { token, user } = useContext(AuthContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [searchText, setSearchText] = useState("");
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showCreateEventForm, setShowCreateEventForm] = useState(false); // State for form visibility
  // event cost split modal
  const [openSlitModal, setOpenSplitModal] = useState(false);
  const navigate = useNavigate();

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/event`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Events endpoint not found! Check API URL.");
        } else if (response.status === 401) {
          throw new Error("Unauthorized: Token might be invalid or expired.");
        } else {
          const errorData = await response.json();
          const errorMessage = errorData.message || "Server error!";
          throw new Error(errorMessage);
        }
      }

      let data = await response.json();

      if (data && Array.isArray(data.events)) {
        // filter out events created by the current user
        data = data?.events.filter((event) => event.eventCreator === user?._id);
        setEvents(data);
      } else if (data && Array.isArray(data.events)) {
        setEvents(data.events);
      } else {
        console.error("API did not return an array of events:", data);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error(`Failed to load events: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [token, apiUrl]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents, showCreateEventForm]);

  const filteredRows = useMemo(() => {
    return events.filter((row) => {
      const search = searchText.toLowerCase();
      return (
        (row.eventName?.toLowerCase() ?? "").includes(search) ||
        (row.eventLocation?.toLowerCase() ?? "").includes(search) ||
        (row.eventCategory?.toLowerCase() ?? "").includes(search)
      );
    });
  }, [events, searchText]);

  const handleClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedEvent(row);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpenMenuId(null);
  };

  const handleView = (event) => {
    setSelectedEvent(event);
    setOpenViewModal(true);
  };

  const handleCloseModal = () => {
    setOpenViewModal(false);
  };

  const handleEdit = (event) => {
    handleClose();
    // navigate to the edit page or handle editing logic here
    navigate(`/event/EditEvent/${event._id}`);
  };

  const handleSplitBudget = () => {
    // toggle openSplitModal state
    setOpenSplitModal((prev) => !prev);
  };

  const handleDelete = async (event) => {
    const eventId = event._id;
    try {
      const result = await Swal.fire({
        title: "Are you sure you want to delete this event?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: colors.greenAccent[600],
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const response = await fetch(`${apiUrl}/event/${eventId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          Swal.fire("Deleted!", "The event has been deleted.", "success")
            .then(
              () =>
                // Refresh the list of events after successful deletion
                fetchEvents()
            );
        } else {
          try {
            const errorData = await response.json();
            toast.error(errorData.message || "Error deleting event.");
          } catch (jsonError) {
            toast.error("Failed to delete event. Please try again later.");
          }
        }
      }
    } catch (error) {
      toast.error("An error occurred while deleting the event.");
    }
  };

  const columns = [
    {
      field: "eventDate",
      headerName: "Date",
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
    { field: "eventLocation", headerName: "Location", flex: 1 },
    {
      field: "eventCost",
      headerName: "Budget",
      width: 70,
      renderCell: (params) => {
        return <span>${params.value.toLocaleString()}</span>; // Format the value as needed
      },
    },
    { field: "eventCategory", headerName: "Category", flex: 1 },
    {
      field: "createdBy",
      headerName: "Created By",
      flex: 1,
      valueGetter: (params) => {
        return "Splinx Admin";
      },
    },
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
              onClick={() => handleEdit(selectedEvent)}
              sx={{
                color: colors.grey[100],
                "&:hover": { backgroundColor: colors.primary[300] },
              }}
            >
              <EditIcon sx={{ mr: 1 }} />
              Edit
            </MenuItem>

            <MenuItem
              onClick={() => {
                handleClose();
                handleSplitBudget(selectedEvent);
              }}
              sx={{
                color: colors.grey[100],
                "&:hover": { backgroundColor: colors.primary[300] },
              }}
            >
              <PieChartOutline sx={{ mr: 1 }} />
              Split Budget
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClose();
                handleDelete(selectedEvent);
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

  const handleOpenCreateEventModal = () => {
    setShowCreateEventForm(true);
  };

  const handleCloseCreateEventModal = () => {
    setShowCreateEventForm(false);
  };

  return (
    <Box m="20px">
      {showCreateEventForm ? (
        <CreateNewEvent handleCancel={handleCloseCreateEventModal} />
      ) : (
        <Grid container spacing={2} alignItems="flex-start">
          <Grid item xs={12}>
            <Typography variant="h6" fontWeight="600" color={colors.grey[100]}>
              <Link
                to="/"
                style={{ textDecoration: "none", color: colors.grey[100] }}
              >
                Home
              </Link>{" "}
              / Events
            </Typography>
            <Typography
              variant="h2"
              fontWeight="600"
              color={colors.greenAccent[500]}
            >
              Event Management
            </Typography>
            <Typography
              variant="subtitle2"
              fontSize={"16px"}
              color={colors.grey[100]}
            >
              Add, view, edit, and manage your events
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
                placeholder="Search Events..."
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
                onClick={handleOpenCreateEventModal}
              >
                <CalendarTodayOutlinedIcon sx={{ mr: "10px" }} />
                Add Event
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

          <ViewEventModal
            open={openViewModal}
            onClose={handleCloseModal}
            recordData={selectedEvent}
            fields={eventViewFields}
            handleEdit={() => handleEdit(selectedEvent._id)}
            handleDelete={handleDelete}
          />

          {/* split event cost modal */}
          {openSlitModal && (
            <EventCostSplitModal
              open={openSlitModal}
              handleClose={() => setOpenSplitModal(false)}
              event={selectedEvent}
            />
          )}
        </Grid>
      )}
    </Box>
  );
};

export default EventManager;
