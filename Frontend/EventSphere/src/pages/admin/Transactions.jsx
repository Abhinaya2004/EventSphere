import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import axios from "axios";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalTransactions: 0,
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to view transactions");
        return;
      }

      const response = await axios.get(
        "http://localhost:2025/api/payment/admin/successful-payments",
        {
          headers: { Authorization: token },
        }
      );
      console.log(response.data)

      setTransactions(response.data.payments);
      setStats({
        totalRevenue: response.data.totalRevenue,
        totalTransactions: response.data.totalTransactions,
      });
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError(error.response?.data?.error || "Failed to fetch transaction data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#0D0D0D",
        }}
      >
        <CircularProgress sx={{ color: "#C4D9FF" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          p: 3,
          backgroundColor: "#0D0D0D",
          minHeight: "100vh",
          color: "#FBFBFB",
        }}
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: "#0D0D0D", minHeight: "100vh", color: "#FBFBFB" }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", color: "#C4D9FF", mb: 3 }}>
        Transaction Management
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ backgroundColor: "#1C1C1C" }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: "#C4D9FF" }}>
                Total Revenue
              </Typography>
              <Typography variant="h4" sx={{ color: "#FBFBFB" }}>
                ₹{stats.totalRevenue.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ backgroundColor: "#1C1C1C" }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: "#C4D9FF" }}>
                Total Transactions
              </Typography>
              <Typography variant="h4" sx={{ color: "#FBFBFB" }}>
                {stats.totalTransactions}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Transactions Table */}
      <TableContainer component={Paper} sx={{ backgroundColor: "#1C1C1C" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "#C4D9FF", fontWeight: "bold" }}>Transaction ID</TableCell>
              <TableCell sx={{ color: "#C4D9FF", fontWeight: "bold" }}>Type</TableCell>
              <TableCell sx={{ color: "#C4D9FF", fontWeight: "bold" }}>Date</TableCell>
              <TableCell sx={{ color: "#C4D9FF", fontWeight: "bold" }}>Payer</TableCell>
              <TableCell sx={{ color: "#C4D9FF", fontWeight: "bold" }}>Receiver</TableCell>
              <TableCell sx={{ color: "#C4D9FF", fontWeight: "bold" }}>Item</TableCell>
              <TableCell sx={{ color: "#C4D9FF", fontWeight: "bold" }}>Amount</TableCell>
              <TableCell sx={{ color: "#C4D9FF", fontWeight: "bold" }}>Platform Fee</TableCell>
              <TableCell sx={{ color: "#C4D9FF", fontWeight: "bold" }}>Final Amount</TableCell>
              <TableCell sx={{ color: "#C4D9FF", fontWeight: "bold" }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction._id}>
                <TableCell sx={{ color: "#FBFBFB" }}>{transaction._id}</TableCell>
                <TableCell sx={{ color: "#FBFBFB" }}>
                  <Chip
                    label={transaction.type}
                    color={transaction.type === "Venue" ? "primary" : "secondary"}
                    size="small"
                  />
                </TableCell>
                <TableCell sx={{ color: "#FBFBFB" }}>
                  {new Date(transaction.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell sx={{ color: "#FBFBFB" }}>{transaction.payerEmail}</TableCell>
                <TableCell sx={{ color: "#FBFBFB" }}>{transaction.receiverEmail}</TableCell>
                <TableCell sx={{ color: "#FBFBFB" }}>
                  <Box>
                    <Typography>{transaction.itemName}</Typography>
                    {transaction.type === "Venue" ? (
                      <Typography variant="caption" sx={{ color: "#C4D9FF" }}>
                        {new Date(transaction.itemDetails.checkInDate).toLocaleDateString()} -{" "}
                        {new Date(transaction.itemDetails.checkOutDate).toLocaleDateString()}
                      </Typography>
                    ) : (
                      <Typography variant="caption" sx={{ color: "#C4D9FF" }}>
                        {transaction.itemDetails.ticketType} x {transaction.itemDetails.ticketQuantity}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell sx={{ color: "#FBFBFB" }}>₹{transaction.amount}</TableCell>
                <TableCell sx={{ color: "#FBFBFB" }}>₹{transaction.platformFee}</TableCell>
                <TableCell sx={{ color: "#FBFBFB" }}>₹{transaction.finalAmount}</TableCell>
                <TableCell>
                  <Chip
                    label={transaction.status}
                    color={transaction.status === "Success" ? "success" : "error"}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Transactions;