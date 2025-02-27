import { Test, TestingModule } from '@nestjs/testing';
import { TimersController } from './timers.controller';
import { TimersService } from './timers.service';
import { ServiceInfoModule } from '@marvel/common';
import { timersServiceInfo } from './utils';

describe(TimersController.name, () => {
  let timersController: TimersController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ServiceInfoModule.register(timersServiceInfo)],
      controllers: [TimersController],
      providers: [TimersService],
    }).compile();

    timersController = app.get<TimersController>(TimersController);
  });

  describe('root', () => {
    it('should return timers service info', () => {
      expect(timersController.getTimersServiceInfo()).toBe(timersServiceInfo);
    });
  });
});
