import express from "express";
import adminCltr from "../controllers/admin-cltr.js";

import authenticateUser from "../middlewares/authenticateUser.js";
import authorizeUser from "../middlewares/authorizeUser.js";

const router = express.Router();

router.put("/venues/:id/approve",authenticateUser,authorizeUser(['admin']), adminCltr.approveVenue);

export default router;