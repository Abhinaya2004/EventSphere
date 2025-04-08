import { useState, useContext } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Paper,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../context/Auth";
import { toast } from "react-toastify";

const AdditionalDetailsForm = () => {
  const navigate = useNavigate();
  const { userState } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    organizationName: "",
    panCardNumber: "",
    panCardFile: null,
    organizationAddress: "",
    contactDetails: {
      name: "",
      email: "",
      phone: "",
    },
    bankDetails: {
      beneficiaryName: "",
      accountNumber: "",
      ifscCode: "",
      accountType: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/') && !file.type === 'application/pdf') {
        setError(prev => ({
          ...prev,
          panCardFile: 'File must be an image or PDF'
        }));
        return;
      }
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError(prev => ({
          ...prev,
          panCardFile: 'File size must be less than 5MB'
        }));
        return;
      }
      setFormData(prev => ({
        ...prev,
        panCardFile: file
      }));
      setError(prev => ({
        ...prev,
        panCardFile: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.organizationName.trim()) {
      errors.organizationName = "Organization name is required";
    }

    if (!formData.panCardNumber.trim()) {
      errors.panCardNumber = "PAN card number is required";
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panCardNumber)) {
      errors.panCardNumber = "Invalid PAN card number format";
    }

    if (!formData.organizationAddress.trim()) {
      errors.organizationAddress = "Organization address is required";
    }

    // Contact Details Validation
    if (!formData.contactDetails.name.trim()) {
      errors["contactDetails.name"] = "Contact person name is required";
    }

    if (!formData.contactDetails.email.trim()) {
      errors["contactDetails.email"] = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactDetails.email)) {
      errors["contactDetails.email"] = "Invalid email format";
    }

    if (!formData.contactDetails.phone.trim()) {
      errors["contactDetails.phone"] = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.contactDetails.phone)) {
      errors["contactDetails.phone"] = "Invalid phone number format";
    }

    // Bank Details Validation
    if (!formData.bankDetails.beneficiaryName.trim()) {
      errors["bankDetails.beneficiaryName"] = "Beneficiary name is required";
    }

    if (!formData.bankDetails.accountNumber.trim()) {
      errors["bankDetails.accountNumber"] = "Account number is required";
    } else if (!/^[0-9]{9,18}$/.test(formData.bankDetails.accountNumber)) {
      errors["bankDetails.accountNumber"] = "Invalid account number";
    }

    if (!formData.bankDetails.ifscCode.trim()) {
      errors["bankDetails.ifscCode"] = "IFSC code is required";
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.bankDetails.ifscCode)) {
      errors["bankDetails.ifscCode"] = "Invalid IFSC code format";
    }

    if (!formData.bankDetails.accountType.trim()) {
      errors["bankDetails.accountType"] = "Account type is required";
    }

    if (!formData.panCardFile) {
      errors.panCardFile = "PAN card file is required";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setError(errors);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();
      
      // Append all form fields to FormData
      Object.keys(formData).forEach(key => {
        if (key === 'contactDetails' || key === 'bankDetails') {
          Object.keys(formData[key]).forEach(subKey => {
            formDataToSend.append(`${key}[${subKey}]`, formData[key][subKey]);
          });
        } else if (key === 'panCardFile') {
          formDataToSend.append('panCardFile', formData.panCardFile);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      await axios.post(
        `http://localhost:2025/api/additional-details`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: token,
          },
        }
      );

      toast.success("Additional details submitted successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "dark",
      });

      // Redirect based on user role
      if (userState.user.role === "host") {
        navigate("/host/events");
      } else if (userState.user.role === "renter") {
        navigate("/renter/venues");
      }
    } catch (err) {
      if (err.response?.data) {
        // Handle array format errors
        if (Array.isArray(err.response.data)) {
          setError(err.response.data);
        } else {
          // Convert single error object to array format
          setError([{ errors: err.response.data.error || "Failed to submit details" }]);
        }
      } else {
        setError([{ errors: "Server is not responding. Try again later." }]);
      }
      toast.error("Failed to submit details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{background: "#1C1C1C"}}>
      <Box >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            backgroundColor: "#1C1C1C",
            color: "#FBFBFB",
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ color: "#C4D9FF", textAlign: "center", mb: 4 }}
          >
            Additional Details Required
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2, backgroundColor: "#2E2E2E", color: "#FBFBFB" }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>Errors</Typography>
              <List sx={{ paddingLeft: 2 }}>
                {Array.isArray(error) ? (
                  error.map((err, i) => (
                    <ListItem key={i} sx={{ display: "list-item", color: "#FF6961" }}>
                      {err.errors || err.msg}
                    </ListItem>
                  ))
                ) : (
                  Object.entries(error).map(([key, value]) => (
                    <ListItem key={key} sx={{ display: "list-item", color: "#FF6961" }}>
                      {value}
                    </ListItem>
                  ))
                )}
              </List>
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Organization Details */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ color: "#C4D9FF", mb: 2 }}>
                  Organization Details
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Organization Name"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleChange}
                  error={!!error?.organizationName}
                  helperText={error?.organizationName}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#C4D9FF" },
                      "&:hover fieldset": { borderColor: "#C4D9FF" },
                      "&.Mui-focused fieldset": { borderColor: "#C4D9FF" },
                      color: "#FBFBFB",
                    },
                    "& .MuiInputLabel-root": { color: "#C4D9FF" },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="PAN Card Number"
                  name="panCardNumber"
                  value={formData.panCardNumber}
                  onChange={handleChange}
                  error={!!error?.panCardNumber}
                  helperText={error?.panCardNumber}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#C4D9FF" },
                      "&:hover fieldset": { borderColor: "#C4D9FF" },
                      "&.Mui-focused fieldset": { borderColor: "#C4D9FF" },
                      color: "#FBFBFB",
                    },
                    "& .MuiInputLabel-root": { color: "#C4D9FF" },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  component="label"
                  sx={{
                    color: "#C4D9FF",
                    borderColor: "#C4D9FF",
                    "&:hover": { borderColor: "#C4D9FF" },
                  }}
                >
                  Upload PAN Card
                  <input
                    type="file"
                    hidden
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                  />
                </Button>
                {formData.panCardFile && (
                  <Typography sx={{ color: "#FBFBFB", mt: 1 }}>
                    Selected file: {formData.panCardFile.name}
                  </Typography>
                )}
                {error?.panCardFile && (
                  <Typography sx={{ color: "#FF6961", mt: 1 }}>
                    {error.panCardFile}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Organization Address"
                  name="organizationAddress"
                  value={formData.organizationAddress}
                  onChange={handleChange}
                  error={!!error?.organizationAddress}
                  helperText={error?.organizationAddress}
                  multiline
                  rows={3}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#C4D9FF" },
                      "&:hover fieldset": { borderColor: "#C4D9FF" },
                      "&.Mui-focused fieldset": { borderColor: "#C4D9FF" },
                      color: "#FBFBFB",
                    },
                    "& .MuiInputLabel-root": { color: "#C4D9FF" },
                  }}
                />
              </Grid>

              {/* Contact Details */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ color: "#C4D9FF", mb: 2 }}>
                  Contact Details
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Contact Person Name"
                  name="contactDetails.name"
                  value={formData.contactDetails.name}
                  onChange={handleChange}
                  error={!!error?.["contactDetails.name"]}
                  helperText={error?.["contactDetails.name"]}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#C4D9FF" },
                      "&:hover fieldset": { borderColor: "#C4D9FF" },
                      "&.Mui-focused fieldset": { borderColor: "#C4D9FF" },
                      color: "#FBFBFB",
                    },
                    "& .MuiInputLabel-root": { color: "#C4D9FF" },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Email"
                  name="contactDetails.email"
                  type="email"
                  value={formData.contactDetails.email}
                  onChange={handleChange}
                  error={!!error?.["contactDetails.email"]}
                  helperText={error?.["contactDetails.email"]}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#C4D9FF" },
                      "&:hover fieldset": { borderColor: "#C4D9FF" },
                      "&.Mui-focused fieldset": { borderColor: "#C4D9FF" },
                      color: "#FBFBFB",
                    },
                    "& .MuiInputLabel-root": { color: "#C4D9FF" },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="contactDetails.phone"
                  value={formData.contactDetails.phone}
                  onChange={handleChange}
                  error={!!error?.["contactDetails.phone"]}
                  helperText={error?.["contactDetails.phone"]}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#C4D9FF" },
                      "&:hover fieldset": { borderColor: "#C4D9FF" },
                      "&.Mui-focused fieldset": { borderColor: "#C4D9FF" },
                      color: "#FBFBFB",
                    },
                    "& .MuiInputLabel-root": { color: "#C4D9FF" },
                  }}
                />
              </Grid>

              {/* Bank Details */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ color: "#C4D9FF", mb: 2 }}>
                  Bank Details
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Beneficiary Name"
                  name="bankDetails.beneficiaryName"
                  value={formData.bankDetails.beneficiaryName}
                  onChange={handleChange}
                  error={!!error?.["bankDetails.beneficiaryName"]}
                  helperText={error?.["bankDetails.beneficiaryName"]}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#C4D9FF" },
                      "&:hover fieldset": { borderColor: "#C4D9FF" },
                      "&.Mui-focused fieldset": { borderColor: "#C4D9FF" },
                      color: "#FBFBFB",
                    },
                    "& .MuiInputLabel-root": { color: "#C4D9FF" },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Account Number"
                  name="bankDetails.accountNumber"
                  value={formData.bankDetails.accountNumber}
                  onChange={handleChange}
                  error={!!error?.["bankDetails.accountNumber"]}
                  helperText={error?.["bankDetails.accountNumber"]}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#C4D9FF" },
                      "&:hover fieldset": { borderColor: "#C4D9FF" },
                      "&.Mui-focused fieldset": { borderColor: "#C4D9FF" },
                      color: "#FBFBFB",
                    },
                    "& .MuiInputLabel-root": { color: "#C4D9FF" },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="IFSC Code"
                  name="bankDetails.ifscCode"
                  value={formData.bankDetails.ifscCode}
                  onChange={handleChange}
                  error={!!error?.["bankDetails.ifscCode"]}
                  helperText={error?.["bankDetails.ifscCode"]}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#C4D9FF" },
                      "&:hover fieldset": { borderColor: "#C4D9FF" },
                      "&.Mui-focused fieldset": { borderColor: "#C4D9FF" },
                      color: "#FBFBFB",
                    },
                    "& .MuiInputLabel-root": { color: "#C4D9FF" },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!error?.["bankDetails.accountType"]}>
                  <InputLabel sx={{ color: "#C4D9FF" }}>Account Type</InputLabel>
                  <Select
                    value={formData.bankDetails.accountType}
                    name="bankDetails.accountType"
                    onChange={handleChange}
                    label="Account Type"
                    sx={{
                      color: "#FBFBFB",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#C4D9FF",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#C4D9FF",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#C4D9FF",
                      },
                    }}
                  >
                    <MenuItem value="savings">Savings</MenuItem>
                    <MenuItem value="current">Current</MenuItem>
                  </Select>
                  {error?.["bankDetails.accountType"] && (
                    <Typography sx={{ color: "#FF6961", mt: 1 }}>
                      {error["bankDetails.accountType"]}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{
                    backgroundColor: "#C4D9FF",
                    textAlign:"center",
                    
                    color: "#1C1C1C",
                    "&:hover": {
                      backgroundColor: "#A3C2FF",
                      
                    },
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : "Submit Details"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default AdditionalDetailsForm; 