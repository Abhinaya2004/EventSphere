import { Schema, model } from "mongoose";

const eventPaymentSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // User who made the booking
    hostId: { type: Schema.Types.ObjectId, ref: "User", required: false }, // Host of the event
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true }, // Event reference
    eventName: { type: String, required: true }, // Name of the event
    eventDate: { type: Date, required: true }, // Event date
    ticketType: { type: String, required: true }, // Ticket category (VIP, Regular, etc.)
    ticketQuantity: { type: Number, required: true, min: 1 }, // Number of tickets booked
    amount: { type: Number, required: true }, // Total amount paid
    platformFee: { type: Number, required: true }, // 10% deducted fee
    finalAmount: { type: Number, required: true }, // Remaining amount after deduction
    status: { type: String, enum: ["Pending", "Success", "Failed"], default: "Pending" }, // Payment status
    stripeSessionId: { type: String, required: true }, // Stripe Session ID for tracking payment
  },
  { timestamps: true }
);

const EventPayment = model("EventPayment", eventPaymentSchema);
export default EventPayment;
