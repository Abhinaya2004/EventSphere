import express from "express";
import singleUpload from "../middlewares/singleUpload.js";
import additionalDetailsCltr from "../controllers/additonalDetails-cltr.js";
import authenticateUser from "../middlewares/authenticateUser.js";
import authorizeUser from "../middlewares/authorizeUser.js";

const router = express.Router();

// Enable file upload middleware


// Route for creating or updating additional details
router.post(
  "/additional-details",
  singleUpload.single('panCard'),
  authenticateUser,
  authorizeUser(["host", "renter"]),
  additionalDetailsCltr.create
);

export default router;