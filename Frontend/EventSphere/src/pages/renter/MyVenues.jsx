import { useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVenues } from "../../redux/Slice/venuesSlice";
import AuthContext from "../../context/Auth";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const MyVenues = () => {
  const { userState } = useContext(AuthContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Fetch venues from Redux store
  const { venues, status, error } = useSelector((state) => state.venues);
  // console.log(venues)

  useEffect(() => {
    if (userState?.user?._id) {
      // console.log(userState.user._id)
      dispatch(fetchVenues(userState.user._id));
    }
  }, [dispatch, userState?.user?._id]);

  if (status === "loading") return <p>Loading venues...</p>;
  if (status === "failed") return <p>Error: {error}</p>;

  return (
    <Box sx={{ p: 3, backgroundColor: "#0D0D0D", minHeight: "100vh", color: "#FBFBFB" }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", color: "#C4D9FF", mb: 2 }}>Venue Management</Typography>
      <TableContainer component={Paper} sx={{ backgroundColor: "#1C1C1C" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "#C5BAFF", fontWeight: "bold" }}>Venue Name</TableCell>
              <TableCell sx={{ color: "#C5BAFF", fontWeight: "bold" }}>Address</TableCell>
              <TableCell sx={{ color: "#C5BAFF", fontWeight: "bold" }}>Capacity</TableCell>
              <TableCell sx={{ color: "#C5BAFF", fontWeight: "bold" }}>Price</TableCell>
              <TableCell sx={{ color: "#C5BAFF", fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {venues.map((venue) => (
              <TableRow key={venue._id}>
                <TableCell sx={{ color: "#FBFBFB" }}>{venue.venueName}</TableCell>
                <TableCell sx={{ color: "#FBFBFB" }}>{venue.address}</TableCell>
                <TableCell sx={{ color: "#FBFBFB" }}>{venue.capacity}</TableCell>
                <TableCell sx={{ color: "#FBFBFB" }}>{venue.price?.dailyRate ? `₹${venue.price.dailyRate}` : "N/A"}</TableCell>
                <TableCell>
                  <Button variant="contained" sx={{ background: "linear-gradient(90deg, #C4D9FF, #C5BAFF)", color: "#000", textTransform: "none", mr: 1 }}
                    onClick={() => navigate(`/renter/venue-details/${venue._id}`)}>
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MyVenues;
