import { useState } from "react";
import { Container, Typography, TextField, Button, ToggleButton, ToggleButtonGroup, Box, Link as MuiLink,FormHelperText,Alert,List,ListItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    role: 'user'
})


const handleRoleChange = (event,newRole) => {
  if (newRole !== null) {
    setFormData({...formData,role:newRole});
  }
};

const [clientErrors,setClientErrors] = useState(null)
const [serverErrors,setServerErrors] = useState(null)


const runClientValidations = () => {
    const clientValidationsErrors = {}; 
    if (!formData.email.trim()) {
        clientValidationsErrors.email = 'Email is required';
    }
    if (!formData.role?.trim()) {
        clientValidationsErrors.role = 'Role is required';
    }

    return clientValidationsErrors; 
};

const handleSubmit = async (e) => {
  e.preventDefault();

  const clientValidationsErrors = runClientValidations();

  if (Object.keys(clientValidationsErrors).length === 0) {
      try {
          setServerErrors({});

          // Ensure proper await handling
          const response = await axios.post('http://localhost:2025/api/users/forgot-password', formData);

          // console.log(response)

          if (response?.data) {  // Make sure the response is valid
              toast.success("OTP sent successfully!", {
                  position: "top-right",
                  autoClose: 3000,
                  hideProgressBar: true,
                  closeOnClick: true,
                  pauseOnHover: false,
                  draggable: true,
                  theme: "dark",
              });

              sessionStorage.setItem("Email", formData.email);  // Store email for OTP verification
              sessionStorage.setItem("Role", formData.role);

              setTimeout(() => {
                  navigate('/verify-otp');
              }, 1000);  // Small delay to allow toast to appear
          } else {
              toast.error("Failed to send OTP. Please try again.");
          }

      } catch (err) {
          console.error("Error:", err);
          if (err.response) {
              let errors = err.response.data;
              // console.log("Errors received:", errors); // Debugging
              if (errors.errors) {
                  setServerErrors([{ errors: errors.errors }]);
              } else {
                  setServerErrors([{ errors: "Failed to send OTP" }]);
              }
          } else {
              setServerErrors([{ errors: "Server is not responding. Try again later." }]);
          }
      }
      setClientErrors({});
  } else {
      setClientErrors(clientValidationsErrors);
  }
};




  return (
    <Box sx={{minHeight: "100vh", boxSizing: "border-box", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#121212" }}>
      <Container maxWidth="sm" sx={{ textAlign: "center", backgroundColor: "#1E1E1E", p: 4, borderRadius: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#FBFBFB" }} gutterBottom>
          Forgot Password
        </Typography>
        {serverErrors && (
            <Alert severity="error" sx={{ mb: 2, backgroundColor: "#2E2E2E", color: "#FBFBFB" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>Server Errors</Typography>
            <List sx={{ paddingLeft: 2 }}>
              {Array.isArray(serverErrors) ? serverErrors.map((error, i) => (
                <ListItem key={i} sx={{ display: "list-item", color: "#FF6961" }}>
                  {error.errors || error.msg}
                </ListItem>
              )) : (
                <ListItem sx={{ color: "#FF6961" }}>
                  {typeof serverErrors === 'object' ? serverErrors.errors : serverErrors}
                </ListItem>
              )}
            </List>
            </Alert>
        )}

    <form onSubmit={handleSubmit}>
    <ToggleButtonGroup
      exclusive
      value={formData.role} // ✅ This ensures selected value updates correctly
      onChange={handleRoleChange}
      sx={{ mb: 3, backgroundColor: "#2E2E2E", borderRadius: 1 }}
    >
      <ToggleButton value="user" sx={{ color:"#FFFFFF", '&.Mui-selected': { color: "#C5BAFF" } }}>User</ToggleButton>
      <ToggleButton value="host" sx={{ color:"#FFFFFF", '&.Mui-selected': { color: "#C5BAFF" } }}>Host</ToggleButton>
      <ToggleButton value="renter" sx={{ color: "#FFFFFF", '&.Mui-selected': { color: "#C5BAFF" } }}>Renter</ToggleButton>
      <ToggleButton value="admin" sx={{ color:"#FFFFFF", '&.Mui-selected': { color:"#C5BAFF" } }}>Admin</ToggleButton>
    </ToggleButtonGroup>

      {/* Email & Password Fields */}
      <TextField 
        label="Email" 
        value={formData.email} 
        onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
        variant="outlined" 
        fullWidth 
        sx={{ mb: 2, input: { color: "#FBFBFB" }, label: { color: "#FBFBFB" } }} 
      />
      {clientErrors?.email && (
        <FormHelperText sx={{ color: "#FF6961", mt: 1 }}>
          <Typography variant="body2" fontWeight="bold">
            {clientErrors.email}
          </Typography>
        </FormHelperText>
      )}


      {/* Register Button */}
      <Button type="submit" variant="contained" fullWidth sx={{ backgroundColor: "#9BB8FF", color: "#121212", fontWeight: "bold" }}>
        Send Otp
      </Button>
    </form>
    </Container>
    </Box>
  );
};

export default ForgotPassword


