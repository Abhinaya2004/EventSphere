import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Paper, Button } from "@mui/material";
import axios from "axios";

const AdditionalDetails = () => {
  const { userId } = useParams();
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:2025/api/admin/additional-details/${userId}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      setUserDetails(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  if (!userDetails) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ p: 3, backgroundColor: "#0D0D0D", minHeight: "100vh", color: "#FBFBFB" }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", color: "#C4D9FF", mb: 2 }}>
        Additional Details
      </Typography>

      {/* Organization Details */}
      <Paper sx={{ p: 3, mb: 3, backgroundColor: "#1C1C1C", color: "#FBFBFB" }}>
        <Typography variant="h6" sx={{ color: "#C5BAFF", mb: 1 }}>
          Organization Details
        </Typography>
        <Typography>Organization Name: {userDetails.organizationName}</Typography>
        <Typography>PAN Card Number: {userDetails.panCardNumber}</Typography>
        <Typography>Organization Address: {userDetails.organizationAddress}</Typography>

        {/* Display PAN Card Image or Link */}
        {userDetails.panCard ? (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: "bold", color: "#C4D9FF" }}>
              PAN Card:
            </Typography>
            <img
              src={userDetails.panCard}
              alt="PAN Card"
              onError={(e) => (e.target.style.display = "none")} // Hide if image fails to load
              style={{
                width: "200px",
                height: "auto",
                marginTop: "8px",
                borderRadius: "5px",
                display: "block",
              }}
            />
            <Typography>
              <a href={userDetails.panCard} target="_blank" rel="noopener noreferrer" style={{ color: "#C4D9FF" }}>
                View PAN Card
              </a>
            </Typography>
          </Box>
        ) : (
          <Typography>No PAN Card available</Typography>
        )}
      </Paper>

      {/* Contact Details */}
      <Paper sx={{ p: 3, mb: 3, backgroundColor: "#1C1C1C", color: "#FBFBFB" }}>
        <Typography variant="h6" sx={{ color: "#C5BAFF", mb: 1 }}>Contact Details</Typography>
        <Typography>Name: {userDetails.contactDetails.name}</Typography>
        <Typography>Email: {userDetails.contactDetails.email}</Typography>
        <Typography>Phone: {userDetails.contactDetails.phone}</Typography>
      </Paper>

      {/* Bank Details */}
      <Paper sx={{ p: 3, backgroundColor: "#1C1C1C", color: "#FBFBFB" }}>
        <Typography variant="h6" sx={{ color: "#C5BAFF", mb: 1 }}>Bank Details</Typography>
        <Typography>Beneficiary Name: {userDetails.bankDetails.beneficiaryName}</Typography>
        <Typography>Bank Name: {userDetails.bankDetails.bankName}</Typography>
        <Typography>Account Type: {userDetails.bankDetails.accountType}</Typography>
        <Typography>Account Number: {userDetails.bankDetails.accountNumber}</Typography>
        <Typography>IFSC Code: {userDetails.bankDetails.ifscCode}</Typography>
      </Paper>

      {/* Back Button */}
      <Button
        variant="contained"
        sx={{ mt: 3, background: "linear-gradient(90deg, #C4D9FF, #C5BAFF)", color: "#000" }}
        onClick={() => navigate("/admin/users")}
      >
        Back to User Management
      </Button>
    </Box>
  );
};

export default AdditionalDetails;
