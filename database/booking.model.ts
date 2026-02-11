import mongoose, { Schema, Document } from 'mongoose';
import { Event } from './event.model';

export interface IBooking extends Document {
  eventId: mongoose.Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>({
  eventId: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Event ID is required'],
    index: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    validate: {
      validator: function(email: string) {
        // Email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      },
      message: 'Please provide a valid email address'
    }
  }
}, {
  timestamps: true
});

// Pre-save hook to validate that the referenced event exists
bookingSchema.pre('save', async function(next) {
  const booking = this;
  
  try {
    // Check if the referenced event exists
    const eventExists = await Event.findById(booking.eventId);
    if (!eventExists) {
      throw new Error('Referenced event does not exist');
    }
  } catch (error) {
    return error as Error
  }
});

bookingSchema.index({ eventId: 1 })
bookingSchema.index({ email: 1 })
bookingSchema.index({ eventId: 1, createdAt: -1 })

export const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
