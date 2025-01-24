import express from "express";
import upload from "../middlewares/Upload.js";
import additionalDetailsCltr from "../controllers/additonalDetails-cltr.js";
import authenticateUser from "../middlewares/authenticateUser.js";
import authorizeUser from "../middlewares/authorizeUser.js";

const router = express.Router();


router.post(
  "/additional-details",
  upload.single('panCard'),
  authenticateUser,
  authorizeUser(["host", "renter"]),
  additionalDetailsCltr.create
);

export default router;