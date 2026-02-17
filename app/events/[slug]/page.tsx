import { Suspense } from 'react';
import EventDetails from '@/components/event/EventDetails';

const EventDetailsPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const slug = params.then((p) => p.slug)

  return (
    <Suspense fallback={<div>loading....</div>}>
      <EventDetails params={slug}/>
    </Suspense>
  )
};
export default EventDetailsPage;
