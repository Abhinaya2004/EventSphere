import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 🔹 Fetch Venues for a Renter (by Owner ID)
export const fetchVenues = createAsyncThunk(
  "venues/fetchVenues",
  async (ownerId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:2025/api/venues/owner/${ownerId}`,
        { headers: { Authorization: token } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Unknown error");
    }
  }
);

// 🔹 Fetch a Single Venue by ID
export const fetchVenueById = createAsyncThunk(
  "venues/fetchVenueById",
  async (venueId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:2025/api/venues/${venueId}`,
        { headers: { Authorization: token } }
      );

      console.log("hi",response.data)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Unknown error");
    }
  }
);

// 🔹 Fetch Verified Venues with Search, Sort, and Pagination
export const fetchVerifiedVenues = createAsyncThunk(
  "venues/fetchVerifiedVenues",
  async ({ search = "", sort = "default", page = 1, limit = 6 }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:2025/api/venues/verified", {
        params: { search, sort, page, limit },
        headers: { Authorization: token },
      });

      return response.data; // Expected response: { venues: [], totalPages: X }
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch venues");
    }
  }
);

// 🔹 Add a New Venue
export const addVenue = createAsyncThunk(
  "venues/addVenue",
  async (venueData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      
      Object.keys(venueData).forEach((key) => {
        if (Array.isArray(venueData[key])) {
          venueData[key].forEach((file) => formData.append(key, file));
        } else {
          formData.append(key, venueData[key]);
        }
      });

      const response = await axios.post(
        "http://localhost:2025/api/venues/create",
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Unknown error");
    }
  }
);

// 🔹 Delete a Venue
export const deleteVenue = createAsyncThunk(
  "venues/deleteVenue",
  async (venueId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:2025/api/venues/delete/${venueId}`,
        { headers: { Authorization: token } }
      );
      return venueId;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Unknown error");
    }
  }
);

// 🔹 Define Initial State
const initialState = {
  venues: [],
  selectedVenue: null,
  totalPages: 1,
  loading: false,
  error: null,
};

// 🔹 Create Venues Slice
const venuesSlice = createSlice({
  name: "venues",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all venues (for owner/renter)
      .addCase(fetchVenues.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVenues.fulfilled, (state, action) => {
        state.loading = false;
        state.venues = action.payload;
      })
      .addCase(fetchVenues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch venue details
      .addCase(fetchVenueById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVenueById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedVenue = action.payload;
      })
      .addCase(fetchVenueById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add a new venue
      .addCase(addVenue.pending, (state) => {
        state.loading = true;
      })
      .addCase(addVenue.fulfilled, (state, action) => {
        state.loading = false;
        state.venues.push(action.payload);
      })
      .addCase(addVenue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete venue
      .addCase(deleteVenue.fulfilled, (state, action) => {
        state.venues = state.venues.filter((venue) => venue._id !== action.payload);
        state.selectedVenue = null;
      })

      // Fetch verified venues (for booking)
      .addCase(fetchVerifiedVenues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVerifiedVenues.fulfilled, (state, action) => {
        state.loading = false;
        state.venues = action.payload.venues;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchVerifiedVenues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// 🔹 Export Reducer
export default venuesSlice.reducer;
