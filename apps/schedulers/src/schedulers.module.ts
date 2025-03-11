import { Module } from '@nestjs/common';
import { SchedulersController } from './schedulers.controller';
import { SchedulersService } from './schedulers.service';
import { ServiceInfoModule } from '@shield/common';
import { RedisConnectionOptions, schedulersServiceInfo } from './utils';
import { YamlConfigModule } from '@shield/config';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ServiceInfoModule.register(schedulersServiceInfo),
    YamlConfigModule,
    BullModule.registerQueueAsync({
      name: 'timers',
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: configService.get<RedisConnectionOptions>('redis') ?? {},
      }),
      inject: [ConfigService],
    }),
    HealthModule,
  ],
  controllers: [SchedulersController],
  providers: [SchedulersService],
})
export class SchedulersModule {}
