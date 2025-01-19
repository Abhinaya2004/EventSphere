import AdditionalDetails from "../models/additionalDetails-model.js";
import { validationResult } from "express-validator";
import cloudinary from "cloudinary";


const additionalDetailsCltr = {};

additionalDetailsCltr.create = async (req, res) => {
  // Validate incoming request body
  const Errors = validationResult(req);
  if (!Errors.isEmpty()) {
    return res.status(400).json(Errors.array());
  }

  const {
    userId,
    organizationName,
    panCardNumber,
    organizationAddress,
    contactDetails,
    bankDetails,
  } = req.body;

  const panCard = req.file

  console.log(req.body)
  try {
    // Check if file is uploaded
    if (!panCard) {
      return res.status(400).json({ error: "No file uploaded" });
    }

   

    // Upload file to Cloudinary
    
    const result = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: 'pan-cards',
      resource_type: 'image', // Ensures Cloudinary treats it as an image
    });

    const panCardUrl = result.secure_url;

    // Check if additional details already exist for the user
    let details = await AdditionalDetails.findOne({ panCardNumber });

    if (details) {
      return res.json({error:'This pan already exists'})
    }

    // Create new details
    const newDetails = await AdditionalDetails.create({
      userId,
      organizationName,
      panCardNumber,
      organizationAddress,
      contactDetails,
      bankDetails,
      panCard: panCardUrl ,
    });

    return res.status(201).json({
      message: "Details added successfully",
      details: newDetails,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export default additionalDetailsCltr;