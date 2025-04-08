import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchVenueById } from "../../redux/Slice/venuesSlice";
import { Container, Typography, Grid, Button, Box, Paper, TextField, Alert } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import MapCard from "../../components/MapCard";
import axios from "axios";

const BookVenueDetails = () => {
  const { venueId } = useParams();
  const dispatch = useDispatch();

  const { selectedVenue: venue, status, loading, error } = useSelector((state) => state.venues);

  // State for check-in, check-out & amount calculation
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [existingBookings, setExistingBookings] = useState([]);
  const [dateError, setDateError] = useState("");
  const [isCheckingDates, setIsCheckingDates] = useState(false);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    dispatch(fetchVenueById(venueId));
    fetchExistingBookings();
  }, [dispatch, venueId]);

  const fetchExistingBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:2025/api/payment/venue-payments/${venueId}`,
        { 
          headers: { 
            Authorization: token,
          }
        }
      );
      console.log(response.data)

      // No need to filter here since backend already returns only successful bookings
      setExistingBookings(response.data);
    } catch (error) {
      console.error("Error fetching existing bookings:", error);
    }
  };

  const checkDateOverlap = (newCheckIn, newCheckOut) => {
    const newStart = new Date(newCheckIn);
    const newEnd = new Date(newCheckOut);

    for (const booking of existingBookings) {
      const existingStart = new Date(booking.checkInDate);
      const existingEnd = new Date(booking.checkOutDate);

      // Check for overlap
      if (
        (newStart >= existingStart && newStart < existingEnd) ||
        (newEnd > existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      ) {
        return `Dates overlap with existing booking (${new Date(existingStart).toLocaleDateString()} - ${new Date(existingEnd).toLocaleDateString()})`;
      }
    }
    return "";
  };

  const validateDates = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return "Please select both check-in and check-out dates";
    
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      return "Check-in date cannot be in the past";
    }

    if (checkOutDate <= checkInDate) {
      return "Check-out date must be after check-in date";
    }

    return "";
  };

  const handleDateChange = (dateType, value) => {
    setIsCheckingDates(true);
    if (dateType === "checkIn") {
      setCheckInDate(value);
      if (value && checkOutDate) {
        const validationError = validateDates(value, checkOutDate);
        if (validationError) {
          setDateError(validationError);
        } else {
          const overlapError = checkDateOverlap(value, checkOutDate);
          setDateError(overlapError);
        }
      }
    } else {
      setCheckOutDate(value);
      if (value && checkInDate) {
        const validationError = validateDates(checkInDate, value);
        if (validationError) {
          setDateError(validationError);
        } else {
          const overlapError = checkDateOverlap(checkInDate, value);
          setDateError(overlapError);
        }
      }
    }
    setIsCheckingDates(false);
  };

  useEffect(() => {
    if (checkInDate && checkOutDate && venue?.price?.dailyRate) {
      const numDays =
        (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24);
      if (numDays > 0) {
        setTotalAmount(numDays * venue.price.dailyRate);
      } else {
        setTotalAmount(0);
      }
    }
  }, [checkInDate, checkOutDate, venue]);

  if (loading) return <Typography sx={{ color: "#C5BAFF", textAlign: "center", mt: 4 }}>Loading...</Typography>;
  if (error) return <Typography sx={{ color: "#FF6961", textAlign: "center", mt: 4 }}>{error}</Typography>;
  if (!venue) return <Typography sx={{ color: "#FF6961", textAlign: "center", mt: 4 }}>Venue not found.</Typography>;

  const handleBookVenue = async () => {
    if (!checkInDate || !checkOutDate) {
      alert("Please select check-in and check-out dates.");
      return;
    }

    if (dateError) {
      alert("Please select valid dates that don't overlap with existing bookings.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to book the venue.");
        return;
      }

      const response = await axios.post(
        "http://localhost:2025/api/payment/create-checkout-session", 
        {
          venueId,
          checkInDate,
          checkOutDate,
        },
        {
          headers: { 
            Authorization: token,
            'Content-Type': 'application/json'
          },
        }
      );
      console.log(response.data)
      localStorage.setItem('stripeId', response.data.sessionId);
      window.location.href = response.data.url;
    } catch (error) {
      console.error("Booking failed:", error);
      if (error.response?.data?.error) {
        alert(error.response.data.error);
      } else {
        alert("Failed to initiate payment. Please try again.");
      }
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: "#0D0D0D", minHeight: "100vh", color: "#FBFBFB" }}>
      <Typography variant="h3" sx={{ fontWeight: "bold", color: "#C4D9FF", mb: 2, textAlign: "center" }}>
        {venue.venueName}
      </Typography>

      <Grid container spacing={4}>
        {/* Left Section - Venue Details */}
        <Grid item xs={12} md={8}>
          {/* Venue Images - Carousel */}
          <Paper sx={{ p: 3, mb: 2, backgroundColor: "#1C1C1C", textAlign: "center" }}>
            <Typography variant="h6" sx={{ color: "#C4D9FF", mb: 2 }}>Venue Images</Typography>
            {venue.images?.length > 0 ? (
              <Carousel autoPlay animation="slide" navButtonsAlwaysVisible indicators={false} sx={{ borderRadius: "10px" }}>
                {venue.images.map((image, index) => (
                  <img key={index} src={image} alt="Venue" style={{ width: "100%", borderRadius: "10px", height: "400px", objectFit: "cover" }} />
                ))}
              </Carousel>
            ) : (
              <Typography>No images available</Typography>
            )}
          </Paper>

          {/* Venue Information */}
          <Paper sx={{ p: 3, mb: 2, backgroundColor: "#1C1C1C", color: "#FBFBFB" }}>
            <Typography variant="h6" sx={{ color: "#C4D9FF" }}>Venue Information</Typography>
            <Typography>{venue.description}</Typography>
          </Paper>

          {/* Address & Price */}
          <Paper sx={{ p: 3, mb: 2, backgroundColor: "#1C1C1C", color: "#FBFBFB" }}>
            <Typography variant="h6" sx={{ color: "#C4D9FF" }}>Address</Typography>
            <Typography>{venue.address}</Typography>
            <Typography variant="h6" sx={{ color: "#C4D9FF", mt: 2 }}>Pricing</Typography>
            <Typography>
              {venue.price?.dailyRate ? `₹${venue.price.dailyRate}/day` : "Pricing not available"}
            </Typography>
          </Paper>

          {/* Amenities */}
          <Paper sx={{ p: 3, mb: 2, backgroundColor: "#1C1C1C", color: "#FBFBFB" }}>
            <Typography variant="h6" sx={{ color: "#C4D9FF" }}>Amenities</Typography>
            <Typography variant="body1" sx={{ color: "#FBFBFB" }}>
              {venue.amenities?.map((a) => a.replace(/["\\]/g, "")).join(", ") || "No amenities listed"}
            </Typography>
          </Paper>
        </Grid>

        {/* Right Section - Map & Owner Details */}
        <Grid item xs={12} md={4}>
          {/* Map */}
          <Paper sx={{ p: 3, backgroundColor: "#1C1C1C", textAlign: "center", color: "#FBFBFB" }}>
            <Typography variant="h6" sx={{ color: "#C4D9FF", mb: 2 }}>Location</Typography>
            <MapCard address={venue.address} />
          </Paper>

          {/* Owner Details */}
          <Paper sx={{ p: 3, mt: 2, backgroundColor: "#1C1C1C", color: "#FBFBFB" }}>
            <Typography variant="h6" sx={{ color: "#C4D9FF" }}>Owner Contact</Typography>
            <Typography>📧 {venue.ownerContact?.email || "Not Available"}</Typography>
            <Typography>📞 {venue.ownerContact?.phone || "Not Available"}</Typography>
          </Paper>

          {/* ✅ Booking Dates & Total Amount */}
          <Paper sx={{ p: 3, mt: 2, backgroundColor: "#1C1C1C", color: "#FBFBFB" }}>
            <Typography variant="h6" sx={{ color: "#C4D9FF" }}>Booking Dates</Typography>
            <TextField
              type="date"
              label="Check-in Date"
              InputLabelProps={{ shrink: true }}
              value={checkInDate}
              onChange={(e) => handleDateChange("checkIn", e.target.value)}
              inputProps={{ min: today }}
              fullWidth
              sx={{ mt: 1, backgroundColor: "#C4D9FF", color: "#FBFBFB" }}
            />
            
            <TextField
              type="date"
              label="Check-out Date"
              InputLabelProps={{ shrink: true }}
              value={checkOutDate}
              onChange={(e) => handleDateChange("checkOut", e.target.value)}
              inputProps={{ min: checkInDate || today }}
              fullWidth
              sx={{ mt: 2, backgroundColor: "#C4D9FF", color: "#FBFBFB" }}
            />

            {dateError && (
              <Alert severity="error" sx={{ mt: 2, backgroundColor: "#FF6961", color: "#FBFBFB" }}>
                {dateError}
              </Alert>
            )}

            <Typography variant="body2" sx={{ color: "#C5BAFF", mt: 1 }}>
              ⏰ Check-in after **8 AM** | Check-out before **6 AM**
            </Typography>
            <Typography variant="h6" sx={{ color: "#C4D9FF", mt: 2 }}>Total Amount</Typography>
            <Typography sx={{ fontSize: "18px", fontWeight: "bold" }}>
              {totalAmount > 0 ? `₹${totalAmount}` : "Select valid dates"}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Book Venue Button */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Button
          variant="contained"
          disabled={totalAmount <= 0 || dateError || isCheckingDates}
          sx={{
            background: "linear-gradient(90deg, #C4D9FF, #C5BAFF)",
            color: "#121212",
            fontWeight: "bold",
            px: 4,
            py: 1,
          }}
          onClick={handleBookVenue}
        >
          {totalAmount > 0 ? `Book Venue for ₹${totalAmount}` : "Select valid dates"}
        </Button>
      </Box>
    </Box>
  );
};

export default BookVenueDetails;



