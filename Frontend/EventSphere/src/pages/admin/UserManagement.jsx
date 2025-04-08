import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import axios from "axios";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:2025/api/users/all-users', {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleRoleFilterChange = (event) => {
    const role = event.target.value;
    setRoleFilter(role);

    if (role === "All") {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter((user) => user.role === role));
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: "#0D0D0D", minHeight: "100vh", color: "#FBFBFB" }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", color: "#C4D9FF", mb: 2 }}>
        User Management
      </Typography>

      <Select
        value={roleFilter}
        onChange={handleRoleFilterChange}
        sx={{ backgroundColor: "#2D2D2D", color: "#FBFBFB", mb: 2 }}
      >
        <MenuItem value="All">All Users</MenuItem>
        <MenuItem value="admin">Admins</MenuItem>
        <MenuItem value="host">Hosts</MenuItem>
        <MenuItem value="renter">Renters</MenuItem>
        <MenuItem value="user">Users</MenuItem>
      </Select>

      <TableContainer component={Paper} sx={{ backgroundColor: "#1C1C1C" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "#C5BAFF", fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ color: "#C5BAFF", fontWeight: "bold" }}>Role</TableCell>
              <TableCell sx={{ color: "#C5BAFF", fontWeight: "bold" }}>Additional Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user._id}>
                <TableCell sx={{ color: "#FBFBFB" }}>{user.email}</TableCell>
                <TableCell sx={{ color: "#FBFBFB" }}>{user.role}</TableCell>
                <TableCell>
                  {(user.role === "host" || user.role === "renter") && (
                    <Button
                      variant="contained"
                      sx={{
                        background: "linear-gradient(90deg, #C4D9FF, #C5BAFF)",
                        color: "#000",
                        textTransform: "none",
                      }}
                      onClick={() => navigate(`/admin/user-details/${user._id}`)}
                    >
                      View Details
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UserManagement;



// await axios.get('http://localhost:2025/api/admin/additional-details/:id', {
//   headers: {
//     Authorization: localStorage.getItem('token'),
//   },
// });