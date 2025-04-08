import AdditionalDetails from "../models/additionalDetails-model.js";
import { validationResult } from "express-validator";
import cloudinary from "cloudinary";


const additionalDetailsCltr = {};

additionalDetailsCltr.create = async (req, res) => {
  // Validate incoming request body
  const Errors = validationResult(req);
  if (!Errors.isEmpty()) {
    return res.status(400).json({ errors: Errors.array()[0].msg });
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

  // console.log(req.body)
  try {
    // Check if file is uploaded
    if (!panCard) {
      return res.status(400).json({ errors: "No file uploaded" });
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
      userId:req.currentUser.userId,
      organizationName,
      panCardNumber,
      organizationAddress,
      contactDetails,
      bankDetails,
      panCard: panCardUrl ,
    });

    return res.status(201).json(newDetails);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ errors: "Something went wrong"});
  }
};

additionalDetailsCltr.profile = async(req,res)=>{
  const id = req.params.id
  // console.log(id)
  try{
    const profile =await AdditionalDetails.findOne({userId:id})
    if(!profile){
      return res.json({error:'This profile does not exists'})
    }

    return res.json(profile)
  }catch(err){
    console.error(err);
    return res.status(500).json({ errors: "Something went wrong" });
  }
}

additionalDetailsCltr.updateProfile = async (req, res) => {
  const id = req.params.id; // Extract user ID from params
  // console.log("Updating profile for ID:", id);

  try {
    // Check if profile exists
    let profile = await AdditionalDetails.findOne({ userId: id });
    if (!profile) {
      return res.status(404).json({ errors: "Profile not found" });
    }

    // Update profile details
    profile = await AdditionalDetails.findOneAndUpdate(
      { userId: id },  // Find profile by userId
      { $set: req.body }, // Update fields with request body
      { new: true, runValidators: true } // Return updated profile & run validators
    );

    return res.status(200).json({ message: "Profile updated successfully", profile });
  } catch (err) {
    console.error("Error updating profile:", err);
    return res.status(500).json({ errors: "Something went wrong"});
  }
};

additionalDetailsCltr.getAdditionalDetails = async (req, res) => {
  try {
    const additionalDetails = await AdditionalDetails.findOne({ user: req.currentUser.userId });
    if (!additionalDetails) {
      return res.status(404).json({ errors: "Additional details not found" });
    }
    res.json(additionalDetails);
  } catch (error) {
    res.status(500).json({ errors: "Failed to retrieve additional details" });
  }
};

additionalDetailsCltr.updateAdditionalDetails = async (req, res) => {
  try {
    const additionalDetails = await AdditionalDetails.findOne({ user: req.currentUser.userId });
    if (!additionalDetails) {
      return res.status(404).json({ errors: "Additional details not found" });
    }

    Object.assign(additionalDetails, req.body);
    await additionalDetails.save();

    res.json(additionalDetails);
  } catch (error) {
    res.status(500).json({ errors: "Failed to update additional details"});
  }
};

export default additionalDetailsCltr;