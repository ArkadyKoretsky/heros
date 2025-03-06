import { HttpService } from '@nestjs/axios';
import {
  HttpException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { CreateTimer, ResponseTimer, Timer } from './entities';
import { Model } from 'mongoose';
import { catchError, firstValueFrom, map, retry } from 'rxjs';
import { AxiosError } from 'axios';
import { convertTimestampsToDate, getTotalSecondsTillExecution } from './utils';

@Injectable()
export class TimersService {
  private readonly logger: Logger;

  private readonly superheroesEndpoint: string;

  private readonly retryAttempts: number;

  constructor(
    @InjectModel(Timer.name) private readonly timerModel: Model<Timer>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.logger = new Logger(TimersService.name);
    this.superheroesEndpoint =
      this.configService.get('superheroes.endpoint') ?? 'superheroes';
    this.retryAttempts = this.configService.get('timers.retryAttempts') ?? 2;
  }

  async create(createTimer: CreateTimer): Promise<ResponseTimer> {
    try {
      const superhero = await firstValueFrom(
        this.httpService
          .get<{
            _id: string;
            fullName: string;
          }>(`${this.superheroesEndpoint}/${createTimer.superheroId}`)
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
      return {
        _id: savedTimer._id,
        totalSecondsTillExecution: getTotalSecondsTillExecution(
          savedTimer.executedAt,
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
        return { _id: id, totalSecondsTillExecution: 0 };
      }
      this.logger.log(`Found timer with id ${id}`, timer);
      return {
        _id: timer._id,
        totalSecondsTillExecution: getTotalSecondsTillExecution(
          timer.executedAt,
        ),
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
