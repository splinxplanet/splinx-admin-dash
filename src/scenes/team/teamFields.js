// src/scenes/team/teamFields.js 
export const teamViewFields = [
    { label: 'Staff ID', name: 'staffId' },
    { label: 'First Name', name: 'firstName' },
    { label: 'Last Name', name: 'lastName' },
    { label: 'Email', name: 'emailAddress' },
    { label: 'Phone Number', name: 'phoneNumber' },
  { label: 'Profile Image', name: 'profileImage' },  

    { label: 'User Name', name: 'userName' },
    { label: 'Address', name: 'address' },
    { label: 'City', name: 'city' },
    { label: 'Country', name: 'country' },
    { 
      label: 'Next of Kin', 
      name: 'nextOfKin', 
      nestedFields: [
        { label: 'Full Name', name: 'fullName' },
        { label: 'Phone Number', name: 'phoneNumber' },
        { label: 'Email', name: 'email' },
        { label: 'Address', name: 'address' }
      ]
    },
    { label: 'Role', name: 'role' }
  ];