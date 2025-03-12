export const convertTimestampsToDate = (
  hours: number,
  minutes: number,
  seconds: number,
): Date => new Date(Date.now() + Date.UTC(70, 0, 1, hours, minutes, seconds));

export const getTotalTimeTillExecution = (
  executedAt: Date,
  coefficient: number, // convert to another time units (different from milliseconds) if needed
): number => Math.round((executedAt.getTime() - Date.now()) * coefficient);
