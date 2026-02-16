import { BASE_URL } from '@/lib/global.consts';
import { notFound } from 'next/navigation';
import { IEvent } from '@/database/event.model';
import Image from 'next/image';
import EventDetailItem from '@/components/event/EventDetailItem';
import EventAgenda from '@/components/event/EventAgenda';
import EventTags from '@/components/event/EventTags';
import BookEvent from '@/components/BookEvent';
import { getSimilarEventsBySlug } from '@/lib/actions/event.actions';
import EventCard from '@/components/event/EventCard';

const EventDetailsPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const response = await fetch(`${BASE_URL}/api/events/${slug}`);
  if (!response.ok) {
    if (response.status === 404) return notFound();
    throw new Error(`Failed to fetch event: ${response.status}`);
  }
  const { event }: { event: IEvent } = await response.json();

  if (!event) return notFound();

  const bookings = 10;

  const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug)

  return (
    <section id="event">
      <div className="header">
        <h1>Event Description</h1>
        <p>{event.description}</p>
      </div>
      <div className="details">
        <div className="content">
          <Image
            src={event.image}
            alt={'Event Banner'}
            width={800}
            height={800}
            className="banner"
          />

          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{event.overview}</p>
          </section>

          <section className="flex-col-gap-2">
            <h2>Event Details</h2>
            <EventDetailItem label={event.date} icon={'/icons/calendar.svg'} alt={'date'} />
            <EventDetailItem label={event.time} icon={'/icons/clock.svg'} alt={'time'} />
            <EventDetailItem label={event.location} icon={'/icons/pin.svg'} alt={'location'} />
            <EventDetailItem label={event.mode} icon={'/icons/mode.svg'} alt={'mode'} />
            <EventDetailItem label={event.audience} icon={'/icons/audience.svg'} alt={'audience'} />
          </section>

          <EventAgenda agendaItems={event.agenda} />

          <section className={'flex-col-gap-2'}>
            <h2>About the Organizer</h2>
            <p>{event.organizer}</p>
          </section>

          <EventTags tags={event.tags} />
        </div>

        <aside className="booking">
          <div className="signup-card">
            <h2>Book Your Spot</h2>
            {bookings > 0 ? (
              <p className="text-sm">Join {bookings} people who have already booked their spot!</p>
            ) : (
              <p className="text-sm">Be the first to book your spot!</p>
            )}
            <BookEvent />
          </div>
        </aside>
      </div>

      <div className="flex w-full flex-col gap-4 pt-20">
        <h2>Similar Events</h2>
        <div className="events">
          {
            similarEvents.length > 0 && similarEvents.map((event, index) => (
              <EventCard key={event.slug} {...event} />
            ))
          }
        </div>
      </div>
    </section>
  );
};
export default EventDetailsPage;
