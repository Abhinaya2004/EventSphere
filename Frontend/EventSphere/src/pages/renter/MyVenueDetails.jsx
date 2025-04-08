import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Paper, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchVenueById, deleteVenue } from "../../redux/Slice/venuesSlice.js"

const MyVenueDetails = () => {
  const { venueId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedVenue: venue, status, error } = useSelector((state) => state.venues);

  useEffect(() => {
    dispatch(fetchVenueById(venueId));
  }, [dispatch, venueId]);

  const handleDelete = () => {
    dispatch(deleteVenue(venueId));
    navigate("/renter/venues");
  };

  if (status === "loading") return <Typography>Loading...</Typography>;
  if (status === "failed") return <Typography>Error: {error}</Typography>;
  if (!venue) return <Typography>Venue not found</Typography>;

  return (
    <Box sx={{ p: 3, backgroundColor: "#0D0D0D", minHeight: "100vh", color: "#FBFBFB" }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", color: "#C4D9FF", mb: 2, textAlign: "center" }}>
        Venue Details
      </Typography>

      {/* General Information */}
      <Paper sx={{ p: 3, mb: 2, backgroundColor: "#1C1C1C", color: "#FBFBFB" }}>
        <Typography variant="h6" sx={{ color: "#C4D9FF" }}>General Information</Typography>
        <Typography>Name: {venue.venueName}</Typography>
        <Typography>Description: {venue.description}</Typography>
        <Typography>Address: {venue.address}</Typography>
        <Typography>Capacity: {venue.capacity}</Typography>
        <Typography>Status: {venue.verificationStatus}</Typography>
        <Typography>Admin Remarks: {venue.adminRemarks || "No remarks"}</Typography>
      </Paper>

      {/* Pricing */}
      <Paper sx={{ p: 3, mb: 2, backgroundColor: "#1C1C1C", color: "#FBFBFB" }}>
        <Typography variant="h6" sx={{ color: "#C4D9FF" }}>Pricing</Typography>
        <Typography>Daily Rate: ₹{venue.price?.dailyRate ?? "N/A"}</Typography>
        <Typography>
          Hourly Rate: ₹{venue.price?.hourlyRate ?? "N/A"} (Min {venue.price?.minHourlyDuration} hr, Max {venue.price?.maxHourlyDuration} hr)
        </Typography>
      </Paper>

      {/* Owner Contact */}
      <Paper sx={{ p: 3, mb: 2, backgroundColor: "#1C1C1C", color: "#FBFBFB" }}>
        <Typography variant="h6" sx={{ color: "#C4D9FF" }}>Owner Contact</Typography>
        <Typography>Email: {venue.ownerContact?.email}</Typography>
        <Typography>Phone: {venue.ownerContact?.phone}</Typography>
      </Paper>

      {/* Amenities */}
      <Paper sx={{ p: 3, mb: 2, backgroundColor: "#1C1C1C", color: "#FBFBFB" }}>
        <Typography variant="h6" sx={{ color: "#C4D9FF" }}>Amenities</Typography>
        <Typography>{venue.amenities?.join(", ") || "No amenities listed"}</Typography>
      </Paper>

      {/* Venue Images */}
      {venue.images?.length > 0 && (
        <Paper sx={{ p: 3, mb: 2, backgroundColor: "#1C1C1C", color: "#FBFBFB" }}>
          <Typography variant="h6" sx={{ color: "#C4D9FF" }}>Venue Images</Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
            {venue.images.map((image, index) => (
              <img key={index} src={image} alt="Venue" style={{ width: "200px", borderRadius: "10px" }} />
            ))}
          </Box>
        </Paper>
      )}

      {/* Documents */}
      {venue.documents?.length > 0 && (
        <Paper sx={{ p: 3, mb: 2, backgroundColor: "#1C1C1C", color: "#FBFBFB" }}>
          <Typography variant="h6" sx={{ color: "#C4D9FF" }}>Documents</Typography>
          {venue.documents.map((doc, index) => (
            <Typography key={index}>
              <a href={doc} target="_blank" rel="noopener noreferrer" style={{ color: "#C4D9FF" }}>
                View Document {index + 1}
              </a>
            </Typography>
          ))}
        </Paper>
      )}

      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Button variant="contained" color="error" onClick={handleDelete}>
          Delete
        </Button>
      </Box>
      <Button
        variant="contained"
        sx={{ mt: 3, background: "linear-gradient(90deg, #C4D9FF, #C5BAFF)", color: "#000" }}
        onClick={() => navigate("/renter/venues")}
      >
        Back to My Venues
      </Button>
    </Box>
  );
};

export default MyVenueDetails;
