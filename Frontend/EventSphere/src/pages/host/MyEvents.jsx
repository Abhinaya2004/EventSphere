import { useEffect, useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from '../../redux/Slice/eventSlice'
import AuthContext from "../../context/Auth";
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

const MyEvents = () => {
  const { userState } = useContext(AuthContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Fetch events from Redux store
  const { events, status, error } = useSelector((state) => state.events);

  // ✅ Event status filter
  const [statusFilter, setStatusFilter] = useState("All");
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    if (userState?.user?._id) {
      dispatch(fetchEvents(userState.user._id));
    }
  }, [dispatch, userState?.user?._id]);

  useEffect(() => {
    if (statusFilter === "All") {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(events.filter((event) => event.status === statusFilter));
    }
  }, [events, statusFilter]);

  if (status === "loading") return <p>Loading events...</p>;
  if (status === "failed") return <p>Error: {error}</p>;

  return (
    <Box sx={{ p: 3, backgroundColor: "#0D0D0D", minHeight: "100vh", color: "#FBFBFB" }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", color: "#C4D9FF", mb: 2,  textAlign: "center" }}>
        My Events
      </Typography>

      {/* Status Filter Dropdown */}
      <Select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        sx={{ backgroundColor: "#2D2D2D", color: "#FBFBFB", mb: 2 }}
      >
        <MenuItem value="All">All Events</MenuItem>
        <MenuItem value="Upcoming">Upcoming Events</MenuItem>
        <MenuItem value="Ongoing">Ongoing Events</MenuItem>
        <MenuItem value="Completed">Completed Events</MenuItem>
        <MenuItem value="Cancelled">Cancelled Events</MenuItem>
      </Select>

      {/* Events Table */}
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
            {filteredEvents.map((event) => (
              <TableRow key={event._id}>
                <TableCell sx={{ color: "#FBFBFB" }}>{event.eventName}</TableCell>
                <TableCell sx={{ color: "#FBFBFB" }}>
                  {new Date(event.date).toLocaleDateString()}
                </TableCell>
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
                    onClick={() => navigate(`/host/event-details/${event._id}`)}
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

export default MyEvents;
