import { Module } from '@nestjs/common';
import { TimersController } from './timers.controller';
import { TimersService } from './timers.service';
import { ServiceInfoModule } from '@marvel/common';
import { timersServiceInfo } from './utils';

@Module({
  imports: [ServiceInfoModule.register(timersServiceInfo)],
  controllers: [TimersController],
  providers: [TimersService],
})
export class TimersModule {}
