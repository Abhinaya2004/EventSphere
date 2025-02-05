import Event from "../models/event-model.js"
import { EventType } from "../models/event-model.js";
const eventCltr = {}


eventCltr.createEvent = async (req, res) => {
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
      ticketTypes,
      images,
      organizer,
    } = req.body;

    // Check if the event type is valid based on mode (Online/Offline)
    const eventType = await EventType.findOne();
    if (!eventType) {
      return res
        .status(400)
        .json({ error: "No event types found. Please add event types first." });
    }

    const validTypes =
      mode === "Online" ? eventType.onlineTypes : eventType.offlineTypes;
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        error: "Invalid event type for the selected mode.",
      });
    }

    // If mode is Offline, venue or customAddress must be provided
    if (mode === "Offline" && !venue && !customAddress) {
      return res.status(400).json({
        error: "For offline events, a venue or custom address is required.",
      });
    }

    // Ensure ticketTypes is an array with valid structure
    if (!Array.isArray(ticketTypes) || ticketTypes.length === 0) {
      return res.status(400).json({
        error: "At least one ticket type must be provided.",
      });
    }

    // Validate each ticket type
    for (const ticket of ticketTypes) {
      if (!ticket.name || !ticket.price || !ticket.availableQuantity) {
        return res.status(400).json({
          error: "Each ticket type must have a name, price, and quantity.",
        });
      }
    }

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
      organizer: req.currentUser.userId,
      ticketTypes,
      images: imageUrls,
    });

    res.status(201).json({ message: "Event created successfully", event });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Failed to create event" });
  }
};


eventCltr.getEventTypesByMode = async (req, res) => {
    const { mode } = req.query; // "Online" or "Offline"
  
    try {
      const eventType = await EventType.findOne();
      if (!eventType) {
        const newEventType = await EventType.create({});
        return res.status(200).json(
          mode === "Online" ? newEventType.onlineTypes : newEventType.offlineTypes
        );
      }
  
      if (mode === "Online") {
        res.status(200).json(eventType.onlineTypes);
      } else if (mode === "Offline") {
        res.status(200).json(eventType.offlineTypes);
      } else {
        res.status(400).json({ error: "Invalid mode specified" });
      }
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch event types" });
    }
  };

eventCltr.addCustomEventType = async (req, res) => {
    const { mode, customType } = req.body;
  
    try {
      if (!customType || !mode) {
        return res.status(400).json({ error: "Mode and custom event type are required" });
      }
  
      let eventType = await EventType.findOne();
      if (!eventType) {
        eventType = await EventType.create({});
      }
  
      if (mode === "Online") {
        if (eventType.onlineTypes.includes(customType)) {
          return res.status(400).json({ error: "This event type already exists for Online events" });
        }
        eventType.onlineTypes.push(customType);
      } else if (mode === "Offline") {
        if (eventType.offlineTypes.includes(customType)) {
          return res.status(400).json({ error: "This event type already exists for Offline events" });
        }
        eventType.offlineTypes.push(customType);
      } else {
        return res.status(400).json({ error: "Invalid mode specified" });
      }
  
      await eventType.save();
      res.status(200).json({
        message: "Event type added successfully",
        onlineTypes: eventType.onlineTypes,
        offlineTypes: eventType.offlineTypes,
      });
    } catch (err) {
      res.status(500).json({ error: "Failed to add custom event type" });
    }
  };


eventCltr.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("organizer", "name email").populate("venue", "venueName address");
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Failed to retrieve events" });
  }
};

eventCltr.getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id)
      .populate("organizer", "name email")
      .populate("venue", "venueName address");

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ error: "Failed to retrieve event" });
  }
};


export default eventCltr