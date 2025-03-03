import { Module } from '@nestjs/common';
import { SchedulersController } from './schedulers.controller';
import { SchedulersService } from './schedulers.service';
import { ServiceInfoModule } from '@shield/common';
import { schedulersServiceInfo } from './utils';

@Module({
  imports: [ServiceInfoModule.register(schedulersServiceInfo)],
  controllers: [SchedulersController],
  providers: [SchedulersService],
})
export class SchedulersModule {}
