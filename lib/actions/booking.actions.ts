'use server';

import connectDB from '@/lib/mongodb';
import { Booking } from '@/database';

interface IProps {
  eventId: string;
  slug: string;
  email: string;
}

export const createBooking = async (props: IProps) => {
  try {
    await connectDB();
    await Booking.create({ email: props.email, eventId: props.eventId });
    return { success: true };
  } catch (e) {
    console.log('Create booking failed', e);
    return { success: false };
  }
};
