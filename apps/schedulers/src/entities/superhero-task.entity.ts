import {
  IsInt,
  IsMongoId,
  IsUrl,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class SuperheroTask {
  /**
   * The ID of the timer related.
   * Should be a valid string of MongoDB ObjectID.
   * @example "67c9a4576e3b4ab36cce26e7"
   */
  @IsMongoId()
  timerId: string;

  /**
   * The super hero who requested this job.
   * @example "Tony Stark"
   */
  @MinLength(5)
  @MaxLength(20)
  superheroName: string;

  /**
   * Time of milliseconds till execution.
   * @example 180000
   */
  @IsInt()
  @Min(0)
  msTillExecution: number;

  /**
   * Message to execute when timer expires.
   * @example "Hello World!"
   */
  @MinLength(5)
  message: string;

  /**
   * The address that receives the message when timer expires.
   * @example "http://example.com"
   */
  @IsUrl()
  url: string;
}
