import Venue from "../models/venue-model.js";
import AdditionalDetails from '../models/additionalDetails-model.js'
import { Event } from "../models/event-model.js";
import User from "../models/user-model.js";
import EventPayment from "../models/eventPayment-model.js";
import VenuePayment from "../models/venuePayment-model.js";

const adminCltr = {}

adminCltr.approveVenue = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminRemarks } = req.body;

    // Check if user is admin
    if (req.currentUser.role !== "admin") {
      return res.status(403).json({ 
        errors: "Access denied. Admin only."
      });
    }

    const venue = await Venue.findById(id);
    if (!venue) {
      return res.status(404).json({ 
        errors: "Venue not found"
      });
    }

    venue.verificationStatus = "approved";
    venue.adminRemarks = adminRemarks;
    await venue.save();

    res.json({ message: "Venue approved successfully" });
  } catch (error) {
    console.error("Error approving venue:", error);
    res.status(500).json({ 
      errors: "Failed to approve venue"
    });
  }
};

adminCltr.additionalDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user is admin
    if (req.currentUser.role !== "admin") {
      return res.status(403).json({ 
        errors: "Access denied. Admin only."
      });
    }

    const additionalDetails = await AdditionalDetails.findOne({ userId: id });
    if (!additionalDetails) {
      return res.status(404).json({ 
        errors: "Additional details not found"
      });
    }

    res.json(additionalDetails);
  } catch (error) {
    console.error("Error fetching additional details:", error);
    res.status(500).json({ 
      errors: "Failed to fetch additional details"
    });
  }
};

adminCltr.getDashboardStats = async (req, res) => {
  if (req.currentUser.role !== "admin") {
    return res.status(403).json({ errors: "Access denied. Admin only." });
  }

  try {
    const totalUsers = await User.countDocuments({ role: { $ne: "admin" } });
    const totalEvents = await Event.countDocuments();
    const totalVenues = await Venue.countDocuments();
  
    const recentEvents = await Event.find().sort({ createdAt: -1 }).limit(4).select("eventName date status");
    const recentVenues = await Venue.find().sort({ createdAt: -1 }).limit(4).select("venueName verificationStatus price");
    const recentUsers = await User.find({ role: { $ne: "admin" } }).sort({ createdAt: -1 }).limit(4).select("email role createdAt");
  
    const venuePayments = await VenuePayment.find({ status: "Success" });
    const eventPayments = await EventPayment.find({ status: "Success" });
  
    const totalRevenue = 
      venuePayments.reduce((sum, p) => sum + (p.platformFee || 0), 0) + 
      eventPayments.reduce((sum, p) => sum + (p.platformFee || 0), 0);
  
    const responseData = {
      stats: { totalUsers, totalEvents, totalVenues, totalRevenue },
      recentEvents,
      recentVenues,
      recentUsers,
    };
  
    // console.log(responseData);
    return res.json(responseData); // ✅ Final and only response
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    if (!res.headersSent) {
      return res.status(500).json({ errors: "Failed to fetch dashboard statistics" });
    } else {
      console.error("Response already sent. Skipping error response.");
    }
  }
}


  export default adminCltr