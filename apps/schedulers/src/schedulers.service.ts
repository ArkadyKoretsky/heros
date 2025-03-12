import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { SuperheroTask } from './entities';

@Injectable()
export class SchedulersService {
  private readonly logger: Logger;

  constructor(
    @InjectQueue('timer')
    private readonly timersQueue: Queue<SuperheroTask>,
  ) {
    this.logger = new Logger(SchedulersService.name);
  }

  async addSuperheroTask(superheroTask: SuperheroTask): Promise<SuperheroTask> {
    try {
      const job = await this.timersQueue.add(
        SuperheroTask.name,
        superheroTask,
        { delay: superheroTask.msTillExecution },
      );
      this.logger.log(
        `Added superhero task ${superheroTask.timerId} to jobs queue`,
        { jobId: job.id, data: job.data, msTillExecution: job.delay },
      );
      return job.data;
    } catch (error) {
      this.logger.error(
        `Failed to add superhero task ${superheroTask.timerId} to jobs queue`,
        error,
      );
      throw error;
    }
  }
}
