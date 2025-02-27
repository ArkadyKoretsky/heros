import { Test, TestingModule } from '@nestjs/testing';
import { SuperherosController } from './superheros.controller';
import { SuperherosService } from './superheros.service';
import { ServiceInfoModule } from '@marvel/common';
import { superherosServiceInfo } from './utils';

describe(SuperherosController.name, () => {
  let appController: SuperherosController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ServiceInfoModule.register(superherosServiceInfo)],
      controllers: [SuperherosController],
      providers: [SuperherosService],
    }).compile();

    appController = app.get<SuperherosController>(SuperherosController);
  });

  describe('root', () => {
    it('should return superheros service info', () => {
      expect(appController.getSuperherosServiceInfo()).toBe(
        superherosServiceInfo,
      );
    });
  });
});
