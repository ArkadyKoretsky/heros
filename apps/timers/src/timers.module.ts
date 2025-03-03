import { Module } from '@nestjs/common';
import { TimersController } from './timers.controller';
import { TimersService } from './timers.service';
import { ServiceInfoModule } from '@shield/common';
import { timersServiceInfo } from './utils';
import { YamlConfigModule } from '@shield/config';

@Module({
  imports: [ServiceInfoModule.register(timersServiceInfo), YamlConfigModule],
  controllers: [TimersController],
  providers: [TimersService],
})
export class TimersModule {}
