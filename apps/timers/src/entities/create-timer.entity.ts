import { PickType } from '@nestjs/swagger';
import { Timer } from './timer.entity';
import { IsInt, Min } from 'class-validator';

export class CreateTimer extends PickType(Timer, [
  'message',
  'superheroId',
  'url',
] as const) {
  @IsInt()
  @Min(0)
  hours: number;

  @IsInt()
  @Min(1)
  minutes: number;

  @IsInt()
  @Min(0)
  seconds: number;
}
