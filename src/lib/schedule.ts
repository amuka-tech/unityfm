export const WEEKDAY_SCHEDULE = [
  { start: '03:00', end: '06:45', show: 'Morning Devotion', host: 'Studio' },
  { start: '06:45', end: '07:00', show: 'News in Luo', host: 'News Desk' },
  { start: '07:00', end: '08:30', show: 'Announcements', host: 'Studio' },
  { start: '08:30', end: '10:45', show: 'Odiko Alyet', host: 'Studio' },
  { start: '10:45', end: '11:00', show: 'Sports Update', host: 'Sports Desk' },
  { start: '11:00', end: '12:45', show: 'Mid Morning Rave', host: 'Studio' },
  { start: '12:45', end: '13:00', show: 'News in Luo', host: 'News Desk' },
  { start: '13:00', end: '14:00', show: 'Announcements', host: 'Studio' },
  { start: '14:00', end: '16:30', show: 'The Afternoon Drive', host: 'Studio' },
  { start: '16:30', end: '17:00', show: 'Sports Update', host: 'Sports Desk' },
  { start: '17:00', end: '18:45', show: 'Announcements', host: 'Studio' },
  { start: '18:45', end: '19:00', show: 'News in Luo', host: 'News Desk' },
  { start: '19:00', end: '22:00', show: 'Gwec Apoko', host: 'Studio' },
  { start: '22:00', end: '23:00', show: 'Sports Updates', host: 'Sports Desk' },
  { start: '23:00', end: '03:00', show: 'Quiet Storm', host: 'Studio' },
];

export function formatTime(time24: string) {
  const [h, m] = time24.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12 < 10 ? '0' : ''}${h12}:${m < 10 ? '0' : ''}${m} ${ampm}`;
}

export function getCurrentShow() {
  // Uganda is UTC+3. Let's get the current time in UTC, then add 3 hours.
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const eat = new Date(utc + (3600000 * 3)); // EAT is UTC+3

  const day = eat.getDay();
  // If it's Saturday (6) or Sunday (0), we can just return a weekend default,
  // but let's assume the schedule runs every day for now, or return Weekend Programming.
  if (day === 0 || day === 6) {
    return {
      show: 'Weekend Programming',
      host: 'Various DJs',
      timeString: 'All Day'
    };
  }

  const currentHour = eat.getHours();
  const currentMinute = eat.getMinutes();
  const currentTotalMins = currentHour * 60 + currentMinute;

  for (const slot of WEEKDAY_SCHEDULE) {
    const [startH, startM] = slot.start.split(':').map(Number);
    const [endH, endM] = slot.end.split(':').map(Number);
    
    let startTotal = startH * 60 + startM;
    let endTotal = endH * 60 + endM;

    // Handle overnight shows (e.g. 23:00 to 03:00)
    if (endTotal <= startTotal) {
      if (currentTotalMins >= startTotal || currentTotalMins < endTotal) {
        return {
          ...slot,
          timeString: `${formatTime(slot.start)} - ${formatTime(slot.end)}`
        };
      }
    } else {
      if (currentTotalMins >= startTotal && currentTotalMins < endTotal) {
        return {
          ...slot,
          timeString: `${formatTime(slot.start)} - ${formatTime(slot.end)}`
        };
      }
    }
  }

  return {
    show: 'Radio Unity FM',
    host: 'Studio',
    timeString: 'Live'
  };
}
