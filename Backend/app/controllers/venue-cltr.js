import { validationResult } from "express-validator";
import Venue from "../models/venue-model.js";
import cloudinary from 'cloudinary'
const venueCltr = {}

venueCltr.createVenue = async (req,res)=>{
    const Errors = validationResult(req)
    if(!Errors.isEmpty()){
        return res.status(400).json(Errors.array())
    }
    try {
        const {
          venueName,
          description,
          address,
          capacity,
          price,
          amenities,
          ownerContact,
        } = req.body;

        const existingVenue = await Venue.findOne({ venueName, address });

        if (existingVenue) {
            return res.status(400).json({
            message: "A venue with the same name and address already exists.",
        })
    }

        console.log('Images:', req.files.images);
        console.log('Documents:', req.files.documents);
  
        // Upload images to Cloudinary
        const imageUploadPromises = req.files.images?.map((file) =>
          cloudinary.v2.uploader.upload(file.path, { folder: "venues/images" })
        ) || [];
  
        const documentUploadPromises = req.files.documents?.map((file) =>
          cloudinary.v2.uploader.upload(file.path, { folder: "venues/documents", resource_type: "raw" })
        ) || [];
  
        // Resolve all the image and document uploads
        const imageResults = await Promise.all(imageUploadPromises);
        const documentResults = await Promise.all(documentUploadPromises);
  
        // Extract URLs of the uploaded files
        const imageUrls = imageResults.map((result) => result.secure_url);
        const documentUrls = documentResults.map((result) => result.secure_url);
  
        // Create the venue document
        const newVenue = new Venue({
          venueName,
          description,
          address,
          capacity,
          price,
          amenities,
          ownerId: req.currentUser.userId, // Assuming you have user authentication in place
          ownerContact,
          documents: documentUrls,
          images: imageUrls,
        });
  
        // Save to the database
        const savedVenue = await newVenue.save();
  
        // Return success response
        res.status(201).json({
          message: "Venue created successfully",

          venue: savedVenue,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      }
}

// Get all venues
venueCltr.getAllVenues = async (req, res) => {
  try {
    const venues = await Venue.find();
    res.status(200).json(venues);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch venues", error: error.message });
  }
};

// Get venue by ID
venueCltr.getVenueById = async (req, res) => {
  try {
    const { id } = req.params;
    const venue = await Venue.findById(id);
    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }
    res.status(200).json(venue);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch venue", error: error.message });
  }
};

// Get venues by owner
venueCltr.getVenuesByOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const venues = await Venue.find({ ownerId });
    if (!venues.length) {
      return res.status(404).json({ message: "No venues found for the owner" });
    }
    res.status(200).json(venues);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch venues", error: error.message });
  }
};

// Get verified venues
venueCltr.getVerifiedVenues = async (req, res) => {
  try {
    const verifiedVenues = await Venue.find({ verificationStatus: "approved" });
    res.status(200).json(verifiedVenues);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch verified venues", error: error.message });
  }
};

venueCltr.deleteVenue = async(req,res)=>{
  const id = req.params.id
  try{
    const venue = await Venue.findByIdAndDelete({_id:id})
    res.json({message:'venue deleted successfully',venue})

  }catch(err){
    res.status(500).json({error:'som'})
  }
}
  
venueCltr.updateVenue = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if the venue exists
    const venue = await Venue.findById(id);
    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }

    // Update the venue
    const updatedVenue = await Venue.findByIdAndUpdate(id, updateData, {
      new: true, // Returns the updated document
      runValidators: true, // Ensures the schema validations are applied
    });

    res.status(200).json({ message: "Venue updated successfully", venue: updatedVenue });
  } catch (error) {
    res.status(500).json({ message: "Failed to update venue", error: error.message });
  }
};
export default venueCltr