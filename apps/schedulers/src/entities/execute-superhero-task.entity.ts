import { OmitType } from '@nestjs/swagger';
import { SuperheroTask } from './superhero-task.entity';

export class ExecuteSuperheroTask extends OmitType(SuperheroTask, [
  'msTillExecution',
  'url',
] as const) {}
