import { validationResult } from "express-validator";
import Venue from "../models/venue-model.js";
import cloudinary from 'cloudinary'
const venueCltr = {}
import mongoose, { Mongoose } from "mongoose";

venueCltr.createVenue = async (req,res)=>{
    const Errors = validationResult(req)
    if(!Errors.isEmpty()){
        return res.status(400).json({ errors: Errors.array()[0].msg })
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
            return res.status(400).json({ errors: "A venue with the same name and address already exists." })
        }

        // console.log(req.body)
        // console.log('Images:', req.files.images);
        // console.log('Documents:', req.files.documents);
        const parsedOwnerContact = JSON.parse(ownerContact);
  
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

        const DailyRate = parseInt(JSON.parse(price).dailyRate)
        const HourlyRate = parseInt(JSON.parse(price).hourlyRate)

        // console.log(DailyRate,HourlyRate)
        
  
        // Create the venue document
        const newVenue = new Venue({
          venueName,
          description,
          address,
          capacity,
          price:{
            ...price,dailyRate:DailyRate,hourlyRate:HourlyRate
          },
          amenities,
          ownerId: req.currentUser.userId, // Assuming you have user authentication in place
          ownerContact:parsedOwnerContact,
          documents: documentUrls,
          images: imageUrls,
        });

        // console.log(newVenue)
  
        // Save to the database
        const savedVenue = await newVenue.save();
  
        // Return success response
        res.status(201).json({
          message: "Venue created successfully",
          venue: savedVenue,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json([{ errors: "Internal server error" }]);
      }
}

// Get all venues
venueCltr.getAllVenues = async (req, res) => {
  try {
    const venues = await Venue.find();
    res.status(200).json(venues);
  } catch (error) {
    res.status(500).json({ errors: "Failed to fetch venues" });
  }
};

// Get venue by ID
venueCltr.getVenueById = async (req, res) => {
  try {
    const { id } = req.params;
    const venue = await Venue.findById(id);
    if (!venue) {
      return res.status(404).json({ errors: "Venue not found" });
    }
    res.status(200).json(venue);
  } catch (error) {
    res.status(500).json({ errors: "Failed to fetch venue" });
  }
};

// Get venues by owner
venueCltr.getVenuesByOwner = async (req, res) => {
  try {
    const  ownerId  = req.params.id;
    // console.log(ownerId)
    const venues = await Venue.find({ ownerId });
    // console.log(venues)
    if (!venues.length) {
      return res.status(404).json({ errors: "No venues found for the owner" });
    }
    res.status(200).json(venues);
  } catch (error) {
    res.status(500).json({ errors: "Failed to fetch venues" });
  }
};

// Get verified venues
venueCltr.getVerifiedVenues = async (req, res) => {
  try {
    const { search = "", sort = "default", page = 1, limit = 6 } = req.query;
    const query = { verificationStatus: "approved" };

    // 🔹 Search by Venue Name or Address
    if (search) {
      query.$or = [
        { venueName: { $regex: search, $options: "i" } }, // Case-insensitive search
        { address: { $regex: search, $options: "i" } },
      ];
    }

    // 🔹 Sorting Logic
    let sortOption = {};
    if (sort === "priceLow") sortOption["price.dailyRate"] = 1; // Ascending
else if (sort === "priceHigh") sortOption["price.dailyRate"] = -1; // Descending

    // 🔹 Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // 🔹 Fetch venues with filters
    const verifiedVenues = await Venue.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    // 🔹 Count total matching venues for pagination
    const totalVenues = await Venue.countDocuments(query);

    res.status(200).json({
      venues: verifiedVenues,
      totalPages: Math.ceil(totalVenues / parseInt(limit)),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ errors: "Failed to fetch verified venues" });
  }
};


venueCltr.deleteVenue = async(req,res)=>{
  const id = req.params.id
  try{
    const venue = await Venue.findByIdAndDelete({_id:id})
    res.json({message:'venue deleted successfully',venue})

  }catch(err){
    res.status(500).json({ errors: "Failed to delete venue" });
  }
}
  
venueCltr.updateVenue = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if the venue exists
    const venue = await Venue.findById(id);
    if (!venue) {
      return res.status(404).json({ errors: "Venue not found" });
    }

    // Update the venue
    const updatedVenue = await Venue.findByIdAndUpdate(id, updateData, {
      new: true, // Returns the updated document
      runValidators: true, // Ensures the schema validations are applied
    });

    res.status(200).json({ message: "Venue updated successfully", venue: updatedVenue });
  } catch (error) {
    res.status(500).json({ errors: "Failed to update venue" });
  }
};
export default venueCltr