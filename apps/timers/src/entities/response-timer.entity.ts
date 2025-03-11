import { Types } from 'mongoose';

export class ResponseTimer {
  /**
   * Timer ID in DB
   */
  timerId: Types.ObjectId | string;

  /**
   * Calculated from current time and "executedAt"
   */
  totalSecondsTillExecution: number;
}
