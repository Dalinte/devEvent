'use client';

import { type FormEvent, useState } from 'react';
import { createBooking } from '@/lib/actions/booking.actions';
import posthog from 'posthog-js'

interface IProps {
  eventId: string;
  slug: string;
}

const BookEvent = ({ eventId, slug }: IProps) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const { success } = await createBooking({ email, eventId, slug });

    if (success) {
      setSubmitted(true);
      posthog.capture('event_booked', { email, eventId, slug })
    } else {
      console.log('Booking creation failed');
      posthog.captureException('event_booked', { email, eventId, slug })
    }
  };

  return (
    <div id="book-event">
      {submitted ? (
        <p className="text-sm">Thank you for signing up!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              id="email"
              placeholder="Enter your email address"
            />
          </div>

          <button type="submit" className="button-submit">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};
export default BookEvent;
