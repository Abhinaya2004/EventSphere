import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import axios from "axios";

const VenueManagement = () => {
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const response = await axios.get("http://localhost:2025/api/venues/", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      // console.log(response)
      setVenues(response.data);
      setFilteredVenues(response.data)
    } catch (error) {
      console.error("Error fetching venues:", error);
    }
  };

  const handleStatusFilterChange = (event) => {
    const status = event.target.value;
    setStatusFilter(status);

    if (status === "All") {
      setFilteredVenues(venues);
    } else {
      setFilteredVenues(venues.filter((venue) => venue.verificationStatus === status));
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: "#0D0D0D", minHeight: "100vh", color: "#FBFBFB" }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", color: "#C4D9FF", mb: 2 }}>
        Venue Management
      </Typography>
      <Select
        value={statusFilter}
        onChange={handleStatusFilterChange}
        sx={{ backgroundColor: "#2D2D2D", color: "#FBFBFB", mb: 2 }}
      >
        <MenuItem value="All">All Venues</MenuItem>
        <MenuItem value="pending">Pending Venues</MenuItem>
        <MenuItem value="approved">Approved Venues</MenuItem>
        
      </Select>

      <TableContainer component={Paper} sx={{ backgroundColor: "#1C1C1C" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "#C5BAFF", fontWeight: "bold" }}>Venue Name</TableCell>
              <TableCell sx={{ color: "#C5BAFF", fontWeight: "bold" }}>Address</TableCell>
              <TableCell sx={{ color: "#C5BAFF", fontWeight: "bold" }}>Capacity</TableCell>
              <TableCell sx={{ color: "#C5BAFF", fontWeight: "bold" }}>Price</TableCell>
              <TableCell sx={{ color: "#C5BAFF", fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredVenues.map((venue) => (
              <TableRow key={venue._id}>
                <TableCell sx={{ color: "#FBFBFB" }}>{venue.venueName}</TableCell>
                <TableCell sx={{ color: "#FBFBFB" }}>{venue.address}</TableCell>
                <TableCell sx={{ color: "#FBFBFB" }}>{venue.capacity}</TableCell>
                <TableCell sx={{color: "#FBFBFB"}}>
                  {venue.price?.dailyRate ? `₹${venue.price.dailyRate}` : "N/A"}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    sx={{
                      background: "linear-gradient(90deg, #C4D9FF, #C5BAFF)",
                      color: "#000",
                      textTransform: "none",
                      mr: 1,
                    }}
                    onClick={() => navigate(`/admin/venue-details/${venue._id}`)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default VenueManagement;
