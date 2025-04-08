import { useState, useContext, useEffect } from "react";
import { Box, Typography, Paper, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from "@mui/material";
import axios from "axios";
import AuthContext from "../context/Auth";

const BookingList = () => {
  const { userState } = useContext(AuthContext);
  const [eventBookings, setEventBookings] = useState([]);
  const [venueBookings, setVenueBookings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!userState) return;

      try {
        const token = localStorage.getItem("token");
        if (userState?.user?.role === "host") {
          // Fetch event bookings for host
          const eventResponse = await axios.get(
            "http://localhost:2025/api/payment/event",
            { headers: { Authorization: token } }
          );
          // Filter only successful bookings
          setEventBookings(eventResponse.data.filter(booking => booking.status === "Success"));
        } else {
          // Fetch venue bookings for renter
          const venueResponse = await axios.get(
            "http://localhost:2025/api/payment/venue",
            { headers: { Authorization: token } }
          );
          // Filter only successful bookings
          setVenueBookings(venueResponse.data.filter(booking => booking.status === "Success"));
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError("Failed to fetch bookings");
      }
    };

    fetchBookings();
  }, [userState]);

  if (!userState) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: "#0D0D0D", minHeight: "100vh", color: "#FBFBFB" }}>
      <Typography variant="h4" sx={{ mb: 4, color: "#C4D9FF", textAlign: "center" }}>
        {userState?.user?.role === "host" ? "Event Bookings" : "Venue Bookings"}
      </Typography>

      {userState?.user?.role === "host" ? (
        // Host View - Event Bookings
        <TableContainer component={Paper} sx={{ backgroundColor: "#1C1C1C" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "#C4D9FF" }}>Event Name</TableCell>
                <TableCell sx={{ color: "#C4D9FF" }}>Date</TableCell>
                <TableCell sx={{ color: "#C4D9FF" }}>Ticket Type</TableCell>
                <TableCell sx={{ color: "#C4D9FF" }}>Quantity</TableCell>
                <TableCell sx={{ color: "#C4D9FF" }}>Amount</TableCell>
                <TableCell sx={{ color: "#C4D9FF" }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {eventBookings.map((booking) => (
                <TableRow key={booking._id}>
                  <TableCell sx={{ color: "#FBFBFB" }}>{booking.eventName}</TableCell>
                  <TableCell sx={{ color: "#FBFBFB" }}>
                    {new Date(booking.eventDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell sx={{ color: "#FBFBFB" }}>{booking.ticketType}</TableCell>
                  <TableCell sx={{ color: "#FBFBFB" }}>{booking.ticketQuantity}</TableCell>
                  <TableCell sx={{ color: "#FBFBFB" }}>₹{booking.amount}</TableCell>
                  <TableCell>
                    <Chip
                      label={booking.status}
                      color="success"
                      sx={{ backgroundColor: "#4CAF50" }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        // Renter View - Venue Bookings
        <TableContainer component={Paper} sx={{ backgroundColor: "#1C1C1C" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "#C4D9FF" }}>Venue Name</TableCell>
                <TableCell sx={{ color: "#C4D9FF" }}>Address</TableCell>
                <TableCell sx={{ color: "#C4D9FF" }}>Check-in</TableCell>
                <TableCell sx={{ color: "#C4D9FF" }}>Check-out</TableCell>
                <TableCell sx={{ color: "#C4D9FF" }}>Amount</TableCell>
                <TableCell sx={{ color: "#C4D9FF" }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {venueBookings.map((booking) => (
                <TableRow key={booking._id}>
                  <TableCell sx={{ color: "#FBFBFB" }}>{booking.venueName}</TableCell>
                  <TableCell sx={{ color: "#FBFBFB" }}>{booking.venueAddress}</TableCell>
                  <TableCell sx={{ color: "#FBFBFB" }}>
                    {new Date(booking.checkInDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell sx={{ color: "#FBFBFB" }}>
                    {new Date(booking.checkOutDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell sx={{ color: "#FBFBFB" }}>₹{booking.amount}</TableCell>
                  <TableCell>
                    <Chip
                      label={booking.status}
                      color="success"
                      sx={{ backgroundColor: "#4CAF50" }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default BookingList; 