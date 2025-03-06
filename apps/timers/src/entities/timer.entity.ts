import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { isMongoId, IsMongoId, isURL, IsUrl, MinLength } from 'class-validator';

@Schema({ timestamps: true, validateBeforeSave: true })
export class Timer {
  @Prop({ required: true, type: String, minlength: 5, maxlength: 20 })
  superheroName: string;

  /**
   * The ID of the superhero related to this given timer.
   * Should be a valid string of MongoDB ObjectID.
   * @example "67c9a4576e3b4ab36cce26e7"
   */
  @Prop({ required: true, type: String, validate: isMongoId })
  @IsMongoId()
  superheroId: string;

  @Prop({ required: true, type: Date })
  executedAt: Date;

  /**
   * Message to execute when timer expires.
   * @example "Hello World!"
   */
  @Prop({ required: true, type: String, minlength: 5 })
  @MinLength(5)
  message: string;

  /**
   * The address that receives the message when timer expires.
   * @example "http://example.com"
   */
  @Prop({ required: true, type: String, validate: isURL })
  @IsUrl()
  url: string;
}

export const TimerSchema = SchemaFactory.createForClass(Timer);
TimerSchema.index({ executedAt: 1 }, { expireAfterSeconds: 0 });
