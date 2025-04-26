import React, { useState } from 'react'; // Import useState
import {
  Box,
  Typography,
  Avatar,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const Profile = () => {
  const profileData = {
    name: "Michael A. Franklin",
    title: "User Experience Specialist",
    location: "California, United States",
    bio:
      "I have 10 years of experience designing for the web, and specialize in the areas of user interface design, interaction design, visual design and prototyping. I’ve worked with notable startups including Pearl Street Software.",
    skills: ["JavaScript", "React", "Node.js", "MongoDB", "Express"],
    experience: [
      {
        company: "ABC Company",
        position: "Software Engineer",
        years: "2020 - Present",
      },
      { company: "XYZ Corp", position: "Web Developer", years: "2018 - 2020" },
    ],
  };

  const ProfileHeader = styled(Box)(({ theme }) => ({
    backgroundImage: `url('/assets/user.png')`, 
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: 250,
    position: "relative",
  }));

  const HeaderOverlay = styled(Box)({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Darker overlay
  });

  const ProfileInfoContainer = styled(Box)({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center", 
    height: "100%", // Ensure info takes full header height
    position: "relative",
    zIndex: 1, 
  });

  const ProfileAvatar = styled(Avatar)({
    width: 120,
    height: 120,
    border: "3px solid white",
    marginBottom: "10px",
  });

  const ProfileName = styled(Typography)({
    color: "white",
    fontWeight: "bold",
    fontSize: "1.8rem", // Larger font size
    marginBottom: "5px",
  });

  const ProfileTitle = styled(Typography)({
    color: "#a0aec0",
    fontSize: "1rem", 
    marginBottom: "5px",
  });

  const ProfileLocation = styled(Typography)({
    color: "#a0aec0",
    fontSize: "0.875rem",
  });

  const TabButton = styled(Button)(({ theme, active }) => ({
    color: active ? "#3182ce" : "#718096",
    borderBottom: active ? "2px solid #3182ce" : "none",
    padding: theme.spacing(1.5, 2),
    fontSize: "1rem",
    textTransform: "none",
    fontWeight: active ? "bold" : "normal", // Make active tab bold
  }));

  const SectionContainer = styled(Box)({
    padding: "20px",
    backgroundColor: "#f9fafb", // Light background for content area
    borderRadius: "8px",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", 
    marginTop: "20px",
  });

  const SectionTitle = styled(Typography)({
    color: "#2d3748",
    marginBottom: "10px",
    fontWeight: "bold", // Make section titles bold
  });

  const SectionSubtitle = styled(Typography)({
    color: "#718096",
    marginBottom: "15px",
  });
  const [activeTab, setActiveTab] = useState('About'); // Define state for activeTab
// Data for the tabs
const tabContent = {
    About: (
      <>
        <SectionTitle variant="h6">
          {profileData.name.toUpperCase()}
        </SectionTitle>
        <SectionSubtitle variant="subtitle1">
          PRODUCT DESIGNER (UX / UI / Visual Interaction)
        </SectionSubtitle>
        <Typography variant="body1" sx={{ color: "#4a5568", lineHeight: 1.6 }}>
          {profileData.bio}
        </Typography>
      </>
    ),
    Skills: (
      <>
        <SectionTitle variant="h6">Skills</SectionTitle>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {profileData.skills.map((skill) => (
            <li key={skill} style={{ marginBottom: "8px", color: "#4a5568" }}>
              {skill}
            </li>
          ))}
        </ul>
      </>
    ),
    Experience: (
      <>
        <SectionTitle variant="h6">Experience</SectionTitle>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {profileData.experience.map((exp) => (
            <li key={exp.company} style={{ marginBottom: "15px" }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, color: "#2d3748", marginBottom: "5px" }}
              >
                {exp.position}
              </Typography>
              <Typography variant="body2" sx={{ color: "#718096" }}>
                {exp.company} ({exp.years})
              </Typography>
            </li>
          ))}
        </ul>
      </>
    ),
    Projects: (
      <Typography variant="body1">
        Project details will be displayed here.
      </Typography>
    ), 
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <Box>
      <ProfileHeader>
        <HeaderOverlay />
        <ProfileInfoContainer> {/* Center content in header */}
          <ProfileAvatar src={"/assets/user.png"} alt={profileData.name} />
          <ProfileName variant="h5"> {/* Use styled component for name */}
            {profileData.name}
          </ProfileName>
          <ProfileTitle variant="subtitle1">
            {profileData.title}
          </ProfileTitle>
          <ProfileLocation variant="body2">
            {profileData.location}
          </ProfileLocation>
        </ProfileInfoContainer>
      </ProfileHeader>

       {/* Improved tab styling */}
      <Box sx={{ display: "flex", justifyContent: "center", backgroundColor: "#e5e7eb", padding: "10px 0"}}> 
        <TabButton active={activeTab === 'About'} onClick={() => handleTabChange('About')}>
          About
        </TabButton>
        <TabButton active={activeTab === 'Activities'} onClick={() => handleTabChange('Activities')}>
          Activities
        </TabButton>
        <TabButton active={activeTab === 'Settings'} onClick={() => handleTabChange('Settings')}>
          Settings
        </TabButton>
        <TabButton active={activeTab === 'Projects'} onClick={() => handleTabChange('Projects')}>
          Projects
        </TabButton>
      </Box>

      <SectionContainer> 
        {tabContent[activeTab]}
      </SectionContainer>
    </Box>
  );
};

export default Profile;