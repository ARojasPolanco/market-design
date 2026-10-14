// Formats a date in Argentina time (GMT-3), regardless of the server timezone.
// Render runs in UTC, so without an explicit timeZone the hour would be off by 3h.
export const formatArDate = (date = new Date()) =>
  new Date(date).toLocaleString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Argentina/Buenos_Aires',
  });
