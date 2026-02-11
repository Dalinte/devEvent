export interface Event {
  image: string;
  title: string;
  slug: string;
  location: string;
  date: string;
  time: string;
}

export const events: Event[] = [
  {
    image: '/images/event1.png',
    title: 'React Summit 2024',
    slug: 'react-summit-2024',
    location: 'Amsterdam, Netherlands',
    date: '2024-06-13',
    time: '9:00 AM CEST'
  },
  {
    image: '/images/event2.png',
    title: 'JSNation Conference',
    slug: 'jsnation-2024',
    location: 'Amsterdam, Netherlands',
    date: '2024-06-14',
    time: '9:00 AM CEST'
  },
  {
    image: '/images/event3.png',
    title: 'HackMIT 2024',
    slug: 'hackmit-2024',
    location: 'Cambridge, MA',
    date: '2024-09-14',
    time: '10:00 AM EDT'
  },
  {
    image: '/images/event4.png',
    title: 'PyCon US 2024',
    slug: 'pycon-us-2024',
    location: 'Pittsburgh, PA',
    date: '2024-04-15',
    time: '9:00 AM EDT'
  },
  {
    image: '/images/event5.png',
    title: 'AWS re:Invent',
    slug: 'aws-reinvent-2024',
    location: 'Las Vegas, NV',
    date: '2024-12-02',
    time: '8:00 AM PST'
  },
  {
    image: '/images/event6.png',
    title: 'Google I/O 2024',
    slug: 'google-io-2024',
    location: 'Mountain View, CA',
    date: '2024-05-14',
    time: '10:00 AM PDT'
  }
];
