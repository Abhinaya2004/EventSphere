import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchEventById } from "../../redux/Slice/eventSlice";
import {
  Container,
  Typography,
  Grid,
  Button,
  Box,
  Paper,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Card,
  CardMedia,
} from "@mui/material";
import axios from "axios";
import MapCard from "../../components/MapCard"; // 📍 Import Map Component

const BookEventDetails = () => {
  const { eventId } = useParams();
  const dispatch = useDispatch();

  const { selectedEvent: event, loading, error } = useSelector((state) => state.events);

  // ✅ Ticket selection & amount calculation
  const [ticketType, setTicketType] = useState("");
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    dispatch(fetchEventById(eventId));
  }, [dispatch, eventId]);

  useEffect(() => {
    if (ticketType && ticketQuantity > 0) {
      const selectedTicket = event?.ticketTypes?.find((t) => t.name === ticketType);
      setTotalAmount(selectedTicket ? selectedTicket.price * ticketQuantity : 0);
    }
  }, [ticketType, ticketQuantity, event]);

  if (loading) return <Typography sx={{ color: "#C5BAFF", textAlign: "center", mt: 4 }}>Loading...</Typography>;
  if (error) return <Typography sx={{ color: "#FF6961", textAlign: "center", mt: 4 }}>{error}</Typography>;
  if (!event) return <Typography sx={{ color: "#FF6961", textAlign: "center", mt: 4 }}>Event not found.</Typography>;

  const handleBookEvent = async () => {
    if (!ticketType || ticketQuantity <= 0) {
      alert("Please select ticket type and quantity.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:2025/api/payment/create-checkout-session",
        {
          eventId,
          ticketType,
          ticketQuantity,
        },
        { headers: { Authorization: token } }
      );

      localStorage.setItem("stripeId", response.data.sessionId);
      window.location.href = response.data.url;
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Failed to initiate payment.");
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: "#0D0D0D", minHeight: "100vh", color: "#FBFBFB" }}>
      <Typography variant="h3" sx={{ fontWeight: "bold", color: "#C4D9FF", mb: 2, textAlign: "center" }}>
        {event.eventName}
      </Typography>

      <Grid container spacing={4}>
        {/* Left Section - Event Details */}
        <Grid item xs={12} md={8}>
          {/* Event Image */}
          <Card sx={{ backgroundColor: "#1C1C1C", mb: 2, borderRadius: "10px", overflow: "hidden" }}>
            <CardMedia
              component="img"
              height="400"
              image={event.images?.length > 0 ? event.images[0] : "/placeholder.jpg"}
              alt={event.eventName}
              sx={{ objectFit: "cover" }}
            />
          </Card>

          {/* Event Information */}
          <Paper sx={{ p: 3, mb: 2, backgroundColor: "#1C1C1C", color: "#FBFBFB" }}>
            <Typography variant="h6" sx={{ color: "#C4D9FF" }}>Event Description</Typography>
            <Typography>{event.description}</Typography>
          </Paper>

          {/* Event Date & Mode */}
          <Paper sx={{ p: 3, mb: 2, backgroundColor: "#1C1C1C", color: "#FBFBFB" }}>
            <Typography variant="h6" sx={{ color: "#C4D9FF" }}>Event Date & Mode</Typography>
            <Typography>📅 {new Date(event.date).toLocaleDateString()}</Typography>
            <Typography>⏰ {event.startTime} - {event.endTime}</Typography>
            <Typography>🛜 Mode: {event.mode}</Typography>
          </Paper>
        </Grid>

        {/* Right Section - Booking Details & Location */}
        <Grid item xs={12} md={4}>
          {/* Location Details */}
          <Paper sx={{ p: 3, backgroundColor: "#1C1C1C", textAlign: "center", color: "#FBFBFB" }}>
            <Typography variant="h6" sx={{ color: "#C4D9FF", mb: 2 }}>Location</Typography>
            {event.mode === "Offline" ? (
              <>
                <Typography sx={{ mb: 2 }}>{event.venue?.venueName || "Venue Details Not Available"}</Typography>
                <MapCard address={event.venue?.address || "Unknown Address"} />
              </>
            ) : (
              <Typography sx={{ fontStyle: "italic", color: "#C5BAFF" }}>
                This is an Online Event. You will receive the link after booking.
              </Typography>
            )}
          </Paper>

          {/* Ticket Selection */}
          <Paper sx={{ p: 3, backgroundColor: "#1C1C1C", color: "#FBFBFB", mt: 2 }}>
            <Typography variant="h6" sx={{ color: "#C4D9FF" }}>Select Tickets</Typography>

            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel sx={{ color: "#C4D9FF" }}>Ticket Type</InputLabel>
              <Select
                value={ticketType}
                onChange={(e) => setTicketType(e.target.value)}
                sx={{ color: "#FBFBFB", backgroundColor: "#2E2E2E" }}
              >
                {Array.isArray(event.ticketTypes) && event.ticketTypes.length > 0 ? (
                  event.ticketTypes.map((ticket, index) => (
                    <MenuItem key={index} value={ticket.name}>
                      {ticket.name} - ₹{ticket.price} ({ticket.availableQuantity} left)
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No Tickets Available</MenuItem>
                )}
              </Select>
            </FormControl>

            {/* Ticket Quantity */}
            <TextField
              type="number"
              label="Number of Tickets"
              value={ticketQuantity}
              onChange={(e) => setTicketQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
              fullWidth
              sx={{ mt: 2, backgroundColor: "#C4D9FF", color: "#FBFBFB" }}
            />

            {/* Total Amount */}
            <Typography variant="h6" sx={{ color: "#C4D9FF", mt: 2 }}>Total Amount</Typography>
            <Typography sx={{ fontSize: "18px", fontWeight: "bold" }}>
              {totalAmount > 0 ? `₹${totalAmount}` : "Select ticket type & quantity"}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Book Event Button */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Button
          variant="contained"
          disabled={totalAmount <= 0}
          sx={{
            background: "linear-gradient(90deg, #C4D9FF, #C5BAFF)",
            color: "#121212",
            fontWeight: "bold",
            px: 4,
            py: 1,
          }}
          onClick={handleBookEvent}
        >
          {totalAmount > 0 ? `Book Tickets for ₹${totalAmount}` : "Select Ticket to Book"}
        </Button>
      </Box>
    </Box>
  );
};

export default BookEventDetails;
