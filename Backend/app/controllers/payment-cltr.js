import Stripe from "stripe";
import EventPayment from "../models/eventPayment-model.js";
import VenuePayment from "../models/venuePayment-model.js"
import Venue from "../models/venue-model.js";
import {Event} from "../models/event-model.js"
import User from "../models/user-model.js";
import { config } from 'dotenv'
config()

const paymentCltr = {}
// console.log(process.env.STRIPE_SECRET_KEY)

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });


paymentCltr.pay = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.currentUser) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const { venueId, checkInDate, checkOutDate, eventId, ticketType, ticketQuantity } = req.body;
    const userId = req.currentUser.userId; // Get user ID from authenticated user

    let totalAmount = 0, platformFee = 0, finalAmount = 0, paymentData = {}, modelType = "";
    let numDays = 0; // Initialize numDays here

    let venue, selectedTicket, renterId, hostId;

    if (venueId) {
      // 🏢 Venue Booking Payment
      venue = await Venue.findById(venueId);
      if (!venue) return res.status(404).json({ error: "Venue not found" });

      // Get renterId from venue
      renterId = venue.ownerId;

      numDays = Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24));
      if (numDays <= 0) return res.status(400).json({ error: "Invalid check-in/check-out dates" });

      totalAmount = venue.price.dailyRate * numDays;
      platformFee = totalAmount * 0.1;
      finalAmount = totalAmount - platformFee;
      
      paymentData = {
        venueId,
        venueName: venue.venueName,
        venueAddress: venue.address,
        checkInDate,
        checkOutDate
      };
      modelType = "Venue";
    } 
    else if (eventId) {
      // 🎟 Event Ticket Payment
      const event = await Event.findById(eventId);
      if (!event) return res.status(404).json({ error: "Event not found" });

      // Get hostId from event
      hostId = event.organizer;

      selectedTicket = event.ticketTypes.find((t) => t.name === ticketType);
      if (!selectedTicket) return res.status(400).json({ error: "Invalid ticket type" });

      if (ticketQuantity > selectedTicket.availableQuantity) {
        return res.status(400).json({ error: "Not enough tickets available" });
      }

      totalAmount = selectedTicket.price * ticketQuantity;
      platformFee = totalAmount * 0.1;
      finalAmount = totalAmount - platformFee;

      paymentData = {
        eventId,
        eventName: event.eventName,
        eventDate: event.date,
        ticketType,
        ticketQuantity
      };
      modelType = "Event";
    } 
    else {
      return res.status(400).json({ error: "Invalid request. Provide venueId or eventId." });
    }

    // Create a Stripe Customer
    const customer = await stripe.customers.create({
      name: "Testing",
      address: { line1: "India", postal_code: "585101", city: "Kalaburagi", state: "KA", country: "US" },
    });

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "inr",
          product_data: {
            name: modelType === "Venue" ? paymentData.venueName : paymentData.eventName,
            description: modelType === "Venue" ? paymentData.venueAddress : `Event on ${new Date(paymentData.eventDate).toLocaleDateString()}`,
          },
          unit_amount: modelType === "Venue" ? venue.price.dailyRate * 100 : selectedTicket.price * 100,
        },
        quantity: modelType === "Venue" ? numDays : ticketQuantity,
      }],
      mode: "payment",
      metadata: {
        ...paymentData,
        platformFee: platformFee.toFixed(2),
        finalAmount: finalAmount.toFixed(2),
      },
      success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
      customer: customer.id,
    });

    // Store Payment in Correct Model
    if (modelType === "Venue") {
      const newPayment = new VenuePayment({
        user: userId,
        renterId: renterId,
        venue: venueId,
        venueName: paymentData.venueName,
        venueAddress: paymentData.venueAddress,
        checkInDate,
        checkOutDate,
        amount: totalAmount,
        platformFee,
        finalAmount,
        status: "Pending",
        stripeSessionId: session.id,
      });
      await newPayment.save();
    } 
    else if (modelType === "Event") {
      const newPayment = new EventPayment({
        user: userId,
        hostId: hostId,
        event: eventId,
        eventName: paymentData.eventName,
        eventDate: paymentData.eventDate,
        ticketType,
        ticketQuantity,
        amount: totalAmount,
        platformFee,
        finalAmount,
        status: "Pending",
        stripeSessionId: session.id,
      });
      await newPayment.save();
    }

    res.status(200).json({ sessionId: session.id, url: session.url });

  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ 
      error: "Failed to create checkout session",
      details: error.message 
    });
  }
};


paymentCltr.updateStatus = async (req, res) => {
    try {
      const { sessionId } = req.params; // Extract session ID from request URL
      const { status } = req.body; // Get status ("Success" or "Failed") from request body
  
      // ✅ Find the payment record by sessionId in both models
      let payment = await VenuePayment.findOne({ stripeSessionId: sessionId });
      
      if (!payment) {
        payment = await EventPayment.findOne({ stripeSessionId: sessionId });
      }
  
      if (!payment) {
        return res.status(404).json({ error: "Payment record not found" });
      }
  
      // ✅ Update the payment status
      payment.status = status;
      await payment.save();

      // ✅ If payment is successful and it's an event payment, update ticket quantity
      if (status === "Success" && payment.event) {
        const event = await Event.findById(payment.event);
        if (event) {
          // Find the ticket type and update its quantity
          const ticketType = event.ticketTypes.find(t => t.name === payment.ticketType);
          if (ticketType) {
            ticketType.availableQuantity -= payment.ticketQuantity;
            await event.save();
          }
        }
      }
  
      return res.status(200).json(payment); // Send updated payment details
    } catch (error) {
      console.error("Error updating payment status:", error);
      return res.status(500).json({ error: "Failed to update payment status" });
    }
  };

paymentCltr.getVenuePayments = async (req, res) => {
  try {
    const userId = req.currentUser.userId;
    
    // Get payments where user is either the payer or the renter
    const payments = await VenuePayment.find({renterId: userId,status:"Success" }).sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching venue payments:", error);
    res.status(500).json({ error: "Failed to fetch venue payments" });
  }
};

paymentCltr.getEventPayments = async (req, res) => {
  try {
    const userId = req.currentUser.userId;
    
    // Get payments where user is either the payer or the host
    const payments = await EventPayment.find({ hostId: userId,status:"Success" } ).sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching event payments:", error);
    res.status(500).json({ error: "Failed to fetch event payments" });
  }
};

paymentCltr.getPaymentById = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const userId = req.currentUser.userId;

    // Try to find payment in both models
    let payment = await VenuePayment.findOne({
      _id: paymentId,
      $or: [
        { user: userId },
        { renterId: userId }
      ]
    });

    if (!payment) {
      payment = await EventPayment.findOne({
        _id: paymentId,
        $or: [
          { user: userId },
          { hostId: userId }
        ]
      });
    }

    if (!payment) {
      return res.status(404).json({ error: "Payment not found or unauthorized" });
    }

    res.status(200).json(payment);
  } catch (error) {
    console.error("Error fetching payment:", error);
    res.status(500).json({ error: "Failed to fetch payment" });
  }
};

paymentCltr.getPaymentByVenueID = async (req, res) => {
  try {
    const { venueId } = req.params;
    
    // Get only successful payments for this venue
    const payments = await VenuePayment.find({ 
      venue: venueId,
      status: "Success" 
    }).sort({ createdAt: -1 });

    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching venue payments:", error);
    res.status(500).json({ error: "Failed to fetch venue payments" });
  }
};

paymentCltr.getAllSuccessfulPayments = async (req, res) => {
  try {
    if (req.currentUser.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admin only." });
    }

    const venuePayments = await VenuePayment.find({ status: "Success" })
      .populate("user", "email")
      .populate("renterId", "email")
      .sort({ createdAt: -1 });

    const eventPayments = await EventPayment.find({ status: "Success" })
      .populate("user", "email")
      .populate("hostId", "email")
      .sort({ createdAt: -1 });

    const allPayments = [
      ...venuePayments.map(payment => ({
        ...payment.toObject(),
        type: "Venue",
        payerEmail: payment.user?.email || "Unknown User",
        receiverEmail: payment.renterId?.email || "Unknown Renter",
        itemName: payment.venueName || "Unknown Venue",
        itemDetails: {
          checkInDate: payment.checkInDate,
          checkOutDate: payment.checkOutDate,
          venueAddress: payment.venueAddress || "Address not available"
        }
      })),
      ...eventPayments.map(payment => ({
        ...payment.toObject(),
        type: "Event",
        payerEmail: payment.user?.email || "Unknown User",
        receiverEmail: payment.hostId?.email || "Unknown Host",
        itemName: payment.eventName || "Unknown Event",
        itemDetails: {
          eventDate: payment.eventDate,
          ticketType: payment.ticketType || "Unknown Type",
          ticketQuantity: payment.ticketQuantity || 0
        }
      }))
    ];

    const totalRevenue = allPayments.reduce((sum, payment) => sum + payment.finalAmount, 0);

    res.status(200).json({
      payments: allPayments,
      totalRevenue,
      totalTransactions: allPayments.length
    });

  } catch (error) {
    console.error("Error fetching all successful payments:", error);
    res.status(500).json({ error: "Failed to fetch payment details" });
  }
};

export default paymentCltr;


