import { useState } from "react";
import { 
  Container, Typography, TextField, Button, 
  ToggleButton, ToggleButtonGroup, Box, 
  FormHelperText, Alert, List, ListItem, 
  MenuItem, IconButton ,Autocomplete,Grid,Paper
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { CloudUpload, Delete } from "@mui/icons-material";
import { blue } from "@mui/material/colors";
import { useDispatch } from "react-redux";
import { addEvent } from "../../redux/Slice/eventSlice";

const AddEvent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  
  // 🔹 Form State
  const [formData, setFormData] = useState({
    eventName: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    mode: "Offline",
    type: "",
    venue: "",
    customAddress: "",
    streamingLink:"",
    ticketTypes: [{ name: "", price: "", availableQuantity: "" }],
    images: [],
  });

  // 🔹 Error States
  const [clientErrors, setClientErrors] = useState(null);
  const [serverErrors, setServerErrors] = useState(null);

  const [eventTypes, setEventTypes] = useState([]); // Store event types

  // 🔹 Client-Side Validations
  const runClientValidations = () => {
    const errors = {};
    if (!formData.eventName.trim()) errors.eventName = "Event Name is required";
    if (!formData.description.trim()) errors.description = "Description is required";
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to only compare the date part
    
    if (!formData.date) {
      errors.date = "Date is required";
    } else {
      const selectedDate = new Date(formData.date + "T00:00:00"); // Force date-only format
      if (selectedDate.getTime() <= today.getTime()) {
        errors.date = "Date must be in the future";
      }
    }
    if (!formData.startTime) {
      errors.startTime = "Start Time is required";
    }
    
    if (!formData.endTime) {
      errors.endTime = "End Time is required";
    } else if (formData.startTime && formData.endTime) {
      const start = new Date(`2000-01-01T${formData.startTime}`);
      const end = new Date(`2000-01-01T${formData.endTime}`);
    
      if (start >= end) {
        errors.startTime = "Start Time must be before End Time";
        errors.endTime = "End Time must be after Start Time";
      }
    }
    if (!formData.mode) errors.mode = "Event Mode is required";
    if (!formData.type) errors.type = "Event Type is required";

    if (formData.mode === "Offline") {
      if (!formData.venue?.trim() && !formData.customAddress?.trim()) {
        errors.venue = "Please select a venue or provide a custom address";
      }
    } else if (formData.mode === "Online") {
      if (!formData.streamingLink?.trim()) {
        errors.streamingLink = "Streaming link is required for online events";
      }
    }

    if (formData.ticketTypes.some(t => !t.name.trim() || !t.price || !t.availableQuantity)) {
      errors.ticketTypes = "All ticket fields are required";
    }

    if (formData.images.length === 0) {
      errors.images = "At least one image is required";
    } else if (formData.images.length > 1) {
      errors.images = "You can upload only one images";
    }

    return errors;
  };

  const venues = ["Grand Hall", "Open Ground", "Conference Room A", "Banquet Hall"];

  // 🔹 Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Handle Mode Change
  const handleModeChange = async (event, newMode) => {
    if (!newMode) return;
  
    try {
      setFormData({ ...formData, mode: newMode, venue: "", customAddress: "" });
  
      // 🔹 Fetch event types based on selected mode
      const response = await axios.get(`http://localhost:2025/api/events/event-types?mode=${newMode}`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
  
      setEventTypes(response.data); // Update state with event types
    } catch (error) {
      console.error("Failed to fetch event types:", error);
    }
  };
  
  

  // 🔹 Handle Ticket Type Changes
  const handleTicketChange = (index, field, value) => {
    const updatedTickets = [...formData.ticketTypes];
    updatedTickets[index][field] = value;
    setFormData({ ...formData, ticketTypes: updatedTickets });
  };

  // 🔹 Add New Ticket Type
  const addTicketType = () => {
    setFormData({
      ...formData,
      ticketTypes: [...formData.ticketTypes, { name: "", price: "", availableQuantity: "" }],
    });
  };

  // 🔹 Remove Ticket Type
  const removeTicketType = (index) => {
    const updatedTickets = [...formData.ticketTypes];
    updatedTickets.splice(index, 1);
    setFormData({ ...formData, ticketTypes: updatedTickets });
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

  

  // 🔹 Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting event form...");
  
    const clientValidationErrors = runClientValidations();
  
    if (Object.keys(clientValidationErrors).length === 0) {
      try {
        setServerErrors(null);
  
        // ✅ Format ticket types as JSON
        const formattedTicketTypes = JSON.stringify(formData.ticketTypes.map(ticket => ({
          name: ticket.name,
          price: ticket.price,
          availableQuantity: ticket.availableQuantity,
        })));
  
        // ✅ Prepare event data
        const eventData = {
          ...formData,
          ticketTypes: formattedTicketTypes,
          venue: formData.mode === "Offline" ? formData.venue || null : null,
          customAddress: formData.mode === "Offline" ? formData.customAddress || null : null,
          streamingLink: formData.mode === "Online" ? formData.streamingLink || "" : null,
        };

        // console.log(eventData)
  
        // ✅ Dispatch Redux action
        await dispatch(addEvent(eventData)).unwrap();
  
        // ✅ Show success toast
        toast.success("Event added successfully!", {
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
          eventName: "",
          description: "",
          date: "",
          startTime: "",
          endTime: "",
          mode: "Offline",
          type: "",
          venue: null,
          customAddress: "",
          streamingLink: "",
          ticketTypes: [],
          images: [],
        });
  
        navigate("/host/events");
      } catch (err) {
        if (err.response?.data) {
            let errors = err.response.data;
            if (errors.errors) {
                setServerErrors([{ errors: errors.errors }]);
            } else {
                setServerErrors([{ errors: "Failed to add event" }]);
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
    <Box sx={{
      minHeight: "100vh",
      backgroundColor: "#121212",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
    }}>
      <Container maxWidth="md"
        sx={{
          backgroundColor: "#1E1E1E",
          p: 4,
          borderRadius: 2,
          boxShadow: "0 0 10px rgba(255,255,255,0.1)",
        }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#C4D9FF", mb: 2,  textAlign: "center" }}>Add Event</Typography>

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
    label="Event Name"
    name="eventName"
    value={formData.eventName}
    onChange={handleChange}
    fullWidth
    sx={{ mb: 2, input: { color: "#FBFBFB" }, label: { color: "#FBFBFB" } }}
  />
  {clientErrors?.eventName && (
    <FormHelperText sx={{ color: "#FF6961" }}>{clientErrors.eventName}</FormHelperText>
  )}

  <TextField
    label="Description"
    name="description"
    value={formData.description}
    onChange={handleChange}
    multiline
    rows={3}
    fullWidth
    sx={{ mb: 2, input: { color: "#FBFBFB" }, label: { color: "#FBFBFB" } }}
  />
  {clientErrors?.description && (
    <FormHelperText sx={{ color: "#FF6961" }}>{clientErrors.description}</FormHelperText>
  )}

  <TextField
    label="Date"
    type="date"
    name="date"
    value={formData.date}
    onChange={handleChange}
    fullWidth
    sx={{ mb: 2, input: { color: "#FBFBFB" }, label: { color: "#FBFBFB" } }}
    InputLabelProps={{ shrink: true }}
  />
  {clientErrors?.date && (
    <FormHelperText sx={{ color: "#FF6961" }}>{clientErrors.date}</FormHelperText>
  )}

  <TextField
    label="Start Time"
    type="time"
    name="startTime"
    value={formData.startTime}
    onChange={handleChange}
    fullWidth
    sx={{ mb: 2, input: { color: "#FBFBFB" }, label: { color: "#FBFBFB" } }}
    InputLabelProps={{ shrink: true }}
  />
  {clientErrors?.startTime && (
    <FormHelperText sx={{ color: "#FF6961" }}>{clientErrors.startTime}</FormHelperText>
  )}

  <TextField
    label="End Time"
    type="time"
    name="endTime"
    value={formData.endTime}
    onChange={handleChange}
    fullWidth
    sx={{ mb: 2, input: { color: "#FBFBFB" }, label: { color: "#FBFBFB" } }}
    InputLabelProps={{ shrink: true }}
  />
  {clientErrors?.endTime && (
    <FormHelperText sx={{ color: "#FF6961" }}>{clientErrors.endTime}</FormHelperText>
  )}

  <ToggleButtonGroup
    exclusive
    value={formData.mode}
    onChange={handleModeChange}
    sx={{ mb: 2,background:"linear-gradient(90deg, #C4D9FF, #C5BAFF)"}}
  >
    <ToggleButton value="Online" sx={{ color: "#FBFBFB", borderColor: "#FBFBFB" }}>
      Online
    </ToggleButton>
    <ToggleButton value="Offline" sx={{ color: "#FBFBFB", borderColor: "#FBFBFB" }}>
      Offline
    </ToggleButton>
  </ToggleButtonGroup>

  {/* Event Type Selection */}
  <Autocomplete
  options={eventTypes} // Use the fetched event types
  value={formData.type}
  onChange={(e, newValue) => setFormData({ ...formData, type: newValue })}
  renderInput={(params) => (
    <TextField
      {...params}
      label="Select Event Type"
      fullWidth
      sx={{ mb: 2, input: { color: "#FBFBFB" }, label: { color: "#FBFBFB" } }}
    />
  )}
/>

  {clientErrors?.type && (
    <FormHelperText sx={{ color: "#FF6961" }}>{clientErrors.type}</FormHelperText>
  )}

  {/* Venue Selection */}
  {formData.mode === "Offline" && (
  <>
    <ToggleButtonGroup
      exclusive
      value={formData.venueOption}
      onChange={(e, newValue) => setFormData({ ...formData, venueOption: newValue, venue: null, customAddress: "" })}
      sx={{ mb: 2 , background:"linear-gradient(90deg, #C4D9FF, #C5BAFF)"}}
    >
      <ToggleButton value="venue" sx={{ color: "#FBFBFB", borderColor: "#FBFBFB" }}>
        Select Venue
      </ToggleButton>
      <ToggleButton value="custom" sx={{ color: "#FBFBFB", borderColor: "#FBFBFB" }}>
        Enter Custom Address
      </ToggleButton>
    </ToggleButtonGroup>

    {formData.venueOption === "venue" && (
      <Autocomplete
        options={venues} // Replace with actual venues array
        value={formData.venue}
        onChange={(e, newValue) => setFormData({ ...formData, venue: newValue, customAddress: "" })}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select Venue"
            fullWidth
            sx={{ mb: 2, input: { color: "#FBFBFB" }, label: { color: "#FBFBFB" } }}
          />
        )}
      />
    )}

    {formData.venueOption === "custom" && (
      <TextField
        label="Custom Address"
        name="customAddress"
        value={formData.customAddress}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2, input: { color: "#FBFBFB" }, label: { color: "#FBFBFB" } }}
      />
    )}
  </>
)}

{formData.mode === "Online" && (
  <TextField
    label="Streaming Link"
    name="streamingLink"
    value={formData.streamingLink}
    onChange={handleChange}
    fullWidth
    sx={{ mb: 2, input: { color: "#FBFBFB" }, label: { color: "#FBFBFB" } }}
  />
)}

  

{formData.ticketTypes.map((ticket, index) => (
  <Box key={index} sx={{ display: "flex", gap: 1, mb: 2 }}>
    <TextField
      label="Ticket Name"
      value={ticket.name}
      onChange={(e) => handleTicketChange(index, "name", e.target.value)}
      sx={{ flex: 1, input: { color: "#FBFBFB" }, label: { color: "#FBFBFB" } }}
    />
    <TextField
      label="Price"
      type="number"
      value={ticket.price}
      onChange={(e) => handleTicketChange(index, "price", e.target.value)}
      sx={{ flex: 1, input: { color: "#FBFBFB" }, label: { color: "#FBFBFB" } }}
    />
    <TextField
      label="Available Quantity"
      type="number"
      value={ticket.availableQuantity}
      onChange={(e) => handleTicketChange(index, "availableQuantity", e.target.value)}
      sx={{ flex: 1, input: { color: "#FBFBFB" }, label: { color: "#FBFBFB" } }}
    />
    <IconButton onClick={() => removeTicketType(index)}>
      <Delete sx={{ color: "#FF6961" }} />
    </IconButton>
  </Box>
))}
  <Button onClick={addTicketType} sx={{ color: "#FBFBFB", borderColor: "#FBFBFB",mb:3 }}>
    Add Ticket
  </Button>

   {/* Upload Images */}
   <Grid item xs={12}>
            <Paper sx={{ p: 2, backgroundColor: "#2E2E2E", textAlign: "center",mb:3 }}>
              <Typography variant="h6" sx={{ color: "#C5BAFF", mb: 1 }}>
                Upload Poster
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
                  Choose Image
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
  
</form>


      </Container>
    </Box>
  );
};

export default AddEvent;
