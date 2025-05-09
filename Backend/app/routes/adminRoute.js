import express from "express";
import adminCltr from "../controllers/admin-cltr.js";

import authenticateUser from "../middlewares/authenticateUser.js";
import authorizeUser from "../middlewares/authorizeUser.js";

const router = express.Router();

// Dashboard stats route
router.get('/dashboard/stats', authenticateUser, authorizeUser(['admin']),adminCltr.getDashboardStats);

// Additional details routes
router.get('/user/:id/additional-details', authenticateUser, authorizeUser(['admin']), adminCltr.additionalDetails);
router.put("/venues/:id/approve", authenticateUser, authorizeUser(['admin']), adminCltr.approveVenue);
router.get("/additional-details/:id", authenticateUser, authorizeUser(['admin']), adminCltr.additionalDetails);

export default router;