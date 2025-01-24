import express from 'express'
import { venueValidationSchema } from '../validations/venue-validations.js'
import venueCltr from '../controllers/venue-cltr.js'
import upload from '../middlewares/Upload.js'
import { checkSchema } from 'express-validator'
import authenticateUser from "../middlewares/authenticateUser.js";
import authorizeUser from "../middlewares/authorizeUser.js";

const router = express.Router()

router.post('/create',upload.fields([
        { name: "images", maxCount: 5 }, // Max 5 images
        { name: "documents", maxCount: 3 }, // Max 3 documents
      ]),
checkSchema(venueValidationSchema),
authenticateUser,
authorizeUser(["renter","admin"]),venueCltr.createVenue);


router.get("/", venueCltr.getAllVenues);

// router.get("/:id", venueCltr.getVenueById);

router.get("/owner/:ownerId",authenticateUser,
authorizeUser(["renter","admin"]), venueCltr.getVenuesByOwner);

router.get("/verified",authenticateUser,
  authorizeUser(["host","admin"]),venueCltr.getVerifiedVenues);

router.delete("/delete/:id",authenticateUser,
authorizeUser(["renter","admin"]),venueCltr.deleteVenue)

router.put("/update/:id",authenticateUser,
authorizeUser(["renter","admin"]),venueCltr.updateVenue)



// router.post("/create",upload.fields([
//     { name: "images", maxCount: 5 }, // Max 5 images
//     { name: "documents", maxCount: 3 }, // Max 3 documents
//   ]), (req, res) => {
//     try {
//       // Access the uploaded files from req.files
//       console.log('Uploaded Images:', req.files.images);
//       console.log('Uploaded documents:',req.files.documents)  // Array of uploaded images
  
//       // Your logic here (e.g., save to database or upload to Cloudinary)
  
//       res.status(200).json({ message: 'Files uploaded successfully', files: req.files });
//     } catch (error) {
//       res.status(400).json({ error: error.message });
//     }
// })

export default router;


