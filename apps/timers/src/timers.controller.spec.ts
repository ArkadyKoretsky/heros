import { Test, TestingModule } from '@nestjs/testing';
import { TimersController } from './timers.controller';
import { TimersService } from './timers.service';
import { ServiceInfoModule } from '@shield/common';
import {
  convertTimestampsToDate,
  getTotalTimeTillExecution,
  SuperheroData,
  timersServiceInfo,
} from './utils';
import { CreateTimer, ResponseTimer, Timer } from './entities';
import { NotFoundException } from '@nestjs/common';

describe(TimersController.name, () => {
  const superheroes: SuperheroData[] = [{ _id: '1234', fullName: 'Test' }];
  const timers: (Timer & { timerId: string })[] = [];
  const createTimer: CreateTimer = {
    hours: 0,
    minutes: 3,
    seconds: 0,
    message: 'Hello Test!',
    superheroId: '1234',
    url: 'http://test.com',
  };
  let timersController: TimersController;

  beforeEach(async () => {
    const timersServiceMock = {
      create: (createTimer: CreateTimer): ResponseTimer => {
        const superhero = superheroes.find(
          (superhero) => superhero._id === createTimer.superheroId,
        );
        if (!superhero) throw new NotFoundException('No such superhero');
        timers.push({
          timerId: '5678',
          superheroId: superhero._id,
          superheroName: superhero.fullName,
          message: createTimer.message,
          url: createTimer.url,
          executedAt: convertTimestampsToDate(
            createTimer.hours,
            createTimer.minutes,
            createTimer.seconds,
          ),
        });
        return {
          timerId: timers[0].timerId,
          totalSecondsTillExecution: getTotalTimeTillExecution(
            timers[0].executedAt,
            10 ** -3, // convert milliseconds to seconds
          ),
        };
      },
      getById: (id: string): ResponseTimer => {
        const timer = timers.find((timer) => timer.timerId === id);
        if (!timer) return { timerId: id, totalSecondsTillExecution: 0 };
        return {
          timerId: timer?.timerId ?? id,
          totalSecondsTillExecution: getTotalTimeTillExecution(
            timer?.executedAt ?? Date.now(),
            10 ** -3, // convert milliseconds to seconds
          ),
        };
      },
    };
    const app: TestingModule = await Test.createTestingModule({
      imports: [ServiceInfoModule.register(timersServiceInfo)],
      controllers: [TimersController],
      providers: [{ provide: TimersService, useValue: timersServiceMock }],
    }).compile();
    jest.useFakeTimers();
    timersController = app.get<TimersController>(TimersController);
  });

  describe('root', () => {
    it('should return timers service info', () => {
      expect(timersController.getTimersServiceInfo()).toBe(timersServiceInfo);
    });
  });

  describe('create timer', () => {
    it('should create new timer and return its id and total seconds till execution', async () => {
      const result = await timersController.createTimer(createTimer);
      expect(result).toEqual({
        timerId: '5678',
        totalSecondsTillExecution: 180, // 3 minutes
      });
      expect(timers).toHaveLength(1);
    });
  });

  describe('non existing hero', () => {
    it('throw not found exception', async () => {
      try {
        await timersController.createTimer({
          ...createTimer,
          superheroId: '888',
        });
      } catch (error) {
        expect(error).toEqual(new NotFoundException('No such superhero'));
      }
    });
  });

  describe('get timer by id', () => {
    it('should return timer by id and total seconds till execution', async () => {
      const result = await timersController.getTimerById('5678');
      expect(result).toEqual({
        timerId: '5678',
        totalSecondsTillExecution: 180, // 3 minutes
      });
    });
  });

  describe('get timer by id when timer not found', () => {
    it('should throw not found exception', async () => {
      expect(await timersController.getTimerById('9999')).toEqual({
        timerId: '9999',
        totalSecondsTillExecution: 0,
      });
    });
  });
});
