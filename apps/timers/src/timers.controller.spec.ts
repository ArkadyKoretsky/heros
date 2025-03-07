import { Test, TestingModule } from '@nestjs/testing';
import { TimersController } from './timers.controller';
import { TimersService } from './timers.service';
import { ServiceInfoModule } from '@shield/common';
import {
  convertTimestampsToDate,
  getTotalSecondsTillExecution,
  SuperheroData,
  timersServiceInfo,
} from './utils';
import { CreateTimer, Timer } from './entities';
import { NotFoundException } from '@nestjs/common';

describe(TimersController.name, () => {
  const superheroes: SuperheroData[] = [{ _id: '1234', fullName: 'Test' }];
  const timers: (Timer & { _id: string })[] = [];
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
      create: (createTimer: CreateTimer) => {
        const superhero = superheroes.find(
          (superhero) => superhero._id === createTimer.superheroId,
        );
        if (!superhero) return new NotFoundException('No such superhero');
        timers.push({
          _id: '5678',
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
          _id: timers[0]._id,
          totalSecondsTillExecution: getTotalSecondsTillExecution(
            timers[0].executedAt,
          ),
        };
      },
      getById: (id: string) => {
        const timer = timers.find((timer) => timer._id === id);
        if (!timer) return { _id: id, totalSecondsTillExecution: 0 };
        return {
          _id: timer?._id ?? id,
          totalSecondsTillExecution: getTotalSecondsTillExecution(
            timer?.executedAt ?? Date.now(),
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
      const result = await timersController.createTimer({
        ...createTimer,
        superheroId: '888',
      });
      expect(result).toEqual(new NotFoundException('No such superhero'));
    });
  });

  describe('non existing hero', () => {
    it('throw not found exception', async () => {
      const result = await timersController.createTimer(createTimer);
      expect(result).toEqual({
        _id: '5678',
        totalSecondsTillExecution: 180, // 3 minutes
      });
      expect(timers).toHaveLength(1);
    });
  });

  describe('get timer by id', () => {
    it('should return timer by id and total seconds till execution', async () => {
      const result = await timersController.getTimerById('5678');
      expect(result).toEqual({
        _id: '5678',
        totalSecondsTillExecution: 180, // 3 minutes
      });
    });
  });

  describe('get timer by id when timer not found', () => {
    it('should throw not found exception', async () => {
      expect(await timersController.getTimerById('9999')).toEqual({
        _id: '9999',
        totalSecondsTillExecution: 0,
      });
    });
  });
});
