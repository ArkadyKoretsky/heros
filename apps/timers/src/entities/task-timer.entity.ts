import { IntersectionType, PickType } from '@nestjs/swagger';
import { ResponseTimer } from './response-timer.entity';
import { Timer } from './timer.entity';

export class TaskTimer extends IntersectionType(
  PickType(ResponseTimer, ['timerId'] as const),
  PickType(Timer, ['superheroName', 'url', 'message'] as const),
) {
  msTillExecution: number;
}
