import { Test, TestingModule } from '@nestjs/testing';
import { SchedulersController } from './schedulers.controller';
import { SchedulersService } from './schedulers.service';
import { schedulersServiceInfo } from './utils';
import { ServiceInfoModule } from '@marvel/common';

describe(SchedulersController.name, () => {
  let schedulersController: SchedulersController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ServiceInfoModule.register(schedulersServiceInfo)],
      controllers: [SchedulersController],
      providers: [SchedulersService],
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
});
