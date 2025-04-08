import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Typography, Grid, Button, Paper, Box, Divider } from "@mui/material";
import { jsPDF } from "jspdf";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [paymentType, setPaymentType] = useState(null);
  const sessionId = localStorage.getItem("stripeId");

  useEffect(() => {
    if (sessionId) {
      fetchPaymentDetails();
    }
  }, [sessionId]);

  const fetchPaymentDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(`http://localhost:2025/api/payment/update-status/${sessionId}`, 
        { status: "Success" },
        { headers: { Authorization: token } }
      );
      setPaymentDetails(response.data);
      
      // Determine payment type based on the response data
      if (response.data.venueName) {
        setPaymentType("venue");
      } else if (response.data.eventName) {
        setPaymentType("event");
      }
    } catch (error) {
      console.error("Error fetching payment details:", error);
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("EventSphere - Payment Receipt", 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Payment ID: ${paymentDetails._id}`, 20, 40);
    doc.text(`Amount Paid: ₹${paymentDetails.amount}`, 20, 50);
    doc.text(`Payment Status: ${paymentDetails.status}`, 20, 60);
    doc.text(`Payment Date: ${new Date(paymentDetails.createdAt).toLocaleDateString()}`, 20, 70);

    if (paymentType === "venue") {
      doc.setFontSize(14);
      doc.text("Venue Details:", 20, 90);
      doc.setFontSize(12);
      doc.text(`Venue Name: ${paymentDetails.venueName}`, 20, 100);
      doc.text(`Venue Address: ${paymentDetails.venueAddress}`, 20, 110);
      doc.text(`Check-in: ${new Date(paymentDetails.checkInDate).toLocaleDateString()}`, 20, 120);
      doc.text(`Check-out: ${new Date(paymentDetails.checkOutDate).toLocaleDateString()}`, 20, 130);
    } else {
      doc.setFontSize(14);
      doc.text("Event Details:", 20, 90);
      doc.setFontSize(12);
      doc.text(`Event Name: ${paymentDetails.eventName}`, 20, 100);
      doc.text(`Event Date: ${new Date(paymentDetails.eventDate).toLocaleDateString()}`, 20, 110);
      doc.text(`Ticket Type: ${paymentDetails.ticketType}`, 20, 120);
      doc.text(`Quantity: ${paymentDetails.ticketQuantity}`, 20, 130);
    }

    doc.save(`EventSphere_Receipt_${paymentType}.pdf`);
  };

  if (!paymentDetails) {
    return <Typography sx={{ color: "#C5BAFF", textAlign: "center", mt: 4 }}>Fetching payment details...</Typography>;
  }

  return (
    <Container sx={{ p: 3, backgroundColor: "#0D0D0D", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Paper 
        sx={{
          p: 4, 
          backgroundColor: "#1C1C1C", 
          color: "#FBFBFB", 
          borderRadius: "10px",
          width: "500px",
          position: "relative",
          boxShadow: "0px 0px 15px rgba(255, 255, 255, 0.2)",
          "&::before": {
            content: '""',
            position: "absolute",
            top: "50%",
            left: "-20px",
            width: "20px",
            height: "40px",
            backgroundColor: "#0D0D0D",
            borderRadius: "50%",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            top: "50%",
            right: "-20px",
            width: "20px",
            height: "40px",
            backgroundColor: "#0D0D0D",
            borderRadius: "50%",
          },
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#C4D9FF", textAlign: "center", mb: 3 }}>
          🎟️ EventSphere Ticket
        </Typography>

        <Divider sx={{ backgroundColor: "#C5BAFF", mb: 3 }} />

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ color: "#C4D9FF" }}>Payment Details</Typography>
            <Typography>💳 <strong>Payment ID:</strong> {paymentDetails._id}</Typography>
            <Typography>💰 <strong>Amount Paid:</strong> ₹{paymentDetails.amount}</Typography>
            <Typography>✅ <strong>Status:</strong> {paymentDetails.status}</Typography>
            <Typography>📅 <strong>Date:</strong> {new Date(paymentDetails.createdAt).toLocaleDateString()}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" sx={{ color: "#C4D9FF", mt: 2 }}>
              {paymentType === "venue" ? "Venue Details" : "Event Details"}
            </Typography>
            {paymentType === "venue" ? (
              <>
                <Typography>🏛 <strong>Name:</strong> {paymentDetails.venueName}</Typography>
                <Typography>📍 <strong>Address:</strong> {paymentDetails.venueAddress}</Typography>
                <Typography>📆 <strong>Check-in:</strong> {new Date(paymentDetails.checkInDate).toLocaleDateString()} (8 AM)</Typography>
                <Typography>📆 <strong>Check-out:</strong> {new Date(paymentDetails.checkOutDate).toLocaleDateString()} (6 AM)</Typography>
              </>
            ) : (
              <>
                <Typography>🎪 <strong>Event Name:</strong> {paymentDetails.eventName}</Typography>
                <Typography>📅 <strong>Event Date:</strong> {new Date(paymentDetails.eventDate).toLocaleDateString()}</Typography>
                <Typography>🎫 <strong>Ticket Type:</strong> {paymentDetails.ticketType}</Typography>
                <Typography>🔢 <strong>Quantity:</strong> {paymentDetails.ticketQuantity}</Typography>
              </>
            )}
          </Grid>
        </Grid>

        <Divider sx={{ backgroundColor: "#C5BAFF", my: 3 }} />

        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <Button 
            variant="contained" 
            onClick={handleDownloadPDF} 
            sx={{ background: "linear-gradient(90deg, #C4D9FF, #C5BAFF)", color: "#121212", fontWeight: "bold", px: 4, py: 1 }}
          >
            📄 Download Ticket (PDF)
          </Button>

          <Button 
            variant="contained" 
            onClick={() => navigate("/")} 
            sx={{ background: "#FF6961", color: "#FBFBFB", fontWeight: "bold", px: 4, py: 1 }}
          >
            🔙 Back to Dashboard
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default PaymentSuccess;
