import { useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  IconButton,
  Paper,
  FormHelperText,
  Alert,
  List,
  ListItem,
  
} from "@mui/material";
import { CloudUpload, Delete } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addVenue } from "../../redux/Slice/venuesSlice";

const AddVenues = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  // const { status, error } = useSelector((state) => state.addVenue);
  const [formData, setFormData] = useState({
    venueName: "",
    description: "",
    address: "",
    capacity: "",
    dailyRate: "",
    hourlyRate: "",
    amenities: "",
    ownerContact: { email: "", phone: "" },
    images: [],
    documents: [],
  });

  const [clientErrors,setClientErrors] = useState(null)
  const [serverErrors,setServerErrors] = useState(null)

  // if (status === "loading") return <p>Loading venues...</p>;
  // if (status === "failed") return <p>Error: {error}</p>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("ownerContact")) {
      setFormData((prev) => ({
        ...prev,
        ownerContact: { ...prev.ownerContact, [name.split(".")[1]]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      [type]: [...prev[type], ...files],
    }));
  };

  const handleRemoveFile = (index, type) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const runClientValidations = () => {
    const errors = {};
  
    if (!formData.venueName.trim()) errors.venueName = "Venue name is required";
    if (!formData.description.trim()) errors.description = "Description is required";
    if (!formData.address.trim()) errors.address = "Address is required";
  
    if (!formData.capacity.trim()) {
      errors.capacity = "Capacity is required";
    } else if (isNaN(formData.capacity) || formData.capacity <= 0) {
      errors.capacity = "Capacity must be a valid positive number";
    }
  
    if (!formData.dailyRate.trim() && !formData.hourlyRate.trim()) {
      errors.dailyRate = "Either daily rate or hourly rate is required";
      errors.hourlyRate = "Either daily rate or hourly rate is required";
    } else {
      if (formData.dailyRate.trim() && (isNaN(formData.dailyRate) || formData.dailyRate < 0)) {
        errors.dailyRate = "Daily rate must be a valid positive number";
      }
      if (formData.hourlyRate.trim() && (isNaN(formData.hourlyRate) || formData.hourlyRate < 0)) {
        errors.hourlyRate = "Hourly rate must be a valid positive number";
      }
    }
  
    if (!formData.amenities.trim()) errors.amenities = "Amenities field is required";
  
    if (!formData.ownerContact.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.ownerContact.email)) {
      errors.email = "Enter a valid email address";
    }
  
    if (!formData.ownerContact.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.ownerContact.phone)) {
      errors.phone = "Phone number must be a valid 10-digit number";
    }
  
    if (formData.images.length === 0) {
      errors.images = "At least one image is required";
    } else if (formData.images.length > 5) {
      errors.images = "You can upload up to 5 images only";
    }
  
    if (formData.documents.length === 0) {
      errors.documents = "You must upload at least one document";
    } else if (formData.documents.length > 3) {
      errors.documents = "You can upload up to 3 documents only";
    }
  
    return errors;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form...");
  
    const clientValidationErrors = runClientValidations();
  
    if (Object.keys(clientValidationErrors).length === 0) {
      try {
        setServerErrors(null);
  
        // ✅ Convert price to JSON string
        const formattedPrice = JSON.stringify({
          dailyRate: formData.dailyRate,
          hourlyRate: formData.hourlyRate,
        });
  
        // ✅ Convert ownerContact to JSON string
        const formattedOwnerContact = JSON.stringify(formData.ownerContact);
  
        // ✅ Convert amenities from string to an array if needed
        let formattedAmenities = formData.amenities;
        if (typeof formData.amenities === "string") {
          formattedAmenities = JSON.stringify(
            formData.amenities.split(",").map((item) => item.trim())
          );
        } else {
          formattedAmenities = JSON.stringify(formData.amenities);
        }
  
        // ✅ Prepare the venue data
        const venueData = {
          ...formData,
          price: formattedPrice,
          ownerContact: formattedOwnerContact,
          amenities: formattedAmenities,
        };
  
        // ✅ Dispatch Redux action
        await dispatch(addVenue(venueData)).unwrap();
  
        // ✅ Show success toast
        toast.success("Venue added successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          theme: "dark",
        });
  
        // ✅ Reset form
        setFormData({
          venueName: "",
          description: "",
          address: "",
          capacity: "",
          dailyRate: "",
          hourlyRate: "",
          amenities: [],
          ownerContact: { email: "", phone: "" },
          images: [],
          documents: [],
        });
  
        navigate("/renter/venues");
      } catch (err) {
        if (err.response?.data) {
            let errors = err.response.data;
            if (errors.errors) {
                setServerErrors([{ errors: errors.errors }]);
            } else {
                setServerErrors([{ errors: "Failed to add venue" }]);
            }
        } else {
            setServerErrors([{ errors: "Server is not responding. Try again later." }]);
        }
      }
    } else {
      setClientErrors(clientValidationErrors);
    }
  };
  

  

  return (
    
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#121212",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          backgroundColor: "#1E1E1E",
          p: 4,
          borderRadius: 2,
          boxShadow: "0 0 10px rgba(255,255,255,0.1)",
        }}
      >
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
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", color: "#FBFBFB" , textAlign: "center", mb: 3 }}
        >
          Add Venue
        </Typography>
  
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Venue Name */}
            <Grid item xs={12}>
              <TextField
                label="Venue Name"
                name="venueName"
                value={formData.venueName}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                sx={{ input: { color: "#FBFBFB" }, label: { color: "#FBFBFB" } }}
              />
              {clientErrors?.venueName && (
                <FormHelperText sx={{ color: "#FF6961", mt: 1 }}>
                  <Typography variant="body2" fontWeight="bold">
                    {clientErrors.venueName}
                  </Typography>
                </FormHelperText>
              )}
            </Grid>
  
            {/* Description */}
            <Grid item xs={12}>
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              sx={{ 
                label: { color: "#FBFBFB" }, 
              }}
              InputProps={{
                style: { color: "#FBFBFB" } // ✅ Ensures white input text
              }}
             />
              {clientErrors?.description && (
                <FormHelperText sx={{ color: "#FF6961", mt: 1 }}>
                  <Typography variant="body2" fontWeight="bold">
                    {clientErrors.description}
                  </Typography>
                </FormHelperText>
              )}
            </Grid>
  
            {/* Address */}
            <Grid item xs={12}>
              <TextField
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                sx={{ input: { color: "#FBFBFB" }, label: { color: "#FBFBFB" } }}
              />
              {clientErrors?.address && (
                <FormHelperText sx={{ color: "#FF6961", mt: 1 }}>
                  <Typography variant="body2" fontWeight="bold">
                    {clientErrors.address}
                  </Typography>
                </FormHelperText>
              )}
            </Grid>
  
            {/* Capacity */}
            <Grid item xs={12}>
              <TextField
                label="Capacity"
                name="capacity"
                type="number"
                value={formData.capacity}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                sx={{ input: { color: "#FBFBFB" }, label: { color: "#FBFBFB" } }}
              />
              {clientErrors?.capacity && (
                <FormHelperText sx={{ color: "#FF6961", mt: 1 }}>
                  <Typography variant="body2" fontWeight="bold">
                    {clientErrors.capacity}
                  </Typography>
                </FormHelperText>
              )}
            </Grid>
  
            {/* Daily Rate */}
            <Grid item xs={6}>
              <TextField
                label="Daily Rate"
                name="dailyRate"
                type="number"
                value={formData.dailyRate}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                sx={{ input: { color: "#FBFBFB" }, label: { color: "#FBFBFB" } }}
              />
              {clientErrors?.dailyRate && (
                <FormHelperText sx={{ color: "#FF6961", mt: 1 }}>
                  <Typography variant="body2" fontWeight="bold">
                    {clientErrors.dailyRate}
                  </Typography>
                </FormHelperText>
              )}
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Hourly Rate"
                name="hourlyRate"
                type="number"
                value={formData.hourlyRate}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                sx={{ input: { color: "#FBFBFB" }, label: { color: "#FBFBFB" } }}
              />
              {clientErrors?.hourlyRate && (
                <FormHelperText sx={{ color: "#FF6961", mt: 1 }}>
                  <Typography variant="body2" fontWeight="bold">
                    {clientErrors.hourlyRate}
                  </Typography>
                </FormHelperText>
              )}
            </Grid>
  
            {/* Amenities */}
            <Grid item xs={12}>
              <TextField
                label="Amenities (comma-separated)"
                name="amenities"
                value={formData.amenities}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                sx={{ input: { color: "#FBFBFB" }, label: { color: "#FBFBFB" } }}
              />
              {clientErrors?.amenities && (
                <FormHelperText sx={{ color: "#FF6961", mt: 1 }}>
                  <Typography variant="body2" fontWeight="bold">
                    {clientErrors.amenities}
                  </Typography>
                </FormHelperText>
              )}
            </Grid>
  
            {/* Owner Contact */}
            <Grid item xs={6}>
              <TextField
                label="Owner Email"
                name="ownerContact.email"
                value={formData.ownerContact.email}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                sx={{ input: { color: "#FBFBFB" }, label: { color: "#FBFBFB" } }}
              />
              {clientErrors?.email && (
                <FormHelperText sx={{ color: "#FF6961", mt: 1 }}>
                  <Typography variant="body2" fontWeight="bold">
                    {clientErrors.email}
                  </Typography>
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Owner Phone"
                name="ownerContact.phone"
                value={formData.ownerContact.phone}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                sx={{ input: { color: "#FBFBFB" }, label: { color: "#FBFBFB" } }}
              />
              {clientErrors?.phone && (
                <FormHelperText sx={{ color: "#FF6961", mt: 1 }}>
                  <Typography variant="body2" fontWeight="bold">
                    {clientErrors.phone}
                  </Typography>
                </FormHelperText>
              )}
            </Grid>
  
           

          {/* Upload Images */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, backgroundColor: "#2E2E2E", textAlign: "center" }}>
              <Typography variant="h6" sx={{ color: "#C5BAFF", mb: 1 }}>
                Upload Images
              </Typography>
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                id="image-upload" 
                style={{ display: "none" }} 
                onChange={(e) => handleFileChange(e, "images")} 
              />
              <label htmlFor="image-upload">
                <Button component="span" variant="contained" startIcon={<CloudUpload />} 
                  sx={{ backgroundColor: "#9BB8FF", fontWeight: "bold", color: "#121212" }}>
                  Choose Images
                </Button>
              </label>

              {/* Error Message for Images */}
              {clientErrors?.images && (
                <FormHelperText sx={{ color: "#FF6961", mt: 1 }}>
                  <Typography variant="body2" fontWeight="bold">
                    {clientErrors.images}
                  </Typography>
                </FormHelperText>
              )}

              {/* Image Previews */}
              
                  {formData.images.map((file, index) => (
                     <Box key={index} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1, p: 1, backgroundColor: "#3A3A3A", borderRadius: 1 }}>
                     <Typography sx={{ color: "#9BB8FF", fontSize: "14px", flexGrow: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                       {file.name}
                     </Typography>
                     <IconButton onClick={() => handleRemoveFile(index, "images")} sx={{ color: "#FF6961" }}>
                       <Delete />
                     </IconButton>
                   </Box>
                  ))}
                
            </Paper>
          </Grid>
              
          {/* Upload Documents */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, backgroundColor: "#2E2E2E", textAlign: "center", borderRadius: 2 }}>
              <Typography variant="h6" sx={{ color: "#C5BAFF", mb: 1 }}>
                Upload Documents (Property Proof, Government ID, Utility Bill)
              </Typography>
              <input 
                type="file" 
                multiple 
                accept=".pdf,.doc,.docx" 
                id="document-upload" 
                style={{ display: "none" }} 
                onChange={(e) => handleFileChange(e, "documents")} 
              />
              <label htmlFor="document-upload">
                <Button component="span" variant="contained" startIcon={<CloudUpload />} 
                  sx={{ backgroundColor: "#9BB8FF", fontWeight: "bold", color: "#121212" }}>
                  Choose Documents
                </Button>
              </label>
              
              {/* Error Message for Documents */}
              {clientErrors?.documents && (
                <FormHelperText sx={{ color: "#FF6961", mt: 1 }}>
                  <Typography variant="body2" fontWeight="bold">
                    {clientErrors.documents}
                  </Typography>
                </FormHelperText>
              )}

              {/* Show selected documents */}
              {formData.documents.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  {formData.documents.map((file, index) => (
                    <Box key={index} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1, p: 1, backgroundColor: "#3A3A3A", borderRadius: 1 }}>
                      <Typography sx={{ color: "#9BB8FF", fontSize: "14px", flexGrow: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {file.name}
                      </Typography>
                      <IconButton onClick={() => handleRemoveFile(index, "documents")} sx={{ color: "#FF6961" }}>
                        <Delete />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}
            </Paper>
          </Grid>

           {/* Submit */}
           <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ backgroundColor: "linear-gradient(90deg, #C4D9FF, #C5BAFF)", fontWeight: "bold" }}
              >
                Submit Venue
              </Button>
            </Grid>
          </Grid>

        </form>
      </Container>
    </Box>
  );
  
};

export default AddVenues;
