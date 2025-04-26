// Function to fetch all admins
const API_URL = process.env.REACT_APP_API_URL;
async function getAllAdmins() {
    try {
      const response = await fetch(`${API_URL}/admin/admin-get-all`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data.admins; // Return the list of admins
    } catch (error) {
      console.error('Error fetching admins:', error);
      return []; // Return an empty array in case of error
    }
  }
  
  // Export the function so it can be used in other files
  export { getAllAdmins };