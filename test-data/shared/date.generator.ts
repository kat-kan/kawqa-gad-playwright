const date = new Date(process.env.SHARED_DATE);
const pastDateISO = new Date(
  date.setFullYear(date.getFullYear() - 1),
).toISOString();

const pastDate = pastDateISO.split('.')[0] + 'Z';

const futureDateISO = new Date(
  date.setFullYear(date.getFullYear() + 2),
).toISOString();

const futureDate = futureDateISO.split('.')[0] + 'Z';

const futureDates: string[] = [];
const pastDates: string[] = [];
pastDates.push(pastDate);
pastDates.push(pastDateISO);
futureDates.push(futureDate);
futureDates.push(futureDateISO);

export const customDate = {
  pastDate: pastDate,
  futureDate: futureDate,
  pastDateISOFormat: pastDateISO,
  futureDateISOFormat: futureDateISO,
  futureDates,
  pastDates
};
