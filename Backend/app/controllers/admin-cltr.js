import Venue from "../models/venue-model.js";

const adminCltr = {}

adminCltr.approveVenue = async (req, res) => {
    try {
      const { id } = req.params;
      const { isApproved, adminRemarks } = req.body;
  
      if (typeof isApproved !== "boolean") {
        return res.status(400).json({ message: "isApproved must be a boolean" });
      }
  
      const venue = await Venue.findById(id);
      if (!venue) {
        return res.status(404).json({ message: "Venue not found" });
      }
  
      venue.isApproved = isApproved;
      venue.adminRemarks = adminRemarks || (isApproved ? "Approved" : "Rejected");
      await venue.save();
  
      const statusMessage = isApproved
        ? "Venue approved successfully"
        : "Venue rejected successfully";
  
      res.status(200).json({
        message: statusMessage,
        venue,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to update venue approval", error: error.message });
    }
  };

  export default adminCltr