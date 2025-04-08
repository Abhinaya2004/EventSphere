import { useState, useEffect } from "react";
import { Container, Typography, TextField, Button, Box, Alert, List, ListItem, FormHelperText, Link as MuiLink } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(120); // 2 minutes (120 seconds)
  const [canResend, setCanResend] = useState(false);

  const navigate = useNavigate();
  const email = sessionStorage.getItem("Email");
  const role = sessionStorage.getItem("Role");

  const [clientErrors, setClientErrors] = useState({});
  const [serverErrors, setServerErrors] = useState([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const runClientValidations = () => {
    const clientValidationErrors = {}; 

    if (!otp.trim()) {
      clientValidationErrors.otp = "OTP is required";
    } else if (otp.length !== 6) {
      clientValidationErrors.otp = "Not a valid OTP";
    }

    return clientValidationErrors; 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const clientValidationErrors = runClientValidations(); 

    if (Object.keys(clientValidationErrors).length === 0) {
      try {
        setServerErrors([]);
        console.log(otp)

        const response = await axios.post("http://localhost:2025/api/users/verify-otp", {
          email,
          role,
          otp
        });

        console.log(response)

        toast.success("OTP verified successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          theme: "dark",
        });


        navigate("/reset-password");

      } catch (err) {
        console.log(err)
        if (err.response?.data) {
            let errors = err.response.data;
            if (errors.errors) {
                setServerErrors([{ errors: errors.errors }]);
            } else {
                setServerErrors([{ errors: "Invalid OTP" }]);
            }
        } else {
            setServerErrors([{ errors: "Server is not responding. Try again later." }]);
        }
      }

      setClientErrors({});
    } else {
      setClientErrors(clientValidationErrors);
    }
  };

  const handleResendOtp = async () => {
    try {
      setCanResend(false);
      setTimer(120); // Reset timer to 2 minutes

      await axios.post("http://localhost:2025/api/users/forgot-password", { email, role });

      toast.success("OTP resent successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "dark",
      });

    } catch (err) {
      toast.error("Failed to resend OTP. Try again later.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "dark",
      });
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#121212" }}>
      <Container maxWidth="sm" sx={{ textAlign: "center", backgroundColor: "#1E1E1E", p: 4, borderRadius: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#FBFBFB" }} gutterBottom>
          Enter the OTP sent to {email}:
        </Typography>

        {serverErrors && serverErrors.length > 0 && (
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
          <TextField 
            label="Enter the OTP" 
            value={otp} 
            onChange={(e) => setOtp(e.target.value)} 
            variant="outlined" 
            fullWidth 
            sx={{ mb: 2, input: { color: "#FBFBFB" }, label: { color: "#FBFBFB" } }} 
          />
          {clientErrors?.otp && (
            <FormHelperText sx={{ color: "#FF6961", mt: 1 }}>
              <Typography variant="body2" fontWeight="bold">
                {clientErrors.otp}
              </Typography>
            </FormHelperText>
          )}

          <Button type="submit" variant="contained" fullWidth sx={{ backgroundColor: "#9BB8FF", color: "#121212", fontWeight: "bold" }}>
            Verify OTP
          </Button>
        </form>

        {/* Timer & Resend OTP */}
        <Typography sx={{ color: "#C4D9FF", mt: 2 }}>
          {canResend ? (
            <MuiLink component="button" onClick={handleResendOtp} sx={{ color: "#9BB8FF", fontWeight: "bold", textDecoration: "underline" }}>
              Resend OTP
            </MuiLink>
          ) : (
            `Resend OTP in ${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, '0')}`
          )}
        </Typography>
      </Container>
    </Box>
  );
};

export default VerifyOtp;
