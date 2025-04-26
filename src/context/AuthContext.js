import React, { createContext, useState, useEffect, useContext } from 'react';

// Create Context
const AuthContext = createContext();

// Create Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  // useEffect to retrieve token and userId from local storage on app load
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');

    if (storedToken) {
      setToken(storedToken);
    }
    if (storedUserId) {
      setUserId(storedUserId); 
    }
  }, []);

  // useEffect to store token and userId in local storage whenever they change
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }

    if (userId) {
      localStorage.setItem('userId', userId);
    } else {
      localStorage.removeItem('userId');
    }
  }, [token, userId]); 

  const handleLogin = (userData) => {
    setUser(userData);
    setToken(userData.token);
    setUserId(userData.userId); 
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken, userId, handleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook for using AuthContext
export const useAuth = () => useContext(AuthContext);
export default AuthContext;