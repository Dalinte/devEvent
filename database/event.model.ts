import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: 'online' | 'offline' | 'hybrid';
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [1, 'Title cannot be empty'],
    maxlength: [100, 'Title cannot be exceed 100 characters']
  },
  slug: {
    type: String,
    unique: true,
    index: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [1, 'Description cannot be empty'],
    maxlength: [1000, 'Description cannot be exceed 1000 characters']
  },
  overview: {
    type: String,
    required: [true, 'Overview is required'],
    trim: true,
    minlength: [1, 'Overview cannot be empty'],
    maxlength: [500, 'Overview cannot be exceed 500 characters']
  },
  image: {
    type: String,
    required: [true, 'Image URL is required'],
    trim: true,
    minlength: [1, 'Image URL cannot be empty']
  },
  venue: {
    type: String,
    required: [true, 'Venue is required'],
    trim: true,
    minlength: [1, 'Venue cannot be empty']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    minlength: [1, 'Location cannot be empty']
  },
  date: {
    type: String,
    required: [true, 'Date is required'],
    trim: true,
    minlength: [1, 'Date cannot be empty']
  },
  time: {
    type: String,
    required: [true, 'Time is required'],
    trim: true,
    minlength: [1, 'Time cannot be empty']
  },
  mode: {
    type: String,
    required: [true, 'Mode is required'],
    enum: ['online', 'offline', 'hybrid'],
    trim: true,
    minlength: [1, 'Mode cannot be empty']
  },
  audience: {
    type: String,
    required: [true, 'Audience is required'],
    trim: true,
    minlength: [1, 'Audience cannot be empty']
  },
  agenda: {
    type: [String],
    required: [true, 'Agenda is required'],
    validate: {
      validator: function(agenda: string[]) {
        return agenda.length > 0 && agenda.every(item => item.trim().length > 0);
      },
      message: 'Agenda must contain at least one non-empty item'
    }
  },
  organizer: {
    type: String,
    required: [true, 'Organizer is required'],
    trim: true,
    minlength: [1, 'Organizer cannot be empty']
  },
  tags: {
    type: [String],
    required: [true, 'Tags are required'],
    validate: {
      validator: function(tags: string[]) {
        return tags.length > 0 && tags.every(tag => tag.trim().length > 0);
      },
      message: 'Tags must contain at least one non-empty item'
    }
  }
}, {
  timestamps: true
});

// Generate URL-friendly slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Normalize date to ISO format and time to consistent format
function normalizeDateTime(date: string, time: string): { normalizedDate: string; normalizedTime: string } {
  // Try to parse date and convert to ISO format
  const dateObj = new Date(date);
  const normalizedDate = dateObj.toISOString().split('T')[0];
  
  // Normalize time to HH:MM format
  const timeMatch = time.match(/(\d{1,2}):?(\d{2})?\s*(am|pm)?/i);
  if (timeMatch) {
    let hours = parseInt(timeMatch[1]);
    const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
    const period = timeMatch[3]?.toLowerCase();
    
    if (period === 'pm' && hours !== 12) hours += 12;
    if (period === 'am' && hours === 12) hours = 0;
    
    const normalizedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    return { normalizedDate, normalizedTime };
  }
  
  return { normalizedDate, normalizedTime: time };
}

// Pre-save hook for slug generation and date/time normalization
eventSchema.pre('save', async function() {
  const event = this;
  
  // Generate slug only if title is new or modified
  if (!event.slug || event.isModified('title')) {
    const baseSlug = generateSlug(event.title);
    let slug = baseSlug;
    let counter = 1;
    
    // Ensure slug uniqueness
    while (await mongoose.models.Event?.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    event.slug = slug;
  }
  
  // Normalize date and time if they're modified
  if (event.isModified('date') || event.isModified('time')) {
    const { normalizedDate, normalizedTime } = normalizeDateTime(event.date, event.time);
    event.date = normalizedDate;
    event.time = normalizedTime;
  }
});

export const Event = mongoose.model<IEvent>('Event', eventSchema);
