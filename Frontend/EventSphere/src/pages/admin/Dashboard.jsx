import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Chip,
} from "@mui/material";
import axios from "axios";
import {
  PeopleAlt,
  Event,
  LocationOn,
  AttachMoney,
  TrendingUp,
} from "@mui/icons-material";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to view dashboard");
        return;
      }

      const response = await axios.get(
        "http://localhost:2025/api/admin/dashboard/stats",
        {
          headers: { Authorization: token },
        }
      );
      console.log(response.data)

      setDashboardData(response.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError(error.response?.data?.error || "Failed to fetch dashboard data");
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

  const { stats, recentEvents, recentVenues, recentUsers } = dashboardData;

  return (
    <Box sx={{ p: 3, backgroundColor: "#0D0D0D", minHeight: "100vh", color: "#FBFBFB" }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", color: "#C4D9FF", mb: 3 }}>
        Admin Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: "#1C1C1C" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <PeopleAlt sx={{ color: "#C4D9FF", mr: 1 }} />
                <Typography variant="h6" sx={{ color: "#C4D9FF" }}>
                  Total Users
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: "#FBFBFB" }}>
                {stats.totalUsers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: "#1C1C1C" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Event sx={{ color: "#C4D9FF", mr: 1 }} />
                <Typography variant="h6" sx={{ color: "#C4D9FF" }}>
                  Total Events
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: "#FBFBFB" }}>
                {stats.totalEvents}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: "#1C1C1C" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <LocationOn sx={{ color: "#C4D9FF", mr: 1 }} />
                <Typography variant="h6" sx={{ color: "#C4D9FF" }}>
                  Total Venues
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: "#FBFBFB" }}>
                {stats.totalVenues}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: "#1C1C1C" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <AttachMoney sx={{ color: "#C4D9FF", mr: 1 }} />
                <Typography variant="h6" sx={{ color: "#C4D9FF" }}>
                  Total Revenue
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: "#FBFBFB" }}>
                ₹{stats.totalRevenue.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activity Tables */}
      <Grid container spacing={3}>
        {/* Recent Events */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ color: "#C4D9FF", mb: 2 }}>
            Recent Events
          </Typography>
          <TableContainer component={Paper} sx={{ backgroundColor: "#1C1C1C" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: "#C4D9FF" }}>Event Name</TableCell>
                  <TableCell sx={{ color: "#C4D9FF" }}>Date</TableCell>
                  <TableCell sx={{ color: "#C4D9FF" }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentEvents.map((event) => (
                  <TableRow key={event._id}>
                    <TableCell sx={{ color: "#FBFBFB" }}>{event.eventName}</TableCell>
                    <TableCell sx={{ color: "#FBFBFB" }}>
                      {new Date(event.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={event.status}
                        color={event.status === "Approved" ? "success" : "warning"}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* Recent Venues */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ color: "#C4D9FF", mb: 2 }}>
            Recent Venues
          </Typography>
          <TableContainer component={Paper} sx={{ backgroundColor: "#1C1C1C" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: "#C4D9FF" }}>Venue Name</TableCell>
                  <TableCell sx={{ color: "#C4D9FF" }}>Status</TableCell>
                  <TableCell sx={{ color: "#C4D9FF" }}>Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentVenues.map((venue) => (
                  <TableRow key={venue._id}>
                    <TableCell sx={{ color: "#FBFBFB" }}>{venue.venueName}</TableCell>
                    <TableCell>
                      <Chip
                        label={venue.verificationStatus}
                        color={venue.verificationStatus === "approved" ? "success" : "warning"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell sx={{ color: "#FBFBFB" }}>
                      ₹{venue.price?.dailyRate || "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* Recent Users */}
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ color: "#C4D9FF", mb: 2 }}>
            Recent Users
          </Typography>
          <TableContainer component={Paper} sx={{ backgroundColor: "#1C1C1C" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: "#C4D9FF" }}>Email</TableCell>
                  <TableCell sx={{ color: "#C4D9FF" }}>Role</TableCell>
                  <TableCell sx={{ color: "#C4D9FF" }}>Joined Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell sx={{ color: "#FBFBFB" }}>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        color={user.role === "host" ? "primary" : "secondary"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell sx={{ color: "#FBFBFB" }}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
