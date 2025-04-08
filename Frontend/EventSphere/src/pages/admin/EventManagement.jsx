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

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:2025/api/events/", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      // Access the events array from the response
      const eventsData = response.data.events || [];
      setEvents(eventsData);
      setFilteredEvents(eventsData);
    } catch (error) {
      console.error("Error fetching events:", error);
      // Initialize with empty arrays on error
      setEvents([]);
      setFilteredEvents([]);
    }
  };

  const handleStatusFilterChange = (event) => {
    const status = event.target.value;
    setStatusFilter(status);

    if (status === "All") {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(events.filter((event) => event.status === status));
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: "#0D0D0D", minHeight: "100vh", color: "#FBFBFB" }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", color: "#C4D9FF", mb: 2 }}>
        Event Management
      </Typography>

      <Select
        value={statusFilter}
        onChange={handleStatusFilterChange}
        sx={{ backgroundColor: "#2D2D2D", color: "#FBFBFB", mb: 2 }}
      >
        <MenuItem value="All">All Events</MenuItem>
        <MenuItem value="Upcoming">Upcoming Events</MenuItem>
        <MenuItem value="Ongoing">Ongoing Events</MenuItem>
        <MenuItem value="Completed">Completed Events</MenuItem>
        <MenuItem value="Cancelled">Cancelled Events</MenuItem>
      </Select>

      <TableContainer component={Paper} sx={{ backgroundColor: "#1C1C1C" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "#C5BAFF", fontWeight: "bold" }}>Event Name</TableCell>
              <TableCell sx={{ color: "#C5BAFF", fontWeight: "bold" }}>Date</TableCell>
              <TableCell sx={{ color: "#C5BAFF", fontWeight: "bold" }}>Mode</TableCell>
              <TableCell sx={{ color: "#C5BAFF", fontWeight: "bold" }}>Venue</TableCell>
              <TableCell sx={{ color: "#C5BAFF", fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(filteredEvents) && filteredEvents.map((event) => (
              <TableRow key={event._id}>
                <TableCell sx={{ color: "#FBFBFB" }}>{event.eventName}</TableCell>
                <TableCell sx={{ color: "#FBFBFB" }}>{new Date(event.date).toLocaleDateString()}</TableCell>
                <TableCell sx={{ color: "#FBFBFB" }}>{event.mode}</TableCell>
                <TableCell sx={{ color: "#FBFBFB" }}>
                  {event.mode === "Offline" ? event.venue?.venueName || "Custom Address" : "Online"}
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
                    onClick={() => navigate(`/admin/event-details/${event._id}`)}
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

export default EventManagement;
