import { Test, TestingModule } from '@nestjs/testing';
import { SchedulersController } from './schedulers.controller';
import { SchedulersService } from './schedulers.service';
import { schedulersServiceInfo } from './utils';
import { ServiceInfoModule } from '@shield/common';
import { SuperheroTask } from './entities';

describe(SchedulersController.name, () => {
  const tasksQueue: SuperheroTask[] = [];
  let schedulersController: SchedulersController;

  beforeEach(async () => {
    const schedulersServiceMock = {
      addSuperheroTask: (task: SuperheroTask): SuperheroTask => {
        tasksQueue.push(task);
        return task;
      },
    };
    const app: TestingModule = await Test.createTestingModule({
      imports: [ServiceInfoModule.register(schedulersServiceInfo)],
      controllers: [SchedulersController],
      providers: [
        { provide: SchedulersService, useValue: schedulersServiceMock },
      ],
    }).compile();

    schedulersController = app.get<SchedulersController>(SchedulersController);
  });

  describe('root', () => {
    it('should return schedulers service info', () => {
      expect(schedulersController.getSchedulersServiceInfo()).toBe(
        schedulersServiceInfo,
      );
    });
  });

  describe('add task to queue', () => {
    it('should add task to jobs queue', async () => {
      const task: SuperheroTask = {
        message: 'Test',
        superheroName: 'Test',
        timerId: '1234',
        url: 'http://example.com',
        msTillExecution: 10000,
      };
      await schedulersController.addSuperheroTask(task);
      expect(tasksQueue).toEqual([task]);
      expect(tasksQueue).toHaveLength(1);
    });
  });
});
