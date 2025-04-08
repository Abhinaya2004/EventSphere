import React from "react";
import { Card, CardContent, CardMedia, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const VenueCard = ({ venue, onBook }) => {
    const navigate = useNavigate()

    const handleClick = ()=>{
        navigate(`/host/book-venue/${venue._id}`)
    }

  return (
    <Card onClick={handleClick} sx={{ 
      maxWidth: 350, 
      backgroundColor: "#1E1E1E", 
      color: "#FBFBFB", 
      borderRadius: 2, 
      boxShadow: "0 0 10px rgba(255,255,255,0.1)", 
      overflow: "hidden"
      
    }}>
      {/* Venue Image */}
      <CardMedia
        component="img"
        height="200"
        image={venue.images[0] || "/default-venue.jpg"} // Default image if no image is available
        alt={venue.venueName}
        sx={{ objectFit: "cover" }}
      />

      <CardContent>
        {/* Venue Name */}
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
          {venue.venueName}
        </Typography>

        {/* Venue Address */}
        <Typography variant="body2" sx={{ color: "#C5BAFF", mb: 1 }}>
          {venue.address}
        </Typography>

        {/* Price Section */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {venue.price.dailyRate ? (
            <Typography variant="body1" sx={{ fontWeight: "bold", color: "#9BB8FF" }}>
              ₹{venue.price.dailyRate} / day
            </Typography>
          ) : (
            <Typography variant="body1" sx={{ fontWeight: "bold", color: "#9BB8FF" }}>
              ₹{venue.price.hourlyRate} / hour
            </Typography>
          )}
        </Box>

        {/* Book Button */}
        <Button 
          variant="contained" 
          fullWidth 
          onClick={() => navigate(`/host/book-venue/${venue._id}`)}
          sx={{ 
            mt: 2, 
            background: "linear-gradient(90deg, #C4D9FF, #C5BAFF)", 
            fontWeight: "bold", 
            color: "#121212",
            "&:hover": { background: "linear-gradient(90deg, #C5BAFF, #C4D9FF)" }
          }}
        >
          Book
        </Button>
      </CardContent>
    </Card>
  );
};

export default VenueCard;
