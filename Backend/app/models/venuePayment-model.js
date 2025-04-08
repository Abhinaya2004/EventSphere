import { Schema, model } from "mongoose";

const venuePaymentSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    renterId: { type: Schema.Types.ObjectId, ref: "User", required: false },
    venue: { type: Schema.Types.ObjectId, ref: "Venue", required: true },
    venueName: { type: String, required: true },
    venueAddress: { type: String, required: true },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    amount: { type: Number, required: true },
    platformFee: { type: Number, required: true }, // 10% deducted fee
    finalAmount: { type: Number, required: true }, // Remaining amount after deduction
    status: { type: String},
    stripeSessionId: { type: String, required: true }, // Stripe Payment Intent ID
  },
  { timestamps: true }
);

const VenuePayment = model("VenuePayment", venuePaymentSchema);

export default VenuePayment;
