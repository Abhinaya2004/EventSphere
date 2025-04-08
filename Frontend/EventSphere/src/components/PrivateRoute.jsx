import { Navigate, useLocation } from "react-router-dom";
import AuthContext from "../context/Auth";
import { useContext, useState, useEffect } from "react";
import { CircularProgress, Box } from "@mui/material";

const PrivateRoute = ({ children }) => {
  const { userState } = useContext(AuthContext);
  const location = useLocation();
  const path = location.pathname;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        // No token exists, stop loading and user will be redirected to login
        setIsLoading(false);
        return;
      }

      if (userState?.user) {
        // User data has been loaded from AuthProvider
        setIsLoading(false);
        return;
      }

      // If there's a token but no user data yet, keep loading
      // The AuthProvider will eventually load the user data
    };

    checkAuth();
  }, [userState]);

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress sx={{ color: '#C4D9FF' }} />
      </Box>
    );
  }

  // Check for OTP verification and reset password routes
  if (path === "/verify-otp" || path === "/reset-password") {
    const Role = sessionStorage.getItem("Role");
    const Email = sessionStorage.getItem("Email");
    
    if (Role && Email) {
      return children;
    } else {
      return <Navigate to="/forgot-password" />;
    }
  }

   // If user is not logged in, redirect to login
   if (!userState?.user) {
    return <Navigate to="/login" />;
  }
  

  const userRole = (userState?.user?.role || '').toLowerCase();
  console.log(userState)

  // Check if additional details are required
  if ((userRole === 'host' || userRole === 'renter') && !userState.user.additionalDetails) {
    // If trying to access the additional details form, allow it
    if (path === '/additional-details') {
      return children;
    }
    // Otherwise, redirect to the additional details form
    return <Navigate to="/additional-details" />;
  }

 

  // Check if user is trying to access admin routes
  if (path.startsWith('/admin')) {
    if (userRole !== 'admin') {
      // If not admin, redirect to their respective dashboard
      return <Navigate to={`/${userRole}/dashboard`} />;
    }
  }

  // Check if user is trying to access host routes
  if (path.startsWith('/host')) {
    if (userRole !== 'host') {
      // If not host, redirect to their respective dashboard
      return <Navigate to={`/${userRole}/events`} />;
    }
  }

  // Check if user is trying to access renter routes
  if (path.startsWith('/renter')) {
    if (userRole !== 'renter') {
      // If not renter, redirect to their respective dashboard
      return <Navigate to={`/${userRole}/venues`} />;
    }
  }

  if (path.startsWith('/user')) {
    if (userRole !== 'user') {
      // If not renter, redirect to their respective dashboard
      return <Navigate to={`/${userRole}/book-event`} />;
    }
  }

  // If user is authenticated and authorized, render the protected component
  return children;
};

export default PrivateRoute;