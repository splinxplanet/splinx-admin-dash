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
  CircularProgress,
  InputBase,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import Swal from "sweetalert2";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import useMediaQuery from "@mui/material/useMediaQuery";
import ViewPlanModal from "./ViewPlanModal";
import CreatePlan from "./CreatePlan";
import EditSubscriptionPlan from "./EditSubscriptionPlan";

const SubscriptionPlans = () => {
  // Fetch subscription plans from the server
  const apiUrl = process.env.REACT_APP_API_URL;
  const { token } = useContext(AuthContext);

  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openCreatePlan, setOpenCreatePlan] = useState(false);
  const [openEditPlan, setOpenEditPlan] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);

  const fetchSubscriptions = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/subscription-plan/plans`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setSubscriptions(data);
    } catch (error) {
      console.error("Error fetching subscription plans:", error);
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl, token]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions, openCreatePlan, openEditPlan]);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [searchText, setSearchText] = useState("");
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const filteredRows = useMemo(() => {
    return subscriptions.filter((row) => {
      const search = searchText.toLowerCase();
      return (
        row.planName.toLowerCase().includes(search) ||
        row.description.toLowerCase().includes(search)
      );
    });
  }, [subscriptions, searchText]);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedPlan(subscriptions.find((item) => item._id === id));
    setOpenMenuId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpenMenuId(null);
    setSelectedPlan(null);
  };

  const handleView = (plan) => {
    setSelectedPlan(plan);
    setOpenViewModal(true);
  };

  const handleCloseModal = () => {
    setOpenViewModal(false);
  };

  const columns = [
    {
      field: "title",
      headerName: "Tag",
      flex: 1,
    },
    { field: "planName", headerName: "Plan Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    {
      field: "amount",
      headerName: "Price",
      flex: 1,
      valueFormatter: (params) => {
        return `$${params.value}`;
      },
    },
    {
      field: "isActive",
      headerName: "Status",
      flex: 1,
      valueFormatter: (params) => {
        return params.value ? "Active" : "Inactive";
      },
    },
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

  // handle open create plan
  const handleOpenCreatePlan = () => {
    // toggle the state
    setOpenCreatePlan((prev) => !prev);
  };

  // handle open edit plan
  const handleOpenEditPlan = () => {
    setAnchorEl(null);
    // toggle the state
    setOpenEditPlan((prev) => !prev);
  };

  // handle toggle plan activation
  const handleToggleActivation = async (plan) => {
    setAnchorEl(null);
    const action = plan.isActive ? "deactivate" : "activate";
    const confirmMessage = `Are you sure you want to ${action} this plan?`;

    const result = await Swal.fire({
      title: "Confirmation",
      text: confirmMessage,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${action} it!`,
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `${apiUrl}/subscription-plan/toggle-status/${plan._id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          // Update the plan status locally
          setSubscriptions((prevData) =>
            prevData.map((item) =>
              item._id === plan._id
                ? { ...item, isActive: !item.isActive }
                : item
            )
          );
          Swal.fire(
            "Success!",
            `${plan.title} has been ${action}d successfully.`,
            "success"
          );
        } else {
          const errorData = await response.json();
          Swal.fire(
            "Error!",
            errorData.message || `Failed to ${action} the plan.`,
            "error"
          );
        }
      } catch (error) {
        Swal.fire("Error!", `Failed to ${action} the plan.`, "error");
      }
    }
  };

  // handle delete operation
  const handleDelete = async (plan) => {
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
          `${apiUrl}/subscription-plan/delete/${plan._id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          setSubscriptions((prevData) =>
            prevData.filter((item) => item._id !== plan._id)
          );
          Swal.fire(
            `Deleted!`,
            `${plan.title} deleted successfully!`,
            "success"
          );
        } else {
          const errorData = await response.json();
          Swal.fire(
            "Error!",
            errorData.message || "Response Failed to delete the plan.",
            "error"
          );
        }
      } catch (error) {
        Swal.fire("Error!", "Failed to delete the plan.", "error");
      }
    }
  };

  return (
    <>
      {openCreatePlan ? (
        <CreatePlan handleCancel={handleOpenCreatePlan} />
      ) : openEditPlan ? (
        <EditSubscriptionPlan
          handleCancel={handleOpenEditPlan}
          planData={selectedPlan}
        />
      ) : (
        <Box m="20px">
          <Grid container spacing={2} alignItems="flex-start">
            {/* Header */}
            <Grid item xs={12}>
              <Typography
                variant="h2"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Subscription Plans
              </Typography>
              <Typography
                variant="subtitle2"
                fontSize="16px"
                color={colors.greenAccent[500]}
              >
                Create, View, Update, Delete subscription plans.
              </Typography>
            </Grid>

            {/* Search and Filter */}
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
                  placeholder="Search Plans..."
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton type="button" sx={{ p: 1 }}>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </Grid>
              <Button
                onClick={handleOpenCreatePlan}
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
              >
                <PersonAddOutlinedIcon sx={{ mr: "10px" }} />
                Create Plan
              </Button>
            </Grid>

            {/* DataGrid */}
            <Grid item xs={12}>
              <Box
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
                }}
              >
                {isLoading ? (
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    height="60%"
                  >
                    <Typography
                      variant="h4"
                      align="center"
                      color={colors.greenAccent[500]}
                    >
                      Loading Plans...
                    </Typography>
                    <CircularProgress
                      size={50}
                      thickness={5}
                      sx={{ color: colors.greenAccent[500], mt: 2 }}
                    />
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
                    onClick={() => handleToggleActivation(selectedPlan)}
                    sx={{
                      color: colors.grey[100],
                      "&:hover": { backgroundColor: colors.primary[300] },
                    }}
                  >
                    {selectedPlan?.isActive ? "Deactivate" : "Activate"}
                  </MenuItem>

                  <MenuItem
                    onClick={() => handleOpenEditPlan(selectedPlan)}
                    sx={{
                      color: colors.grey[100],
                      "&:hover": { backgroundColor: colors.primary[300] },
                    }}
                  >
                    Edit
                  </MenuItem>

                  <MenuItem
                    onClick={() => handleDelete(selectedPlan)}
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

            {/* view modal */}
            <ViewPlanModal
              open={openViewModal}
              onClose={handleCloseModal}
              handleDelete={() => handleDelete(selectedPlan)}
              subscriptionPlanSelected={selectedPlan}
            />
          </Grid>
        </Box>
      )}
    </>
  );
};

export default SubscriptionPlans;
