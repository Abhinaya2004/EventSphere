import { Schema,model } from "mongoose";

const venueSchema = new Schema({
  venueName: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  price: {
    dailyRate: {
      type: Number,
    },
    hourlyRate: {
      type: Number,
    },
    minHourlyDuration: {
      type: Number,
      default:1
    },
    maxHourlyDuration: {
      type: Number,
      default:8
    },
  },
  amenities: {
    type: [String],
    default: [],
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  ownerContact: {
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  documents: {
    type: Array, // URLs of uploaded documents
    default: [],
  },
  adminRemarks: {
    type: String,
    default: '',
  },
  images: {
    type: Array, // URLs of uploaded images
    default: [],
  },
}, {
  timestamps: true,
});

const Venue = model('Venue', venueSchema);
export default Venue;