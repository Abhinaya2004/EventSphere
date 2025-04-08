import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch,useSelector} from "react-redux";
import {
  Container,
  Grid,
  TextField,
  Select,
  MenuItem,
  Pagination,
  Typography,
  Box,
  InputLabel,
  FormControl,
} from "@mui/material";
import VenueCard from "../../components/VenueCard";
import { fetchVerifiedVenues } from "../../redux/Slice/venuesSlice";

const BookVenue = () => {
    const dispatch = useDispatch();
    const { venues, totalPages, loading, error } = useSelector((state) => state.venues);
  
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("");
    const [page, setPage] = useState(1);
    const venuesPerPage = 6;
  
    useEffect(() => {
      dispatch(fetchVerifiedVenues({ search, sort, page, limit: venuesPerPage }));
    }, [dispatch, search, sort, page]);

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
          sx={{ fontWeight: "bold", color: "#C4D9FF", mb: 2,textAlign: "center" }}
        >
          Book a Venue
        </Typography>

        {/* Search & Sort Controls */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Search Venues"
              variant="outlined"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ input: { color: "#FBFBFB" }, label: { color: "#FBFBFB" } }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
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
        </Grid>

        {loading && <Typography sx={{ color: "#FBFBFB" }}>Loading venues...</Typography>}
        {error && <Typography sx={{ color: "#FF6961" }}>Error: {error}</Typography>}

        {/* Venue Cards - 6 Venues Per Page */}
        <Grid container spacing={3}>
          {venues.map((venue) => (
            <Grid item xs={12} sm={6} md={4} key={venue._id}>
              <VenueCard venue={venue} />
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

export default BookVenue;
