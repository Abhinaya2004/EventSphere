import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Paper, Button } from "@mui/material";
import axios from "axios";

const EventDetails = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEventDetails();
  }, []);

  const fetchEventDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:2025/api/events/${eventId}`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      console.log(response)
      setEvent(response.data);
    } catch (error) {
      console.error("Error fetching event details:", error);
    }
  };

  if (!event) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ p: 3, backgroundColor: "#0D0D0D", minHeight: "100vh", color: "#FBFBFB" }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", color: "#C4D9FF", mb: 2, textAlign: "center" }}>
        Event Details
      </Typography>

      {/* General Information */}
      <Paper sx={{ p: 3, mb: 2, backgroundColor: "#1C1C1C", color: "#FBFBFB" }}>
        <Typography variant="h6" sx={{ color: "#C4D9FF" }}>General Information</Typography>
        <Typography>Name: {event.eventName}</Typography>
        <Typography>Description: {event.description}</Typography>
        <Typography>Date: {new Date(event.date).toLocaleDateString()}</Typography>
        <Typography>Time: {event.startTime}</Typography>
        <Typography>Mode: {event.mode}</Typography>
        <Typography>Status: {event.status}</Typography>
        {/* <Typography>Admin Remarks: {event.adminRemarks || "No remarks"}</Typography> */}
      </Paper>

      {/* Venue Details (if offline) */}
      {event.mode === "Offline" && (
        <Paper sx={{ p: 3, mb: 2, backgroundColor: "#1C1C1C", color: "#FBFBFB" }}>
          <Typography variant="h6" sx={{ color: "#C4D9FF" }}>Venue Details</Typography>
          <Typography>Venue Name: {event.venue?.venueName || "Custom Address"}</Typography>
          <Typography>Address: {event.venue?.address || "N/A"}</Typography>
          <Typography>Capacity: {event.venue?.capacity || "N/A"}</Typography>
        </Paper>
      )}

      {/* Ticket Details */}
      <Paper sx={{ p: 3, mb: 2, backgroundColor: "#1C1C1C", color: "#FBFBFB" }}>
        <Typography variant="h6" sx={{ color: "#C4D9FF" }}>Ticket Information</Typography>
        {event.ticketTypes?.length > 0 ? (
          event.ticketTypes.map((ticket, index) => (
            <Typography key={index}>
              {ticket.name}: ₹{ticket.price} (Total: {ticket.availableQuantity})
            </Typography>
          ))
        ) : (
          <Typography>No tickets available</Typography>
        )}
      </Paper>

      {/* Organizer Details */}
      <Paper sx={{ p: 3, mb: 2, backgroundColor: "#1C1C1C", color: "#FBFBFB" }}>
        <Typography variant="h6" sx={{ color: "#C4D9FF" }}>Organizer Contact</Typography>
        <Typography>Email: {event.organizer?.email}</Typography>
        
      </Paper>

      {/* Event Images */}
      {event.images?.length > 0 && (
        <Paper sx={{ p: 3, mb: 2, backgroundColor: "#1C1C1C", color: "#FBFBFB" }}>
          <Typography variant="h6" sx={{ color: "#C4D9FF" }}>Event Images</Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
            {event.images.map((image, index) => (
              <img key={index} src={image} alt="Event" style={{ width: "200px", borderRadius: "10px" }} />
            ))}
          </Box>
        </Paper>
      )}

    <Button
        variant="contained"
        sx={{ mt: 3, background: "linear-gradient(90deg, #C4D9FF, #C5BAFF)", color: "#000" }}
        onClick={() => navigate("/admin/events")}
    >
        Back to Event Management
    </Button>
    </Box>
  );
};

export default EventDetails;
