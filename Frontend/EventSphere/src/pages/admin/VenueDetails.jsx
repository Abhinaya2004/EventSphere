import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Paper, Button } from "@mui/material";
import axios from "axios";

const VenueDetails = () => {
  const { venueId } = useParams();
  const [venue, setVenue] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVenueDetails();
  }, []);

  const fetchVenueDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:2025/api/venues/${venueId}`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      setVenue(response.data);
    } catch (error) {
      console.error("Error fetching venue details:", error);
    }
  };

  const handleApproval = async (isApproved) => {
    try {
        await axios.put(
            `http://localhost:2025/api/admin/venues/${venueId}/approve`,
            { isApproved: Boolean(isApproved) }, 
            {
              headers: {
                Authorization: localStorage.getItem("token"),
              },
            }
          );
      navigate("/admin/venues");
    } catch (error) {
      console.error("Error updating approval status:", error);
    }
  };

  if (!venue) return <Typography>Loading...</Typography>;

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

      {/* Approval Buttons */}
      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Button variant="contained" sx={{ mr: 2 }} onClick={() => handleApproval(true)}>
          Approve
        </Button>
        <Button variant="contained" color="error" onClick={() => handleApproval(false)}>
          Reject
        </Button>
      </Box>

      <Button
        variant="contained"
        sx={{ mt: 3, background: "linear-gradient(90deg, #C4D9FF, #C5BAFF)", color: "#000" }}
        onClick={() => navigate("/admin/venues")}
    >
        Back to Venue Management
    </Button>
    </Box>
  );
};

export default VenueDetails;
