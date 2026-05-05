// This is the AuthContext component that provides authentication state and functions to the rest of the app. It uses React Context to manage user authentication status, login, registration, and logout functionality. The context also handles token storage and retrieval from localStorage, as well as setting up axios interceptors for API requests. The design focuses on security and user experience, ensuring that authentication flows are smooth and reliable.


import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import LoadingScreen from '../components/LoadingScreen';
import { safeParseJSON, safeStorageGet, safeStorageSet, clearCorruptedStorage } from '../utils/storage';


// Create the AuthContext and provide a custom hook for accessing it. The AuthProvider component manages the authentication state and provides functions for login, registration, and logout. It also handles token storage and retrieval, as well as setting up axios interceptors for API requests.
const AuthContext = createContext();



// Custom hook to access the AuthContext. This hook ensures that the context is used within an AuthProvider and provides access to the authentication state and functions.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};



// AuthProvider component definition. This component manages the authentication state and provides functions for login, registration, and logout. It also handles token storage and retrieval, as well as setting up axios interceptors for API requests. The component displays a loading screen while initializing the authentication state.
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Configure axios base URL from environment variable
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  // Add axios interceptor for handling auth errors
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token expired or invalid
        logout();
      }
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    // Clear any corrupted storage first
    clearCorruptedStorage();
    
    // Check if user is logged in on app start
    const token = safeStorageGet('token');
    const userData = safeStorageGet('user');
    
    if (token && userData) {
      const parsedUser = safeParseJSON(userData);
      if (parsedUser && typeof parsedUser === 'object' && parsedUser.id) {
        setUser(parsedUser);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    }
    
    setLoading(false);
  }, []);


  // Functions for login, registration, and logout

  const login = async (email, password) => {
    try {
      const response = await axios.post('/users/login', { email, password });
      const { token, user: userData } = response.data;
      
      if (token && userData && typeof userData === 'object') {
        safeStorageSet('token', token);
        safeStorageSet('user', userData);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);
        return { success: true };
      } else {
        return { success: false, message: 'Invalid response from server' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed. Please try again.' 
      };
    }
  };


  // Registration function that sends a POST request to the /users/register endpoint with the user's name, email, and password. If the registration is successful, it stores the returned token and user data in localStorage and sets the user state. If there is an error during registration, it returns an appropriate error message.

  const register = async (name, email, password) => {
    try {
      const response = await axios.post('/users/register', { name, email, password });
      const { token, user: userData } = response.data;
      
      if (token && userData && typeof userData === 'object') {
        safeStorageSet('token', token);
        safeStorageSet('user', userData);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);
        return { success: true };
      } else {
        return { success: false, message: 'Invalid response from server' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed. Please try again.' 
      };
    }
  };



  // Logout function that clears the token and user data from localStorage, removes the Authorization header from axios, and resets the user state to null. This effectively logs the user out of the application.
  const logout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };



  // Render the AuthContext provider with the authentication state and functions. If the authentication state is still loading (e.g., checking for existing token), it displays a loading screen. Once loading is complete, it renders the child components that are wrapped by the AuthProvider.
  return (
    <AuthContext.Provider value={value}>
      {loading ? <LoadingScreen /> : children}
    </AuthContext.Provider>
  );
};