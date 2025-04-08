import { Card, CardMedia, CardContent, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  // ✅ Format date properly
  const formattedDate = new Date(event.date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // ✅ Fix image display (extract first image from array)
  const eventImage = event.images?.length > 0 ? event.images[0] : "/placeholder.jpg";

//   console.log("Event Image:", eventImage);

  return (
    <Card
      sx={{
        backgroundColor: "#1C1C1C",
        color: "#FBFBFB",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(255,255,255,0.1)",
      }}
    >
      {/* Event Image */}
      <CardMedia
        component="img"
        height="200"
        image={eventImage}
        alt={event.eventName}
        sx={{ objectFit: "cover" }}
      />

      <CardContent>
        <Typography variant="h6" sx={{ color: "#C4D9FF", fontWeight: "bold" }}>
          {event.eventName}
        </Typography>
        <Typography variant="body2" sx={{ color: "#C4D9FF" }}>
          📅 {formattedDate}
        </Typography>
        <Typography variant="body2">{event.type}</Typography>
        <Typography variant="body1" sx={{ fontWeight: "bold", mt: 1 }}>
          {event.ticketTypes?.length > 0
            ? `Starting at ₹${event.ticketTypes[0].price}`
            : "Free"}
        </Typography>

        {/* View Event Button */}
        <Button
          variant="contained"
          fullWidth
          onClick={() => navigate(`/user/book-event/${event._id}`)}
          sx={{ mt: 2, background: "linear-gradient(90deg, #C4D9FF, #C5BAFF)", color: "#121212" }}
        >
          View Event
        </Button>
      </CardContent>
    </Card>
  );
};

export default EventCard;
