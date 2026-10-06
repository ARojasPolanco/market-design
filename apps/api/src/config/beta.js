// Closed beta for sellers: the three onboarding meetings.
// Dates are fixed in code (Argentina time, GMT-3). Each slot has a Meet link
// and a capacity; the link is only sent by email, never exposed by the public API.
export const BETA_SLOTS = [
  {
    key: '2026-10-11',
    label: 'Domingo 11 de octubre · 18:00 h',
    shortLabel: 'Dom 11/10 · 18 h',
    start: '2026-10-11T18:00:00-03:00',
    end: '2026-10-11T19:00:00-03:00',
    meetUrl: 'https://meet.google.com/ccq-fkjj-vfp',
    capacity: 10,
  },
  {
    key: '2026-10-14',
    label: 'Miércoles 14 de octubre · 18:00 h',
    shortLabel: 'Mié 14/10 · 18 h',
    start: '2026-10-14T18:00:00-03:00',
    end: '2026-10-14T19:00:00-03:00',
    meetUrl: 'https://meet.google.com/vgc-bshm-paa',
    capacity: 10,
  },
  {
    key: '2026-10-16',
    label: 'Viernes 16 de octubre · 18:00 h',
    shortLabel: 'Vie 16/10 · 18 h',
    start: '2026-10-16T18:00:00-03:00',
    end: '2026-10-16T19:00:00-03:00',
    meetUrl: 'https://meet.google.com/aaw-ijko-ojv',
    capacity: 10,
  },
];

export const getBetaSlot = (key) => BETA_SLOTS.find((slot) => slot.key === key);

export const BETA_VIDEO_URL =
  'https://res.cloudinary.com/ir5xkfth/video/upload/v1791308154/IMG_8625.mp4';
