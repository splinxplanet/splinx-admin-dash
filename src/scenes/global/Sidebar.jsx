import React, { useState, useRef, useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { tokens } from '../../theme';
import "react-pro-sidebar/dist/css/styles.css";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  const [profileImage, setProfileImage] = useState("../../assets/user.png");
  const fileInputRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        localStorage.setItem('profileImage', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box
      sx={{
        '& .pro-sidebar-inner': {
          background: `${colors.primary[400]} !important`,
        },
        '& .pro-icon-wrapper': {
          backgroundColor: 'transparent !important',
        },
        '& .pro-inner-item': {
          padding: '5px 35px 5px 20px !important',
        },
        '& .pro-inner-item:hover': {
          color: '#868dfb !important',
        },
        '& .pro-menu-item.active': {
          color: '#6870fa !important',
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: '10px 0 20px 0',
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box display="flex" justifyContent="space-between" alignItems="center" ml="15px">
                <Typography variant="h3" color={colors.grey[100]}>
                  <img
                    src={`${process.env.PUBLIC_URL}/splinxfav.ico`}
                    alt="Logo"
                    style={{ width: "40px", height: "40px" }}
                  />
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {/* USER PROFILE */}
          {!isCollapsed && (
            <Box mb="25px">
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                position="relative"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={user?.profileImage ? user.profileImage : profileImage}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                  onClick={handleImageClick}
                />
                {isHovered && (
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
                    }}
                    onClick={handleImageClick}
                  >
                    <AddCircleOutlineIcon sx={{ color: 'white', fontSize: 30 }} />
                  </IconButton>
                )}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                />
              </Box>
              <Box textAlign="center">
                {user && (
                  <>
                    <Typography
                      variant="h2"
                      color={colors.grey[100]}
                      fontWeight="bold"
                      sx={{ m: "10px 0 0 0" }}
                    >
                      {user.firstName} {user.lastName}
                    </Typography>
                    <Typography variant="h5" color={colors.greenAccent[500]}>
                      {user.role}
                    </Typography>
                  </>
                )}
              </Box>
            </Box>
          )}

          {/* MENU ITEMS */}
          <Box paddingLeft={isCollapsed ? undefined : '10%'}>
            <Item
              title="Dashboard"
              to="/dashboard"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: '15px 0 5px 20px' }}
            >
              Manager
            </Typography>

            {/* Conditionally Render Team, Customer, Advert, and Subscriptions Managers for Superadmin */}
            {user?.role === 'superadmin' && (
              <>
                <Item
                  title="Manage Team"
                  to="/team"
                  icon={<PeopleOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />

                <Item
                  title="Manage Customer"
                  to="/customer-manager"
                  icon={<span className="material-symbols-outlined">groups</span>}
                  selected={selected}
                  setSelected={setSelected}
                />

                <Item
                  title="Advert Manager"
                  to="/advert-manager"
                  icon={<span className="material-symbols-outlined">campaign</span>}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Subscriptions Manager"
                  to="/subscriptions"
                  icon={<span className="material-symbols-outlined">subscriptions</span>}
                  selected={selected}
                  setSelected={setSelected}
                />
                {/* plan manager update */}
                <Item
                  title="Premium Plans"
                  to="/plans"
                  icon={<span className="material-symbols-outlined">paid</span>}
                  selected={selected}
                  setSelected={setSelected}
                />
              </>
            )}
            {/* Other items for all users */}
            <Item
              title="Promo Code"
              to="/promo-code"
              icon={<span className="material-symbols-outlined">app_promo</span>}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Push Notification"
              to="/push-notification"
              icon={<span className="material-symbols-outlined">notifications</span>}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Email Notification"
              to="/email-notification"
              icon={<span className="material-symbols-outlined">mark_email_unread</span>}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
