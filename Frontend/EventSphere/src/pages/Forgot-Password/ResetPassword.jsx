import { useState } from "react";
import { Container, Typography, TextField, Button, Box, FormHelperText, Alert, List, ListItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const navigate = useNavigate();
  const email = sessionStorage.getItem("Email");
  const role = sessionStorage.getItem("Role");

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [clientErrors, setClientErrors] = useState({});
  const [serverErrors, setServerErrors] = useState(null);

  const runClientValidations = () => {
    const errors = {};

    if (!formData.newPassword.trim()) {
      errors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword.trim()) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = runClientValidations();

    if (Object.keys(errors).length === 0) {
      try {
        setServerErrors(null);
        await axios.post("http://localhost:2025/api/users/reset-password", {
          email,
          role,
          password: formData.newPassword,
        });

        toast.success("Password reset successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          theme: "dark",
        });

        sessionStorage.clear();
        navigate("/login");
      } catch (err) {
        if (err.response?.data) {
          let errors = err.response.data;
          if (errors.errors) {
            setServerErrors([{ errors: errors.errors }]);
          } else {
            setServerErrors([{ errors: "Failed to reset password" }]);
          }
        } else {
          setServerErrors([{ errors: "Server is not responding. Try again later." }]);
        }
      }
    } else {
      setClientErrors(errors);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#121212" }}>
      <Container maxWidth="sm" sx={{ textAlign: "center", backgroundColor: "#1E1E1E", p: 4, borderRadius: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#FBFBFB" }} gutterBottom>
          Reset Password
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
            label="New Password"
            type="password"
            fullWidth
            variant="outlined"
            margin="normal"
            sx={{ input: { color: "#FBFBFB" }, label: { color: "#FBFBFB" } }}
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
          />
          {clientErrors.newPassword && (
            <FormHelperText sx={{ color: "#FF6961", mt: 1 }}>
              {clientErrors.newPassword}
            </FormHelperText>
          )}

          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            variant="outlined"
            margin="normal"
            sx={{ input: { color: "#FBFBFB" }, label: { color: "#FBFBFB" } }}
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          />
          {clientErrors.confirmPassword && (
            <FormHelperText sx={{ color: "#FF6961", mt: 1 }}>
              {clientErrors.confirmPassword}
            </FormHelperText>
          )}

          <Button type="submit" fullWidth variant="contained" sx={{ backgroundColor: "#9BB8FF", color: "#121212", fontWeight: "bold", mt: 2 }}>
            Reset Password
          </Button>
        </form>
      </Container>
    </Box>
  );
};

export default ResetPassword;
