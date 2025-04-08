import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Grid, TextField, Select, MenuItem, Pagination, Typography, Box, InputLabel, FormControl } from "@mui/material";
import EventCard from "../../components/EventCard"; // ✅ New EventCard component
import { fetchAllEvents } from "../../redux/Slice/eventSlice"; // ✅ Fetch events from Redux

const BookEvent = () => {
  const dispatch = useDispatch();
  const { events, totalPages, loading, error } = useSelector((state) => state.events);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [eventType, setEventType] = useState(""); // ✅ Filter for event type
  const [page, setPage] = useState(1);
  const eventsPerPage = 6;

  useEffect(() => {
    dispatch(fetchAllEvents({ search, sort, eventType, page, limit: eventsPerPage }));
  }, [dispatch, search, sort, eventType, page]);

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
        maxWidth="lg"
        sx={{
          backgroundColor: "#1E1E1E",
          p: 4,
          borderRadius: 2,
          boxShadow: "0 0 10px rgba(255,255,255,0.1)",
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", color: "#C4D9FF", mb: 2, textAlign: "center" }}
        >
          Book an Event
        </Typography>

        {/* Search & Filters */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Search Events"
              variant="outlined"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ input: { color: "#FBFBFB" }, label: { color: "#FBFBFB" } }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: "#FBFBFB" }}>Sort By</InputLabel>
              <Select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                sx={{ color: "#FBFBFB", ".MuiOutlinedInput-notchedOutline": { borderColor: "#FBFBFB" } }}
              >
                <MenuItem value="">Default</MenuItem>
                <MenuItem value="priceLow">Price: Low to High</MenuItem>
                <MenuItem value="priceHigh">Price: High to Low</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: "#FBFBFB" }}>Event Type</InputLabel>
              <Select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                sx={{ color: "#FBFBFB", ".MuiOutlinedInput-notchedOutline": { borderColor: "#FBFBFB" } }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Concert">Concert</MenuItem>
                <MenuItem value="Theatre">Theatre</MenuItem>
                <MenuItem value="Sports">Sports</MenuItem>
                <MenuItem value="Workshop">Workshop</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {loading && <Typography sx={{ color: "#FBFBFB" }}>Loading events...</Typography>}
        {error && <Typography sx={{ color: "#FF6961" }}>Error: {error}</Typography>}

        {/* Event Cards - 6 Events Per Page */}
        <Grid container spacing={3}>
          {events.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event._id}>
              <EventCard event={event} /> {/* ✅ Event Card Component */}
            </Grid>
          ))}
        </Grid>

        {/* Pagination */}
        <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            sx={{
              "& .MuiPaginationItem-root": { color: "#FBFBFB" },
              "& .Mui-selected": { backgroundColor: "#9BB8FF", color: "#121212" },
            }}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default BookEvent;
