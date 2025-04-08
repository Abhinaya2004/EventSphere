import {Schema,model} from 'mongoose'

const eventSchema = new Schema(
    {
      eventName: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        required: true,
      },
      startTime: {
        type: String, // Example: "18:30" for 6:30 PM
        required: true,
      },
      endTime: {
        type: String, // Example: "21:30" for 9:30 PM
        required: true,
      },
      mode: {
        type: String,
        enum: ["Online", "Offline"], // Mode of the event
        required: true,
      },
      type: {
        type: String, // Type based on mode
        required: true,
      },
      venue: {
        type:Schema.Types.ObjectId,
        ref: "Venue", // Link to rented venue (Offline)
      },
      customAddress: {
        type: String, // Organizer's custom address (Offline)
        trim: true,
      },
      streamingLink: {
        type: String, // URL for live streaming (Online mode)
        trim: true,
      },
      organizer: {
        type:Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      ticketTypes: [
        {
          name: { type: String, required: true }, // Custom ticket type name
          price: { type: Number, required: true }, // Price for this ticket type
          availableQuantity: { type: Number, required: true }, // Number of tickets available for this type
        },
      ],
      images: {
        type: [String], // URLs of uploaded event images
        default: [],
      },
      status: {
        type: String,
        enum: ["Upcoming", "Ongoing", "Completed", "Cancelled"],
        default: "Upcoming",
      },
    },
    { timestamps: true }
  );
  
  const eventTypeSchema = new Schema({
    onlineTypes: {
      type: [String], // Online event types
      default: ["Webinar", "Virtual Workshop", "Online Conference", "Live Streaming"],
    },
    offlineTypes: {
      type: [String], // Offline event types
      default: ["Conference", "Workshop", "Seminar", "Meetup", "Concert"],
    },
  });
  
export  const EventType = model("EventType", eventTypeSchema);
export const Event = model("Event", eventSchema);
  


  