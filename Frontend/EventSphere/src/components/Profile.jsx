import { useState, useEffect, useContext } from "react";
import { Container, Typography, Grid, TextField, Button, Paper, Box } from "@mui/material";
import Swal from "sweetalert2";
import axios from "axios";
import AuthContext from "../context/Auth";

const ProfilePage = () => {
  const { userState } = useContext(AuthContext);

  // ✅ Ensure userState.user exists before accessing _id
  if (!userState?.user) {
    return <Typography sx={{ color: "#C5BAFF", textAlign: "center", mt: 4 }}>User not found.</Typography>;
  }

  // ✅ Initialize profile state with default structure
  const [profile, setProfile] = useState({
    organizationName: "",
    panCardNumber: "",
    organizationAddress: "",
    contactDetails: {
      name: "",
      email: "",
      phone: "",
    },
    bankDetails: {
      beneficiaryName: "",
      accountType: "",
    },
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  // ✅ Fetch Profile Data
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:2025/api/profile/${userState.user._id}`, {
        headers: { Authorization: token },
      });
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Input Change (Supports Nested Fields)
  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => {
      const keys = name.split("."); // Split keys for nested updates

      if (keys.length === 1) {
        // ✅ Updating top-level fields (e.g., organizationName)
        return { ...prev, [name]: value };
      } else {
        // ✅ Updating nested fields (e.g., contactDetails.name)
        return {
          ...prev,
          [keys[0]]: {
            ...prev[keys[0]],
            [keys[1]]: value,
          },
        };
      }
    });
  };

  // ✅ Update Profile
  const handleUpdate = async () => {
    Swal.fire({
      title: "Confirm Update?",
      text: "Are you sure you want to update your profile details?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#C5BAFF",
      cancelButtonColor: "#FF6961",
      confirmButtonText: "Yes, Update",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          await axios.patch(`http://localhost:2025/api/profile/update/${userState.user._id}`, profile, {
            headers: { Authorization: token },
          });

          Swal.fire("Updated!", "Your profile details have been updated.", "success");
        } catch (error) {
          Swal.fire("Error!", "Failed to update profile. Try again.", "error");
          console.error("Error updating profile:", error);
        }
      }
    });
  };

  if (loading) return <Typography sx={{ color: "#C5BAFF", textAlign: "center", mt: 4 }}>Loading profile...</Typography>;
  if (!profile) return <Typography sx={{ color: "#FF6961", textAlign: "center", mt: 4 }}>Profile not found.</Typography>;

  return (
    <Container sx={{ p: 3, backgroundColor: "#0D0D0D", minHeight: "100vh", color: "#FBFBFB" }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", color: "#C4D9FF", mb: 3, textAlign: "center" }}>
        Profile Information
      </Typography>

      <Paper sx={{ p: 3, backgroundColor: "#1C1C1C", color: "#FBFBFB", borderRadius: "10px" }}>
        <Grid container spacing={3}>
          {/* Organization Details */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ color: "#C4D9FF" }}>Organization Details</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Organization Name" name="organizationName" value={profile.organizationName} onChange={handleChange} sx={{ input: { color: "#FBFBFB" }, label: { color: "#C4D9FF" } }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="PAN Card Number" name="panCardNumber" value={profile.panCardNumber} onChange={handleChange} sx={{ input: { color: "#FBFBFB" }, label: { color: "#C4D9FF" } }} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Organization Address" name="organizationAddress" value={profile.organizationAddress} onChange={handleChange} sx={{ input: { color: "#FBFBFB" }, label: { color: "#C4D9FF" } }} />
          </Grid>

          {/* Contact Details */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ color: "#C4D9FF", mt: 3 }}>Contact Details</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField fullWidth label="Full Name" name="contactDetails.name" value={profile.contactDetails.name} onChange={handleChange} sx={{ input: { color: "#FBFBFB" }, label: { color: "#C4D9FF" } }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField fullWidth label="Email" name="contactDetails.email" value={profile.contactDetails.email} onChange={handleChange} sx={{ input: { color: "#FBFBFB" }, label: { color: "#C4D9FF" } }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField fullWidth label="Phone" name="contactDetails.phone" value={profile.contactDetails.phone} onChange={handleChange} sx={{ input: { color: "#FBFBFB" }, label: { color: "#C4D9FF" } }} />
          </Grid>

          {/* Bank Details */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ color: "#C4D9FF", mt: 3 }}>Bank Details</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Beneficiary Name" name="bankDetails.beneficiaryName" value={profile.bankDetails.beneficiaryName} onChange={handleChange} sx={{ input: { color: "#FBFBFB" }, label: { color: "#C4D9FF" } }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Account Type" name="bankDetails.accountType" value={profile.bankDetails.accountType} onChange={handleChange} sx={{ input: { color: "#FBFBFB" }, label: { color: "#C4D9FF" } }} />
          </Grid>
        </Grid>

        {/* Update Button */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Button variant="contained" sx={{ background: "linear-gradient(90deg, #C4D9FF, #C5BAFF)", color: "#121212", fontWeight: "bold", px: 4, py: 1 }} onClick={handleUpdate}>
            Update Profile
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProfilePage;
