import { HttpService } from '@nestjs/axios';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { ExecuteSuperheroTask, SuperheroTask } from './entities';
import { catchError, firstValueFrom, map } from 'rxjs';
import { AxiosError } from 'axios';

@Processor('timer')
export class SchedulersProcessor extends WorkerHost {
  private readonly logger: Logger;

  constructor(private readonly httpService: HttpService) {
    super();
    this.logger = new Logger(SchedulersProcessor.name);
  }

  async process(job: Job<SuperheroTask>): Promise<void> {
    try {
      switch (job.name) {
        case SuperheroTask.name:
          {
            const responseFromUrl = await firstValueFrom(
              this.httpService
                .post<ExecuteSuperheroTask, ExecuteSuperheroTask>(
                  job.data.url,
                  {
                    message: job.data.message,
                    superheroName: job.data.superheroName,
                    timerId: job.data.timerId,
                  },
                )
                .pipe(
                  map((response) => response.data),
                  catchError((error: AxiosError) => {
                    throw Error(
                      JSON.stringify(error?.response?.data) ?? error.message,
                    );
                  }),
                ),
            );
            this.logger.log(
              `Successfully executed task ${job.data.timerId}`,
              responseFromUrl,
            );
          }
          break;
        default:
          this.logger.error(`Unknown job type: ${job.name}`);
      }
    } catch (error) {
      this.logger.error(`Failed to execute task ${job.data.timerId}`, error);
    }
  }
}
