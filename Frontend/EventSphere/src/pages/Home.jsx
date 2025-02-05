import React from 'react';
import { Container, Typography, Grid, Button, Box, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import image from '../assets/bar-club-dance-dancing-wallpaper-preview.jpg'

const Home = () => {
  return (
    <div style={{ backgroundColor: '#121212', color: '#D1E8FF' }}>
      {/* Hero Section */}
      <Box sx={{ backgroundColor: '#1E1E1E', padding: '60px 0', textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: '#F5F5F5' }}>
          Welcome to EventSphere
        </Typography>
        <Typography variant="h5" paragraph sx={{ color: '#D1E8FF' }}>
          Your all-in-one platform for managing events and booking venues.
        </Typography>
        <Button variant="contained" sx={{ backgroundColor: '#9BB8FF', color: '#121212', fontWeight: 'bold' }}>
          Explore Features
        </Button>
      </Box>

      {/* About Section */}
      <Container sx={{ marginTop: 6 }}>
  <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#F5F5F5" }}>
    About EventSphere
  </Typography>
  <Typography paragraph>
    EventSphere is a comprehensive platform tailored for event organizers and venue owners. Whether you are looking to host an event or rent a venue, EventSphere simplifies the process, allowing you to focus on what really matters—creating memorable experiences for your guests.
  </Typography>
  
  <Grid container spacing={4} alignItems="center">
    {/* Image Section */}
    <Grid item xs={12} md={6}>
      <img src={image} alt="EventSphere" style={{ width: "100%", maxHeight: "300px", borderRadius: "8px", objectFit: "cover" }} />
    </Grid>

    {/* Our Vision Text Section */}
    <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", color: "#F5F5F5", marginBottom: 1 }}>
        Our Vision
      </Typography>
      <Typography paragraph sx={12}>
        We aim to bridge the gap between event organizers and venue owners by providing seamless interaction, 
        real-time booking management, and a user-friendly interface that makes event planning simple and efficient.
      </Typography>

      {/* Additional Vision Points */}
      <Typography variant="h6" sx={{ fontWeight: "bold", color: "#F5F5F5", marginTop: 2 }}>
        What We Strive For:
      </Typography>
      <ul style={{ color: "#D1E8FF", fontSize: "1.1rem", paddingLeft: "20px" }}>
        <li>📅 Hassle-free event and venue management</li>
        <li>⚡ Real-time availability and bookings</li>
        <li>🔒 Secure and transparent transactions</li>
        <li>🌍 A thriving community of event organizers & venue owners</li>
      </ul>

      {/* Inspiring Quote */}
      <Typography variant="body1" sx={{ fontStyle: "italic", color: "#C5BAFF", marginTop: 2 }}>
        "Great events start with great venues. We bring them together effortlessly."
      </Typography>
    </Grid>
  </Grid>
</Container>



      {/* FAQ Section */}
      <Container id="features" sx={{ marginTop: 8 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#F5F5F5' }}>
          Frequently Asked Questions
        </Typography>
        <Accordion sx={{ backgroundColor: '#1E1E1E', color: '#D1E8FF' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#9BB8FF' }} />} id="panel1a-header">
            <Typography sx={{ fontWeight: 'bold' }}>What is EventSphere?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              EventSphere is a platform for booking and managing events and venues. It connects event organizers with venue owners, offering features like booking, ticketing, and venue availability management.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ backgroundColor: '#1E1E1E', color: '#D1E8FF' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#9BB8FF' }} />} id="panel2a-header">
            <Typography sx={{ fontWeight: 'bold' }}>How do I book a venue?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Simply search for a venue on the platform, check its availability, and make a booking. You can also communicate with venue owners directly for further details.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ backgroundColor: '#1E1E1E', color: '#D1E8FF' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#9BB8FF' }} />} id="panel3a-header">
            <Typography sx={{ fontWeight: 'bold' }}>How do I list my venue?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              As a venue owner, you can register on EventSphere and submit your venue details for approval. Once approved, your venue will be available for booking.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Container>

      {/* Extra Spacing Before Footer */}
      <Box sx={{ height: '80px' }} />

      {/* Footer Section */}
      <Box sx={{ backgroundColor: '#1E1E1E', padding: '20px 0', marginTop: 'auto' }}>
        <Container sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="#D1E8FF">
            © 2025 EventSphere. All rights reserved.
          </Typography>
          <Typography variant="body2" color="#D1E8FF">
            <a href="#privacy-policy" style={{ textDecoration: 'none', color: '#9BB8FF' }}>Privacy Policy</a> | 
            <a href="#terms" style={{ textDecoration: 'none', color: '#9BB8FF' }}>Terms of Service</a>
          </Typography>
        </Container>
      </Box>
    </div>
  );
};

export default Home;
