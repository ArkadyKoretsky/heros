import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ArrayNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';

@Schema({ timestamps: true, validateBeforeSave: true })
export class Superhero {
  /**
   * Full name of the superhero separated by single space.
   * @example "Tony Stark"
   */
  @MinLength(5)
  @MaxLength(20)
  @Matches(/^[A-Za-z]+ [A-Za-z]+$/)
  @Prop({ required: true, type: String, minlength: 5, maxlength: 20 })
  fullName: string;

  /**
   * Superhero's alias.
   * @example "Iron Man"
   */
  @MinLength(2)
  @MaxLength(15)
  @Prop({
    required: true,
    type: String,
    minlength: 2,
    maxlength: 15,
  })
  alias: string;

  /**
   * Superhero's abilities.
   * @example ["flight", "shoot", "AI"]
   */
  @ArrayNotEmpty()
  @MinLength(2, { each: true })
  @MaxLength(20, { each: true })
  @Prop({
    required: true,
    type: [String],
    validate: (powers: string[]) =>
      powers.length &&
      powers.every((power) => power.length >= 2 && power.length <= 20),
  })
  powers: string[];
}

export const superheroeschema = SchemaFactory.createForClass(Superhero);

export const projection = Object.fromEntries(
  Object.keys(new Superhero()).map((key) => [key, 1]),
);
