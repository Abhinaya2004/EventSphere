import { validationResult } from "express-validator";
import mongoose from "mongoose";
import User from "../models/user-model.js";
import Venue from "../models/venue-model.js";
import { Event } from "../models/event-model.js"
import { EventType } from "../models/event-model.js";
const eventCltr = {}
import cloudinary from 'cloudinary'


eventCltr.createEvent = async (req, res) => {
  const Errors = validationResult(req)
    if(!Errors.isEmpty()){
        return res.status(400).json({ errors: Errors.array()[0].msg })
    }
  try {
    const {
      eventName,
      description,
      date,
      startTime,
      endTime,
      mode,
      type,
      venue,
      customAddress,
      streamingLink
      
    } = req.body;
    const ticketTypes = JSON.parse(req.body.ticketTypes)

    // console.log(startTime,endTime,typeof(ticketTypes),)

    // Check if the event type is valid based on mode (Online/Offline)
    let eventType = await EventType.findOne();

    if (!eventType) {
      // If no event types exist, create and save default ones
      eventType = new EventType();
      await eventType.save();
    }
    
    // Check if mode is "Online" or "Offline" and process accordingly
    if (mode === "Online") {
      if (!eventType.onlineTypes.includes(type)) {
        eventType.onlineTypes.push(type); // Add new type to onlineTypes
        await eventType.save();
      }
    } else if (mode === "Offline") {
      if (!eventType.offlineTypes.includes(type)) {
        eventType.offlineTypes.push(type); // Add new type to offlineTypes
        await eventType.save();
      }
    } else {
      return res.status(400).json({ errors: "Invalid mode. Choose Online or Offline." });
    }
    

    const validTypes =
      mode === "Online" ? eventType.onlineTypes : eventType.offlineTypes;
    if (!validTypes.includes(type)) {
      return res.status(400).json({ errors: "Invalid event type for the selected mode." });
    }

    // console.log(typeof(ticketTypes))

    // If mode is Offline, venue or customAddress must be provided
    if (mode === "Offline" && !venue && !customAddress) {
      return res.status(400).json({ errors: "For offline events, a venue or custom address is required." });
    }

    // Ensure ticketTypes is an array with valid structure
    if (!Array.isArray(ticketTypes) || ticketTypes.length === 0) {
      return res.status(400).json({ errors: "At least one ticket type must be provided." });
    }

    // Validate each ticket type
    for (const ticket of ticketTypes) {
      if (!ticket.name || !ticket.price || !ticket.availableQuantity) {
        return res.status(400).json({ errors: "Each ticket type must have a name, price, and quantity." });
      }
    }
    // console.log(req.files.images)

    const imageUploadPromises = req.files.images?.map((file) =>
              cloudinary.v2.uploader.upload(file.path, { folder: "events/images" })
    ) || [];

    const imageResults = await Promise.all(imageUploadPromises);

    const imageUrls = imageResults.map((result) => result.secure_url);

    // Create the event
    const event = await Event.create({
      eventName,
      description,
      date,
      startTime,
      endTime,
      mode,
      type,
      venue: mode === "Offline" ? venue || null : null,
      customAddress: mode === "Offline" ? customAddress || null : null,
      streamingLink: mode === "Online" ? streamingLink || null : null, // Add streamingLink only for Online events
      organizer: req.currentUser.userId,
      ticketTypes,
      images: imageUrls,
    });
    


    res.status(201).json({ message: "Event created successfully", event });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ errors: "Failed to create event" });
  }
};


eventCltr. getEventTypesByMode = async (req, res) => {
  try {
    const { mode } = req.query; // Get mode from query parameters

    if (!mode) return res.status(400).json({ errors: "Mode is required" });

    // Fetch event type document (assuming there's only one)
    const eventTypes = await EventType.findOne();

    if (!eventTypes) return res.status(404).json({ errors: "Event types not found" });

    // Return event types based on mode
    const types = mode === "Online" ? eventTypes.onlineTypes : eventTypes.offlineTypes;

    res.json(types);
  } catch (error) {
    console.error("Error fetching event types:", error);
    res.status(500).json({ errors: "Internal server error" });
  }
};

eventCltr.addCustomEventType = async (req, res) => {
    const { mode, customType } = req.body;
  
    try {
      if (!customType || !mode) {
        return res.status(400).json({ errors: "Mode and custom event type are required" });
      }
  
      let eventType = await EventType.findOne();
      if (!eventType) {
        eventType = await EventType.create({});
      }
  
      if (mode === "Online") {
        if (eventType.onlineTypes.includes(customType)) {
          return res.status(400).json({ errors: "This event type already exists for Online events" });
        }
        eventType.onlineTypes.push(customType);
      } else if (mode === "Offline") {
        if (eventType.offlineTypes.includes(customType)) {
          return res.status(400).json({ errors: "This event type already exists for Offline events" });
        }
        eventType.offlineTypes.push(customType);
      } else {
        return res.status(400).json({ errors: "Invalid mode specified" });
      }
  
      await eventType.save();
      res.status(200).json({
        message: "Event type added successfully",
        onlineTypes: eventType.onlineTypes,
        offlineTypes: eventType.offlineTypes,
      });
    } catch (err) {
      res.status(500).json({ errors: "Failed to add custom event type" });
    }
  };
  // console.log(mongoose.modelNames());

eventCltr.getAllEvents = async (req, res) => {
    try {
      const { search = "", sort = "", eventType = "", page = 1, limit = 6 } = req.query;
  
      // Convert page and limit to numbers
      const pageNumber = parseInt(page) || 1;
      const limitNumber = parseInt(limit) || 6;
      const skip = (pageNumber - 1) * limitNumber;
  
      // 🔹 Search Filter (Matches event name or description)
      const searchQuery = search
        ? {
            $or: [
              { eventName: { $regex: search, $options: "i" } }, // Case-insensitive search
              { description: { $regex: search, $options: "i" } },
            ],
          }
        : {};
  
      // 🔹 Event Type Filter
      const eventTypeFilter = eventType ? { type: eventType } : {};
  
      // 🔹 Sorting Options
      let sortOption = {};
      if (sort === "dateAsc") sortOption.date = 1; // Sort by date (earliest first)
      else if (sort === "dateDesc") sortOption.date = -1; // Sort by date (latest first)
      else if (sort === "priceLow") sortOption["ticketTypes.price"] = 1; // Sort by lowest ticket price
      else if (sort === "priceHigh") sortOption["ticketTypes.price"] = -1; // Sort by highest ticket price
  
      // 🔹 Query with Filters
      const query = { ...searchQuery, ...eventTypeFilter };
  
      // 🔹 Get Total Count (for pagination)
      const totalEvents = await Event.countDocuments(query);
  
      // 🔹 Fetch Events with Pagination, Sorting, and Filters
      const events = await Event.find(query)
        .populate({
          path: "organizer",
          model: "User",
          select: "email role",
        })
        .populate("venue", "venueName address")
        .sort(sortOption)
        .skip(skip)
        .limit(limitNumber);
  
      res.status(200).json({
        events,
        totalPages: Math.ceil(totalEvents / limitNumber),
        currentPage: pageNumber,
      });
  
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ errors: "Failed to retrieve events" });
    }
};
  

eventCltr.getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id)
      .populate("organizer", "email")
      .populate("venue", "venueName address capacity");

    if (!event) {
      return res.status(404).json({ errors: "Event not found" });
    }

    res.status(200).json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ errors: "Failed to retrieve event" });
  }
};

eventCltr.getEventsByHost = async (req, res) => {
  try {
    const  hostId  = req.params.id;
    // console.log(hostId)
    
    const events = await Event.find({ organizer:hostId })
    .populate("organizer", "email")
    .populate("venue", "venueName address capacity");
  
    if (!events.length) {
      return res.status(404).json({ errors: "No events found for the organiser" });
    }
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ errors: "Failed to fetch events" });
  }
};

eventCltr.deleteEvent= async(req,res)=>{
  const id = req.params.id
  try{
    const event = await Event.findByIdAndDelete({_id:id})
    res.json({message:'event deleted successfully',event})

  }catch(err){
    res.status(500).json({ errors: "Failed to delete event" });
  }
}

export default eventCltr