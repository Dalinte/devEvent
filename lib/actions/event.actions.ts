'use server';

import connectDB from '@/lib/mongodb';
import Event from '@/database/event.model';

export const getSimilarEventsBySlug = async (slug: string) => {
  try {
    await connectDB();

    const event = await Event.findOne({ slug });
    if (!event) {
      throw new Error('Event not found');
    }

    return await Event.find({ _id: { $ne: event._id }, tags: { $in: event.tags } }).limit(6).lean();
  } catch (e) {
    return [];
  }
};
