import { useState } from "react";
import { Container, Typography, TextField, Button, ToggleButton, ToggleButtonGroup, Box, Link ,FormHelperText,Alert,List,ListItem } from "@mui/material";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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

    if (!formData.password.trim()) {
        clientValidationsErrors.password = 'Password is required';
    }
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

    // console.log(clientValidationsErrors);

    if (Object.keys(clientValidationsErrors).length === 0) {
        try {
            setServerErrors({});
            const response = await axios.post('http://localhost:2025/api/users/register', formData);
            console.log(response)
            toast.success("User registered successfully!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    theme: "dark",
                  });
            navigate('/login');
        } catch (err) {
            if (err.response) {
                let errors = err.response.data;
                // console.log("Errors received:", errors); // Debugging
                if (errors.errors) {
                    setServerErrors([{ errors: errors.errors }]);
                } else {
                    setServerErrors([{ errors: "Registration failed" }]);
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
          Register
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

      <TextField 
        label="Password" 
        value={formData.password} 
        onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
        type="password" 
        variant="outlined" 
        fullWidth 
        sx={{ mb: 2, input: { color: "#FBFBFB" }, label: { color: "#FBFBFB" } }} 
      />
      {clientErrors?.password && (
        <FormHelperText sx={{ color: "#FF6961", mt: 1 }}>
          <Typography variant="body2" fontWeight="bold">
            {clientErrors.password}
          </Typography>
        </FormHelperText>
      )}

      {/* Register Button */}
      <Button type="submit" variant="contained" fullWidth sx={{ backgroundColor: "#9BB8FF", color: "#121212", fontWeight: "bold" }}>
        Register
      </Button>
    </form>
    </Container>
    </Box>
  );
};

export default Register