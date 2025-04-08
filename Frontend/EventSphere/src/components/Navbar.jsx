import { AppBar, Toolbar, Typography, Button, Box, Drawer, List, ListItem, ListItemText, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded"; // Sidebar Open Icon
import CloseRoundedIcon from "@mui/icons-material/CloseRounded"; // Sidebar Close Icon
import logo from "../assets/Screenshot_2025-02-05_130558-removebg-preview.png";
import { useContext, useState, useMemo } from "react";
import AuthContext from "../context/Auth";

const Navbar = () => {
  const { userState, handleLogout } = useContext(AuthContext);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = (open) => {
    setSidebarOpen(open);
  };

  const handleLogoutAndCloseSidebar = () => {
    setSidebarOpen(false); // Close sidebar instantly
    handleLogout(); // Logout user
  };

//  Memoize user role to prevent unnecessary re-renders
 const userRole = useMemo(() => userState?.user?.role || "Guest", [userState.user?.role]);

 // Memoize links based on role
 const Links = useMemo(() => {
   switch (userRole) {
     case "admin":
       return [
         { text: "Dashboard", path: "/admin/dashboard" },
         { text: "Venue Management", path: "/admin/venues" },
         { text: "Event Management", path: "/admin/events" },
         { text: "User Management", path: "/admin/users" },
         { text: "Transactions & Payments", path: "/admin/transactions" },
        //  { text: "Settings", path: "/admin/settings" },
       ];
     case "host":
       return [
         { text: "My Events", path: "/host/events" },
         { text: "Create Event", path: "/host/create-event" },
         { text: "Bookings", path: "/host/bookings" },
         { text: "Payments", path: "/host/payments" },
         { text: "Book Venue", path: "/host/book-venue"},
         { text: "Profile", path:"/profile"}
       ];
     case "renter":
       return [
         { text: "My Venues", path: "/renter/venues" },
         { text: "Add Venue", path: "/renter/add-venue" },
         { text: "Bookings", path: "/renter/bookings" },
         { text: "Payments", path: "/renter/payments" },
         { text: "Profile", path:"/profile"}
       ];
       case "user":
        return [
          { text: "Events", path: "/user/book-event" },
          { text: "Bookings", path: "/user/bookings" },
        
        ];

     default:
       return [];
   }
 }, [userRole]); // Recalculate only when userRole changes

//  console.log("User Role:", userRole);
//  console.log("Links Array", Links)
  

  return (
    <>
      {/* NAVBAR */}
      <AppBar position="static" sx={{ backgroundColor: "#0D0D0D", padding: 0 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* Logo */}
          <Box display="flex" alignItems="center">
            <img src={logo} alt="EventSphere Logo" style={{ height: 60 }} />
            <Typography
              variant="h6"
              sx={{ color: "#FBFBFB", fontWeight: "bold", textDecoration: "none" }}
              component={Link}
              to="/"
            >
              <span style={{ color: "#C5BAFF" }}>Event</span>Sphere
            </Typography>
          </Box>

          {/* Navigation for Logged-Out Users */}
          {!userState.isLoggedIn ? (
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button component={Link} to="/register" sx={{ color: "#FBFBFB", "&:hover": { color: "#C4D9FF" } }}>Register</Button>
              <Button component={Link} to="/login" sx={{ color: "#FBFBFB", "&:hover": { color: "#C4D9FF" } }}>Login</Button>
            </Box>
          ) : (
            // Sidebar Toggle Button for Logged-In Users
            <IconButton onClick={() => toggleSidebar(true)} sx={{ color: "#FBFBFB" }}>
              <MenuRoundedIcon fontSize="large" />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* SIDEBAR */}
      <Drawer
        anchor="right" // Sidebar opens from the right
        open={isSidebarOpen}
        onClose={() => toggleSidebar(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: 280, // Sidebar Width
            backgroundColor: "#2D2D2D", // Greyish Background
            color: "#FBFBFB",
            backdropFilter: "blur(8px)", // Blur Background when Sidebar is Open
            transition: "0.3s ease-in-out", // Smooth Opening & Closing
          },
        }}
      >
        {/* Sidebar Content */}
        <Box sx={{ padding: 2, height: "100vh", display: "flex", flexDirection: "column" }}>
          {/* Close Button */}
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <img src={logo} alt="EventSphere Logo" style={{ height: 50 }} />
            <IconButton onClick={() => toggleSidebar(false)} sx={{ color: "#FBFBFB" }}>
              <CloseRoundedIcon fontSize="large" />
            </IconButton>
          </Box>

          {/* Navigation Links */}
          <List sx={{ marginTop: 3 }}>
            {Links.map((link) => (
              <ListItem
                button
                component={Link}
                to={link.path}
                key={link.path} // Use path instead of text for uniqueness
                onClick={() => toggleSidebar(false)}
                sx={{
                  color: "#FBFBFB",
                  "&:hover": { color: "#C4D9FF", backgroundColor: "rgba(255, 255, 255, 0.1)" },
                }}
              >
                <ListItemText primary={link.text} />
              </ListItem>
            ))}
          </List>


          {/* Logout Button */}
          <Box sx={{ flexGrow: 1 }} /> {/* Pushes Logout Button to the Bottom */}
          <Button
            onClick={handleLogoutAndCloseSidebar}
            variant="contained"
            sx={{
              background: "linear-gradient(90deg, #C4D9FF, #C5BAFF)",
              color: "#000",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "12px",
              padding: "10px 20px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
              "&:hover": { opacity: 0.9, background: "linear-gradient(90deg, #C5BAFF, #C4D9FF)" },
            }}
          >
            Logout
          </Button>
        </Box>
      </Drawer>

    
    </>
  );
};

export default Navbar;
