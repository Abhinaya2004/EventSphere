import { useEffect, useState } from "react";
import { useContext } from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Button,
} from "@mui/material";
import axios from "axios";
import AuthContext from "../context/Auth";

const Payment = ({ type = "venue" }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userState } = useContext(AuthContext);
  const user = userState?.user;

  useEffect(() => {
    if (user) {
      fetchPayments();
    }
  }, [user, type]);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to view payments");
        return;
      }

      const endpoint = type === "venue" 
        ? "http://localhost:2025/api/payment/venue"
        : "http://localhost:2025/api/payment/event";
      
      const response = await axios.get(endpoint, {
        headers: { Authorization: token } 
      });
      setPayments(response.data);
    } catch (error) {
      console.error("Error fetching payments:", error);
      setError(error.response?.data?.error || "Failed to fetch payment data");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalRevenue = () => {
    return payments
      .filter(payment => payment.status === "Success")
      .reduce((total, payment) => total + payment.finalAmount, 0);
  };

  const calculateSuccessRate = () => {
    if (payments.length === 0) return 0;
    return ((payments.filter(p => p.status === "Success").length / payments.length) * 100).toFixed(1);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress sx={{ color: "#C4D9FF" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography sx={{ color: "#FF6961", textAlign: "center", mt: 4 }}>{error}</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4, backgroundColor: "#0D0D0D", minHeight: "100vh", color: "#FBFBFB" }}>
      <Typography variant="h4" sx={{ color: "#C4D9FF", mb: 4, textAlign: "center" }}>
        {type === "venue" ? "Venue Payments" : "Event Payments"}
      </Typography>

      {/* Revenue Summary */}
      <Paper sx={{ p: 3, mb: 4, backgroundColor: "#1C1C1C" }}>
        <Typography variant="h6" sx={{ color: "#C4D9FF", mb: 2 }}>
          Revenue Summary
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Typography sx={{ color: "#FBFBFB" }}>Total Revenue: ₹{calculateTotalRevenue()}</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography sx={{ color: "#FBFBFB" }}>Total Payments: {payments.length}</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography sx={{ color: "#FBFBFB" }}>
              Success Rate: {calculateSuccessRate()}%
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Payments Table */}
      {payments.length > 0 ? (
        <TableContainer component={Paper} sx={{ backgroundColor: "#1C1C1C" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "#C4D9FF" }}>Payment ID</TableCell>
                <TableCell sx={{ color: "#C4D9FF" }}>Date</TableCell>
                <TableCell sx={{ color: "#C4D9FF" }}>
                  {type === "venue" ? "Venue" : "Event"}
                </TableCell>
                <TableCell sx={{ color: "#C4D9FF" }}>Amount</TableCell>
                <TableCell sx={{ color: "#C4D9FF" }}>Platform Fee</TableCell>
                <TableCell sx={{ color: "#C4D9FF" }}>Final Amount</TableCell>
                <TableCell sx={{ color: "#C4D9FF" }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment._id}>
                  <TableCell sx={{ color: "#FBFBFB" }}>{payment._id}</TableCell>
                  <TableCell sx={{ color: "#FBFBFB" }}>{new Date(payment.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell sx={{ color: "#FBFBFB" }}>
                    {type === "venue" ? payment.venueName : payment.eventName}
                  </TableCell>
                  <TableCell sx={{ color: "#FBFBFB" }}>₹{payment.amount}</TableCell>
                  <TableCell sx={{ color: "#FBFBFB" }}>₹{payment.platformFee}</TableCell>
                  <TableCell sx={{ color: "#FBFBFB" }}>₹{payment.finalAmount}</TableCell>
                  <TableCell>
                    <Chip
                      label={payment.status}
                      color={payment.status === "Success" ? "success" : "error"}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper sx={{ p: 3, backgroundColor: "#1C1C1C", textAlign: "center" }}>
          <Typography sx={{ color: "#FBFBFB" }}>No payments found</Typography>
        </Paper>
      )}
    </Container>
  );
};

export default Payment;