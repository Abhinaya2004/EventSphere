import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 🔹 Fetch events for the logged-in user
export const fetchEvents = createAsyncThunk("events/fetchEvents", async (userId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`http://localhost:2025/api/events/organiser/${userId}`, {
      headers: { Authorization: localStorage.getItem("token") },
    });
    return response.data; // Return fetched events
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch events");
  }
});


export const fetchAllEvents = createAsyncThunk(
  "events/fetchAllEvents",
  async ({ search = "", sort = "", eventType = "", page = 1, limit = 6 }, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:2025/api/events", {
        params: { search, sort, eventType, page, limit },
        headers: { Authorization: localStorage.getItem("token") },
      });

      return response.data; // { events: [], totalPages: X }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch events");
    }
  }
);


// 🔹 Add a new event
export const addEvent = createAsyncThunk(
  "events/addEvent",
  async (eventData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      // console.log(token)
      if (!token) return rejectWithValue("No authentication token found.");

      const formData = new FormData();
      Object.keys(eventData).forEach((key) => {
        if (Array.isArray(eventData[key])) {
          eventData[key].forEach((file) => formData.append(key, file));
        } else {
          formData.append(key, eventData[key]);
        }
      });
      

      const response = await axios.post(
        "http://localhost:2025/api/events/create",
        formData,
        {
          headers: {
            Authorization: token, // Ensure Bearer prefix
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // console.log(response.data)

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Unknown error");
    }
  }
);


// 🔹 Fetch event by ID
export const fetchEventById = createAsyncThunk("events/fetchEventById", async (eventId, { rejectWithValue }) => {
  try {
    console.log(eventId)
    const response = await axios.get(`http://localhost:2025/api/events/${eventId}`, {
      headers: { Authorization: localStorage.getItem("token") },
    });
    console.log(response)
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to fetch event details");
  }
});

// 🔹 Initial State
const initialState = {
  events: [], // Store multiple events
  selectedEvent: null, // Store selected event details
  eventData: {
    eventName: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    mode: "",
    type: "",
    venue: "",
    customAddress: "",
    ticketTypes: [],
    images: [],
    streamingLink: "", // ✅ Added for online events
  },
  loading: false,
  success: false,
  error: null,
};

// 🔹 Event Slice
const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    setEventData: (state, action) => {
      state.eventData = { ...state.eventData, ...action.payload };
    },
    resetEventState: (state) => {
      state.eventData = initialState.eventData; // Reset form data
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Events
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Event by ID
      .addCase(fetchEventById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEvent = action.payload;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Event
      .addCase(addEvent.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(addEvent.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(addEvent.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      })

      .addCase(fetchAllEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload.events;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchAllEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// 🔹 Export Actions & Reducer
export const { setEventData, resetEventState } = eventSlice.actions;
export default eventSlice.reducer;
