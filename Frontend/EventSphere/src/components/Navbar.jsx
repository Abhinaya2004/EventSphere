import { AppBar, Toolbar, Typography, Button, Box  } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link } from "react-router-dom";
import logo from "../assets/Screenshot_2025-02-05_130558-removebg-preview.png";
import { useContext } from "react";
import AuthContext from "../context/Auth";

const Navbar = () => {
  const {userState,handleLogout} = useContext(AuthContext)
  return (
    <AppBar position="static" sx={{ backgroundColor: "#0D0D0D", padding: 0, margin: 0  }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Logo */}
        <Box display="flex" alignItems="center">
          <img src={logo} alt="EventSphere Logo" style={{ height: 60, marginRight: 0 }} />
          <Typography variant="h6" sx={{ color: "#FBFBFB", fontWeight: "bold",textDecoration: "none" }}  component={Link} to='/'> 
            <span style={{ color: "#C5BAFF" }}>Event</span>Sphere
          </Typography>
        </Box>
        
        {/* Navigation Links */}
        <div>
          {userState.isLoggedIn ? 
            <>
              <Button component={Link} to="/" sx={{ color: "#FBFBFB", '&:hover': { color: "#C4D9FF" } }}>Home</Button>
              <Button component={Link} to="/events" sx={{ color: "#FBFBFB", '&:hover': { color: "#C4D9FF" } }}>Events</Button>
              <Button component={Link} to="/venues" sx={{ color: "#FBFBFB", '&:hover': { color: "#C4D9FF" } }}>Venues</Button>
             
              <Button startIcon={<LogoutIcon/>}
                onClick={handleLogout}
                
                variant="contained"
                sx={{
                  background: "linear-gradient(90deg, #C4D9FF, #C5BAFF)",
                  color: "#000",
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: "12px",
                  padding: "10px 20px",
                  // display: "flex",
                  // alignItems: "center",
                  // gap: "8px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                  "&:hover": {
                    opacity: 0.9,
                    background: "linear-gradient(90deg, #C5BAFF, #C4D9FF)",
                  },
                }}
              >
                Logout
              </Button>
            </>
            :
            <>
              <Button component={Link} to="/register" sx={{ color: "#FBFBFB", '&:hover': { color: "#C4D9FF" } }}>Register</Button>
              <Button component={Link} to="/login" sx={{ color: "#FBFBFB", '&:hover': { color: "#C4D9FF" } }}>Login</Button>
            </>}
         
          
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;