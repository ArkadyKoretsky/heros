import { HttpService } from '@nestjs/axios';
import {
  HttpException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { CreateTimer, ResponseTimer, TaskTimer, Timer } from './entities';
import { Model } from 'mongoose';
import { catchError, firstValueFrom, map, retry } from 'rxjs';
import { AxiosError } from 'axios';
import {
  convertTimestampsToDate,
  getTotalTimeTillExecution,
  SuperheroData,
} from './utils';

@Injectable()
export class TimersService {
  private readonly logger: Logger;

  private readonly endpoints: { superheroes: string; schedulers: string };

  private readonly retryAttempts: number;

  constructor(
    @InjectModel(Timer.name) private readonly timerModel: Model<Timer>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.logger = new Logger(TimersService.name);
    this.endpoints = {
      superheroes: `${this.configService.get('superheroes.baseUrl') ?? 'http://localhost:3000'}/${this.configService.get('superheroes.endpoint') ?? 'superheroes'}`,
      schedulers: `${this.configService.get('schedulers.baseUrl') ?? 'http://localhost:3002'}/${this.configService.get('schedulers.endpoint') ?? 'schedulers'}`,
    };
    this.retryAttempts = this.configService.get('timers.retryAttempts') ?? 2;
  }

  async create(createTimer: CreateTimer): Promise<ResponseTimer> {
    try {
      const superhero = await firstValueFrom(
        this.httpService
          .get<SuperheroData>(
            `${this.endpoints.superheroes}/${createTimer.superheroId}`,
          )
          .pipe(
            retry(this.retryAttempts),
            map((response) => response.data),
            catchError((error: AxiosError<HttpException>) => {
              const exception =
                error?.response?.data ??
                new ServiceUnavailableException(error.message); // mostly for connection refused error
              this.logger.error(
                `Failed to fetch superhero ${createTimer.superheroId} from DB`,
                error,
              );
              throw exception;
            }),
          ),
      );
      const savedTimer = await new this.timerModel({
        superheroId: superhero._id,
        superheroName: superhero.fullName,
        message: createTimer.message,
        url: createTimer.url,
        executedAt: convertTimestampsToDate(
          createTimer.hours,
          createTimer.minutes,
          createTimer.seconds,
        ),
      }).save();
      this.logger.log(
        `Created timer for superhero ${superhero.fullName}`,
        savedTimer,
      );
      this.httpService
        .post<TaskTimer, TaskTimer>(this.endpoints.schedulers, {
          timerId: savedTimer._id,
          message: savedTimer.message,
          superheroName: savedTimer.superheroName,
          url: savedTimer.url,
          msTillExecution: getTotalTimeTillExecution(savedTimer.executedAt, 1),
        })
        .subscribe({
          next: (response) =>
            this.logger.log(
              `Successfully added task to queue of timer ${savedTimer._id.toString()}`,
              response.data,
            ),
          error: (error) =>
            this.logger.error(
              `Failed to add task to queue of timer ${savedTimer._id.toString()}`,
              error,
            ),
        });
      return {
        timerId: savedTimer._id,
        totalSecondsTillExecution: getTotalTimeTillExecution(
          savedTimer.executedAt,
          10 ** -3, // convert milliseconds to seconds
        ),
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getById(id: string): Promise<ResponseTimer> {
    try {
      const timer = await this.timerModel.findById(id);
      if (!timer) {
        this.logger.error(`Timer with id ${id} not found in DB`);
        return { timerId: id, totalSecondsTillExecution: 0 };
      }
      this.logger.log(`Found timer with id ${id}`, timer);
      return {
        timerId: timer._id,
        totalSecondsTillExecution: getTotalTimeTillExecution(
          timer.executedAt,
          10 ** -3,
        ),
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
