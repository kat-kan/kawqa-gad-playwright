const date = new Date();
const pastDate =
  new Date(date.setFullYear(date.getFullYear() - 1))
    .toISOString()
    .split('.')[0] + 'Z';
const futureDate =
  new Date(date.setFullYear(date.getFullYear() + 2))
    .toISOString()
    .split('.')[0] + 'Z';
export const customDate = {
  pastDate: pastDate,
  futureDate: futureDate,
};
