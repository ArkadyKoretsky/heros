export const convertTimestampsToDate = (
  hours: number,
  minutes: number,
  seconds: number,
): Date => new Date(Date.now() + Date.UTC(70, 0, 1, hours, minutes, seconds));

export const getTotalSecondsTillExecution = (executedAt: Date): number =>
  Math.round((executedAt.getTime() - Date.now()) / 1000);
