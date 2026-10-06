const pad = (value) => String(value).padStart(2, '0');

const toIcsDate = (dateInput) => {
  const date = new Date(dateInput);
  return (
    `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}` +
    `T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`
  );
};

const escapeIcs = (text = '') =>
  String(text)
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');

export function buildIcs({ uid, title, description, start, end, url, organizerEmail }) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Market Design//Beta vendedores//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${toIcsDate(new Date())}`,
    `DTSTART:${toIcsDate(start)}`,
    `DTEND:${toIcsDate(end)}`,
    `SUMMARY:${escapeIcs(title)}`,
    `DESCRIPTION:${escapeIcs(description)}`,
    `LOCATION:${escapeIcs(url)}`,
    `URL:${escapeIcs(url)}`,
  ];

  if (organizerEmail) {
    lines.push(`ORGANIZER;CN=Market Design:mailto:${organizerEmail}`);
  }

  lines.push('END:VEVENT', 'END:VCALENDAR');

  return `${lines.join('\r\n')}\r\n`;
}
