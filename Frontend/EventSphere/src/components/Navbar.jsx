import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import logo from "../assets/logo_transparent.png";

const Navbar = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#0D0D0D", padding: 0, margin: 0  }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Logo */}
        <Box display="flex" alignItems="center">
          <img src={logo} alt="EventSphere Logo" style={{ height: 60, marginRight: 10 }} />
          <Typography variant="h6" sx={{ color: "#FBFBFB", fontWeight: "bold" }}>
            <span style={{ color: "#C5BAFF" }}>Event</span>Sphere
          </Typography>
        </Box>
        
        {/* Navigation Links */}
        <div>
          <Button component={Link} to="/" sx={{ color: "#FBFBFB", '&:hover': { color: "#C4D9FF" } }}>Home</Button>
          <Button component={Link} to="/events" sx={{ color: "#FBFBFB", '&:hover': { color: "#C4D9FF" } }}>Events</Button>
          <Button component={Link} to="/venues" sx={{ color: "#FBFBFB", '&:hover': { color: "#C4D9FF" } }}>Venues</Button>
          <Button component={Link} to="/register" sx={{ color: "#FBFBFB", '&:hover': { color: "#C4D9FF" } }}>Register</Button>
          <Button component={Link} to="/login" sx={{ color: "#FBFBFB", '&:hover': { color: "#C4D9FF" } }}>Login</Button>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;